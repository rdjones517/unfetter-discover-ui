import Ember from "ember";
import ReportDashboardMitigationMixin from "../mixins/report-dashboard-mitigation";

/**
 * Report Kill Chain Phase Controller for visualization of Kill Chain summaries associated with Report model
 *
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend(ReportDashboardMitigationMixin, {
    mitigationsColors: ["rgb(204, 204, 204)", "rgb(158, 1, 66)", "rgb(231, 197, 105)", "rgb(244, 109, 67)", "rgb(29, 145, 133)"],

    queryParams: [
        "attackPatternId"
    ],

    attackPatternId: undefined,

    attackPatternRelationships: [],

    attackPatternRelatedObjects: [],

    attackPatternGraph: {},

    /**
     * Attack Pattern Selected
     *
     * @function
     * @return {Object} Attack Pattern object selected based on attackPatternId
     */
    attackPatternSelected: Ember.computed("selectedAttackPatterns", "attackPatternId", function() {
        const selectedAttackPatterns = this.get("selectedAttackPatterns");
        return selectedAttackPatterns.findBy("selected", true);
    }),

    /**
     * Attack Pattern Identifier Observer updates Attack Pattern related objects based on selected Attack Pattern
     *
     * @function
     * @return {undefined}
     */
    attackPatternIdObserver: Ember.observer("attackPatternId", "attackPatternSelected", function() {
        let attackPatternId = this.get("attackPatternId");
        if (attackPatternId === undefined) {
            const attackPatternSelected = this.get("attackPatternSelected");
            if (attackPatternSelected) {
                attackPatternId = attackPatternSelected.get("id");
            }
        }
        if (attackPatternId) {
            const store = this.get("store");
            const parameters = {
                "filter[where][target_ref]": attackPatternId
            };
            const promise = store.query("relationship", parameters);
            const self = this;
            promise.then(function(relationships) {
                self.set("attackPatternRelationships", relationships);
                self.set("attackPatternGraph", self.getGraph(relationships));

                let promises = [];
                relationships.forEach(function(relationship) {
                    let ref = relationship.get("source_ref");
                    let refType = ref.split("--")[0];
                    let promise = store.findRecord(refType, ref);
                    promises.push(promise);
                });

                Ember.RSVP.all(promises).then(function(objects) {
                    const objectsSorted = objects.sortBy("type");
                    self.set("attackPatternRelatedObjects", objectsSorted);
                });
            });
        } else {
            this.set("attackPatternRelatedObjects", []);
        }
    }),

    /**
     * Related Course of Actions
     *
     * @function
     * @return {Array} Array of Course of Action Objects related to selected Attack Pattern
     */
    relatedCourseOfActions: Ember.computed("attackPatternRelatedObjects", function() {
        const relatedObjects = this.get("attackPatternRelatedObjects");
        const relatedCourseOfActions = [];

        relatedObjects.forEach(function(relatedObject) {
            const type = relatedObject.get("type");
            if (type === "course-of-action") {
                relatedCourseOfActions.push(relatedObject);
            }
        });

        return relatedCourseOfActions;
    }),

    /**
     * Phase Name Groups with selected status for navigation
     *
     * @function
     * @return {Array} Array of Kill Chain Phase Name Groups
     */
    phaseNameGroups: Ember.computed("model.attackPatterns", "model.killChainPhase.phase_name", function() {
        const attackPatterns = this.get("model.attackPatterns");
        const phaseName = this.get("model.killChainPhase.phase_name");
        const phaseNameGroups = this.get("attackPatternService").getPhaseNameGroups(attackPatterns);

        phaseNameGroups.forEach(function(phaseNameGroup) {
            if (phaseName === phaseNameGroup.get("phaseName")) {
                phaseNameGroup.set("selected", true);
            }
        });

        return phaseNameGroups;
    }),

    /**
     * Kill Chain Phase Attack Patterns filtered based on Phase Name
     *
     * @override
     * @function
     * @return {Array} Array of Attack Patterns based on selected Kill Chain Phases
     */
    selectedAttackPatterns: Ember.computed("model.attackPatterns", "model.killChainPhase.phase_name", "relationshipReferencedObjects", "attackPatternId", function() {
        const attackPatterns = this.get("model.attackPatterns");
        const selectedAttackPatternId = this.get("attackPatternId");
        const phaseName = this.get("model.killChainPhase.phase_name");
        const relationshipReferencedObjects = this.get("relationshipReferencedObjects");

        const killChainPhaseAttackPatterns = [];

        attackPatterns.forEach(function(attackPattern) {
            let killChainPhases = attackPattern.get("kill_chain_phases");
            let matched = false;
            killChainPhases.forEach(function(killChainPhase) {
                if (phaseName === killChainPhase.phase_name) {
                    matched = true;
                }
            });
            if (matched) {
                let attackPatternProxy = Ember.ObjectProxy.create({
                    content: attackPattern
                });

                let attackPatternId = attackPattern.get("id");

                if (selectedAttackPatternId === attackPatternId) {
                    attackPatternProxy.set("selected", true);
                } else {
                    attackPatternProxy.set("selected", false);
                }

                let relationships = relationshipReferencedObjects.filterBy("target_ref", attackPatternId);
                attackPatternProxy.set("relationships", relationships);

                attackPatternProxy.set("labelLowerCased", "unknown");

                let setRating = {
                    rating: 0,
                    label: "Unknown"
                };
                let icon = "question";

                relationships.forEach(function(relationship) {
                    let definition = relationship.get("ratingMarkedObjectReference.rating_marking_definition.definition");
                    if (definition) {
                        // Set based on minimal rating to match charts
                        if (definition.rating) {
                            if (setRating.rating === 0) {
                                setRating = definition;
                                icon = relationship.get("ratingMarkedObjectReference.ratingIcon");
                            }
                        }
                    }
                });

                attackPatternProxy.set("rating", setRating);
                let labelLowerCased = setRating.label.toLowerCase();
                attackPatternProxy.set("labelLowerCased", labelLowerCased);
                attackPatternProxy.set("labelClass", `mitigation-${labelLowerCased}`);
                attackPatternProxy.set("icon", icon);

                killChainPhaseAttackPatterns.push(attackPatternProxy);
            }
        });

        if (selectedAttackPatternId === undefined) {
            if (killChainPhaseAttackPatterns.length) {
                let selectedAttackPattern = killChainPhaseAttackPatterns.objectAt(0);
                selectedAttackPattern.set("selected", true);
            }
        }

        return killChainPhaseAttackPatterns;
    }),

    /**
     * Get Graph
     *
     * @param {Array} relationships Array of Relationships
     * @return {Object} Graph of Nodes and Links
     */
    getGraph(relationships) {
        const nodes = this.getNodes(relationships);
        const links = this.getLinks(relationships);
        return {
            nodes: nodes,
            links: links
        };
    },

    /**
     * Get unique set of Nodes from Relationships
      *
      * @param {Array} Relationships
      * @return {Array} Unique set of Nodes
      */
    getNodes(relationships) {
        const references = relationships.reduce((accumulation, relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");
            accumulation.push(sourceRef);
            accumulation.push(targetRef);
            return accumulation;
        }, []);

        const counts = {};
        references.forEach((reference) => {
            if (counts[reference]) {
                counts[reference] += 1;
            } else {
                counts[reference] = 10;
            }
        });

        const nodes = references.uniq().map(reference => {
            return {
                id: reference,
                classNames: reference.split("--")[0],
                radius: counts[reference],
                collideRadius: counts[reference]
            };
        });

        return nodes;
    },

    /**
     * Get Links from Relationships
     *
     * @param {Array} Relationships
     */
    getLinks(relationships) {
        return relationships.map(relationship => {
            return this.getLink(relationship);
        }, this);
    },

    /**
     * Get Link from Relationships
     *
     * @param {Object} relationship Relationship Object
     * @return {Object} Link Object
     */
    getLink(relationship) {
        return {
            id: relationship.get("id"),
            source: relationship.get("source_ref"),
            target: relationship.get("target_ref")
        };
    }
});
