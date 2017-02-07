import Ember from "ember";
import ReportKillChainPhaseController from "./report-kill-chain-phase";

/**
 * Report Mitigates Rating Controller for visualization of Kill Chain summaries associated with Report model
 * 
 * @module
 * @extends ReportKillChainPhaseController
 */
export default ReportKillChainPhaseController.extend({
    /**
     * Selected Rating Groups
     * 
     * @function
     * @return {Object} Selected Rating Group
     */
    selectedRatingGroup: Ember.computed("ratingGroups", "model.rating.rating", function() {
        const ratingGroups = this.get("ratingGroups");
        return ratingGroups.findBy("selected", true);
    }),

    /**
     * Rating Groups derived from rating Marking Definitions
     * 
     * @function
     * @return {Array} Array of Rating Groups with selected rating
     */
    ratingGroups: Ember.computed("model.ratingMarkingDefinitions", "model.rating.rating", function() {
        const ratingGroups = [];
        const ratingMarkingDefinitions = this.get("model.ratingMarkingDefinitions");
        const selectedRating = parseInt(this.get("model.rating.rating"));

        ratingMarkingDefinitions.forEach(function(ratingMarkingDefinition) {
            let selected = (selectedRating === ratingMarkingDefinition.get("definition.rating"));
            let ratingGroup = Ember.ObjectProxy.create({
                content: ratingMarkingDefinition,
                selected: selected
            });
            ratingGroups.pushObject(ratingGroup);
        });

        return ratingGroups;
    }),

    /**
     * Phase Name Groups with selected status for navigation
     * 
     * @function
     * @return {Array} Array of Phase Name Groups with associated Attack Patterns
     */
    phaseNameGroups: Ember.computed("selectedAttackPatterns", function() {
        const attackPatterns = this.get("selectedAttackPatterns");
        return this.get("attackPatternService").getPhaseNameGroups(attackPatterns);
    }),

    /**
     * Selected Attack Patterns filtered based on rating
     * 
     * @override
     * @function
     * @return {Array} Array of Selected Attack Patterns
     */
    selectedAttackPatterns: Ember.computed("model.attackPatterns", "model.rating.rating", "relationshipReferencedObjects", "attackPatternId", function() {
        const attackPatterns = this.get("model.attackPatterns");
        const selectedAttackPatternId = this.get("attackPatternId");
        const relationshipReferencedObjects = this.get("relationshipReferencedObjects");
        const selectedRating = parseInt(this.get("model.rating.rating"));

        const filteredAttackPatterns = [];

        attackPatterns.forEach(function(attackPattern) {
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
            
            if (selectedRating === setRating.rating) {
                filteredAttackPatterns.push(attackPatternProxy);
            }            
        });

        if (selectedAttackPatternId === undefined) {
            if (filteredAttackPatterns.length) {
                let selectedAttackPattern = filteredAttackPatterns.objectAt(0);
                selectedAttackPattern.set("selected", true);
            }
        }

        return filteredAttackPatterns;
    })
});