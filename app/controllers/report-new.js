import Ember from "ember";

/**
 * Report Kill Chain Phase Controller for visualization of Kill Chain summaries associated with Report model
 *
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend({
    /**
     * Query Parameters
     *
     * @type {Array}
     */
    queryParams: ["page", "step"],

    /**
     * Number Pattern for parsing Labels
     *
     * @type {Object}
     */
    numberPattern: new RegExp("(\\d+)"),

    /**
     * Granular Marking service
     *
     * @type {Object}
     */
    granularMarkingService: Ember.inject.service("granular-marking"),

    /**
     * Page set from Query Parameters
     *
     * @type {number}
     */
    page: 0,

    /**
     * Step set from Query Parameters
     *
     * @type {string}
     */
    step: undefined,

    /** Items Per Page */
    itemsPerPage: 3,

    /** Last Page */
    lastPage: 0,

    /**
     * Page Observer updates alert status
     *
     * @function
     * @return {undefined}
     */
    pageObserver: Ember.observer("page", function() {
        var model = this.get("model");
        if (model) {
            this.set("model.alert", undefined);
        }
    }),

    /**
     * Published Observer updates alert status
     *
     * @function
     * @return {undefined}
     */
    publishedObserver: Ember.observer("model.item.published", function() {
        var model = this.get("model");
        if (model) {
            this.set("model.alert", undefined);
        }
    }),

    /**
     * Confirmation Step
     *
     * @function
     * @return {boolean} Status of confirmation step selected
     */
    confirmationStep: Ember.computed("step", function() {
        const step = this.get("step");
        return (step === "confirmation");
    }),

    /**
     * Page Transition computed based on page numbers
     *
     * @function
     * @return {string} Transition animation
     */
    pageTransition: Ember.computed("page", function() {
        const lastPage = this.get("lastPage");
        const page = this.get("page");
        this.set("lastPage", page);

        let transition = "toRight";
        if (page > lastPage) {
            transition = "toLeft";
        }
        return transition;
    }),

    /**
     * Previous Page
     *
     * @function
     * @return {number} Previous Page Number
     */
    previousPage: Ember.computed("page", function () {
        let previousPage;

        const page = this.get("page");
        if (page) {
            previousPage = page - 1;
        }

        return previousPage;
    }),

    /**
     * Previous Page Disabled
     *
     * @function
     * @return {boolean} Previous Page Disabled status based on previous page number
     */
    previousPageDisabled: Ember.computed.not("previousPage"),

    /**
     * Next Page
     *
     * @function
     * @return {number} Next Page Number based on page number and Courses of Action
     */
    nextPage: Ember.computed("page", "courseOfActionsSorted", function () {
        let nextPage;

        const page = this.get("page");
        if (page) {
            nextPage = page + 1;
        } else {
            nextPage = 2;
        }

        const itemsPerPage = this.get("itemsPerPage");
        let index = page - 1;
        index = index * itemsPerPage;
        const endIndex = index + itemsPerPage;

        const courseOfActionsSorted = this.get("courseOfActionsSorted");

        if (endIndex >= courseOfActionsSorted.length) {
            nextPage = 0;
        }

        return nextPage;
    }),

    /**
     * Next Page Disabled
     *
     * @function
     * @return {boolean} Next Page Disabled status based on next page number
     */
    nextPageDisabled: Ember.computed.not("nextPage"),

    /**
     * Current Course of Action
     *
     * @function
     * @return {Object} Current Course of Action selected based on page number
     */
    currentCourseOfAction: Ember.computed("courseOfActionsSorted", "page", function () {
        const courseOfActionsSorted = this.get("courseOfActionsSorted");
        const page = this.get("page");
        let index = 0;

        if (page) {
            index = page - 1;
        }

        if (index >= courseOfActionsSorted.length) {
            index = 0;
        }

        return courseOfActionsSorted[index];
    }),

    /**
     * Current Course of Actions
     *
     * @function
     * @return {Array} Array of Courses of Action based on page number
     */
    currentCourseOfActions: Ember.computed("courseOfActionsSorted", "page", "model.ratingMarkingDefinitions", function () {
        const courseOfActionsSorted = this.get("courseOfActionsSorted");
        const page = this.get("page");

        const itemsPerPage = this.get("itemsPerPage");
        let index = 0;

        if (page) {
            index = page - 1;
            index = index * itemsPerPage;
        }

        if (index >= courseOfActionsSorted.length) {
            index = 0;
        }

        let endIndex = index + itemsPerPage;
        if (endIndex >= courseOfActionsSorted.length) {
            endIndex = courseOfActionsSorted.length;
        }

        return courseOfActionsSorted.slice(index, endIndex);
    }),

    /**
     * Rating Marking Definitions
     *
     * @function
     * @return {Array} Rating Marking Definitions enhanced with icons
     */
    ratingMarkingDefinitions: Ember.computed("model.ratingMarkingDefinitions", function() {
        const ratingMarkingDefinitions = this.get("model.ratingMarkingDefinitions");
        const proxies = [];
        const granularMarkingService = this.get("granularMarkingService");

        ratingMarkingDefinitions.forEach(function(ratingMarkingDefinition) {
            const proxy = Ember.ObjectProxy.create({
                content: ratingMarkingDefinition
            });

            const rating = ratingMarkingDefinition.get("definition.rating");
            const icon = granularMarkingService.getIcon(rating);
            proxy.set("icon", icon);

            const label = ratingMarkingDefinition.get("definition.label");
            const labelClassName = label.toLowerCase();
            proxy.set("labelClassName", `text-mitigation-${labelClassName}`);

            proxies.push(proxy);
        });

        return proxies;
    }),

    /**
     * Course of Actions Sorted using External Identifier
     *
     * @function
     * @return {Array} Courses of Action enhanced with default Rating Marking and sorted based on External Identifier
     */
    courseOfActionsSorted: Ember.computed("model.courseOfActions", "ratingMarkingDefinitions", function () {
        const courseOfActions = this.get("model.courseOfActions");
        let sorted = [];
        if (courseOfActions) {
            sorted = courseOfActions.toArray();
        }
        sorted.sort(Ember.$.proxy(this.externalIdSortHandler, this));

        const courseOfActionProxies = [];
        const ratingMarkings = this.get("ratingMarkingDefinitions");

        sorted.forEach(function(courseOfAction) {
            let courseOfActionProxy = Ember.ObjectProxy.create({
                content: courseOfAction
            });
            courseOfActionProxies.push(courseOfActionProxy);

            if (ratingMarkings) {
                const ratingMarking = ratingMarkings.objectAt(0);
                courseOfActionProxy.set("ratingMarkingDefinition", ratingMarking);
            }
        });

        return courseOfActionProxies;
    }),

    /**
     * External Identifier Sort Handler using number from External Identifier
     *
     * @param {Object} first First Object
     * @param {Object} second Second Object
     * @return {number} Sort Comparison Status
     */
    externalIdSortHandler(first, second) {
        let firstId = first.get("external_references.0.external_id");
        const firstNumber = this.getNumber(firstId);

        let secondId = second.get("external_references.0.external_id");
        const secondNumber = this.getNumber(secondId);

        if (firstNumber < secondNumber) {
            return -1;
        }
        if (firstNumber > secondNumber) {
            return 1;
        }
        return 0;
    },

    /**
     * Get Number from label
     *
     * @param {string} label String Label
     * @return {number} Number parsed from label
     */
    getNumber(label) {
        let number = 0;
        const matcher = this.numberPattern.exec(label);
        if (matcher) {
            const numberGroup = matcher[1];
            number = parseInt(numberGroup);
        }
        return number;
    },

    /** @type {Object} */
    actions: {
        /**
         * Save Item
         *
         * @function actions:save
         * @param {Object} item Item Object to be created
         * @return {undefined}
         */
        save(item) {
            const courseOfActions = this.get("courseOfActionsSorted");
            const self = this;
            courseOfActions.forEach(function (courseOfAction) {
                const objectRef = courseOfAction.get("id");

                const objectRefs = item.object_refs;
                if (objectRefs.contains(objectRef) === false) {
                    objectRefs.pushObject(objectRef);

                    const ratingMarkingDefinition = courseOfAction.get("ratingMarkingDefinition");
                    const index = objectRefs.indexOf(objectRef);
                    const selector = `object_refs[${index}]`;
                    const markingRef = ratingMarkingDefinition.id;

                    if (markingRef) {
                        const granularMarking = {
                            selectors: [
                                selector
                            ],
                            marking_ref: markingRef
                        };

                        item.granular_markings.pushObject(granularMarking);
                    }
                }
            });

            const store = this.get("store");
            const record = store.createRecord("report", item);
            const promise = record.save();
            promise.then(function (reportRecord) {
                const id = reportRecord.get("id");
                self.transitionToRoute("report-dashboard", id);
            });
            promise.catch(function (error) {
                var alert = {
                    label: "Save Failed",
                    error: error
                };
                self.set("model.alert", alert);
            });
        }
    }
});
