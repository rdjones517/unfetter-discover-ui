import Ember from "ember";

/**
 * Course of Action Collection Component for listing Courses of Actions with associated ratings
 *
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {string} */
    tagName: "ul",

    /** @type {RegExp} */
    numberPattern: new RegExp("(\\d+)"),

    /**
     * Course of Actions Sorted using External Identifier
     *
     * @function
     * @returns {Array} Sorted Array of Course of Action records
     */
    courseOfActionsSorted: Ember.computed("courseOfActions", "referencedObjects", "relatedCourseOfActions.[]", function() {
        let referencedObjects = this.get("referencedObjects");
        if (referencedObjects === undefined) {
            referencedObjects = [];
        }

        const courseOfActions = this.get("courseOfActions");
        const sorted = [];
        const relatedCourseOfActions = this.get("relatedCourseOfActions");

        courseOfActions.forEach(function(courseOfAction) {
            let courseOfActionProxy = Ember.ObjectProxy.create({
                content: courseOfAction
            });

            let id = courseOfAction.get("id");

            let referencedObject = referencedObjects.findBy("object_ref", id);
            if (referencedObject) {
                const rating = referencedObject.get("rating_marking_definition.definition.rating");
                courseOfActionProxy.set("rating", rating);
                courseOfActionProxy.set("ratingLabel", referencedObject.get("rating_marking_definition.definition.label"));
                courseOfActionProxy.set("ratingIcon", referencedObject.get("ratingIcon"));


                if (rating === undefined) {
                    courseOfActionProxy.set("selected", false);
                } else if (relatedCourseOfActions === undefined) {
                    courseOfActionProxy.set("selected", true);
                } else {
                    let selected = false;

                    relatedCourseOfActions.forEach(function(relatedCourseOfAction) {
                        const relatedId = relatedCourseOfAction.get("id");
                        if (id === relatedId) {
                            selected = true;
                        }
                    });

                    courseOfAction.set("selected", selected);
                }
            }

            sorted.push(courseOfActionProxy);
        });
        sorted.sort(Ember.$.proxy(this.externalIdSortHandler, this));

        return sorted;
    }),

    /**
     * External Identifier Sort Handler using number from External Identifier
     *
     * @param {Object} first First Object for comparison
     * @param {Object} second Second Object for comparision
     * @return {number} Result of External Identifier comparison
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
     * @param {string} label Label
     * @return {number} Number found in label
     */
    getNumber(label) {
        let number = 0;
        const matcher = this.numberPattern.exec(label);
        if (matcher) {
            const numberGroup = matcher[1];
            number = parseInt(numberGroup);
        }
        return number;
    }
});
