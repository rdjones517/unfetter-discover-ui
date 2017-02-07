import Ember from "ember";

/**
 * Report Dashboard Mitigation Mixin to for computed related properties
 * 
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
    /**
     * Attack Pattern Service for calculating groups
     * 
     * @type {Object}
     */
    attackPatternService: Ember.inject.service("attack-pattern"),

    /**
     * Course of Action Service for calculating scores
     * 
     * @type {Object}
     */
    courseOfActionService: Ember.inject.service("course-of-action"),

    /**
     * Granular Marking Service for calculating Ratings
     * 
     * @type {Object}
     */
    granularMarkingService: Ember.inject.service("granular-marking"),

    /**
     * Selected Attack Patterns
     * 
     * @function
     * @return {Array} Array of Attack Patterns
     */
    selectedAttackPatterns: Ember.computed("model.attackPatterns", function() {
        return this.get("model.attackPatterns");
    }),

    /**
     * Referenced objects from report references
     * 
     * @function
     * @return {Array} Array of Rating Marked Object References based on report.object_refs
     */
    referencedObjects: Ember.computed("model.report.object_refs.[]", "model.markingDefinitions", function() {
        const report = this.get("model.report");
        let objectRefs = this.get("model.report.object_refs");
        if (objectRefs === undefined) {
            objectRefs = [];
        }
        const granularMarkings = report.get("granular_markings");
        const markingDefinitions = this.get("model.markingDefinitions");

        return this.get("granularMarkingService").getRatingMarkedObjectReferences(objectRefs, granularMarkings, markingDefinitions);
    }),

    /**
     * Relationship Referenced Objects based on mitigates Relationships from report references
     * 
     * @function
     * @return {Array} Array of Relationship Objects with referenced objects
     */
    relationshipReferencedObjects: Ember.computed("model.mitigatesRelationships", "referencedObjects", function() {
        const relationshipReferencedObjects = [];

        const referencedObjects = this.get("referencedObjects");
        const mitigatesRelationships = this.get("model.mitigatesRelationships");
        mitigatesRelationships.forEach(function(relationship) {
            let sourceRef = relationship.get("source_ref");
            let ratingMarkedObjectReference = referencedObjects.findBy("object_ref", sourceRef);

            if (ratingMarkedObjectReference) {
                let relationshipProxy = Ember.ObjectProxy.create({
                    content: relationship,
                    ratingMarkedObjectReference: ratingMarkedObjectReference
                });

                relationshipReferencedObjects.pushObject(relationshipProxy);
            }
        });

        return relationshipReferencedObjects;
    }),

    /**
     * Mitigation Score Adjusted
     * 
     * @function
     * @return {number} Mitigation Score Adjusted based on Mitigation Groups and associated Ratings
     */
    mitigationScoreAdjusted: Ember.computed("mitigationGroups", "selectedAttackPatterns", function() {
        const mitigationGroups = this.get("mitigationGroups");
        const attackPatterns = this.get("selectedAttackPatterns");
        return this.get("courseOfActionService").getMitigationScoreAdjusted(mitigationGroups, attackPatterns);
    }),

    /**
     * Mitigations computed based on Attack Patterns Mitigated
     * 
     * @function
     * @return {Object} Mitigations Object mapping labels to values
     */
    mitigations: Ember.computed("mitigationGroups", function() {
        const mitigationGroups = this.get("mitigationGroups");

        const mitigations = {};
        mitigations.values = [];
        mitigations.labels = [];

        mitigationGroups.forEach(function(mitigationGroup) {
            mitigations.values.push(mitigationGroup.value);
            mitigations.labels.push(mitigationGroup.label);
        });

        return mitigations;
    }),

    /**
     * Mitigation Groups for Charts
     * 
     * @function
     * @return {Array} Array of Mitigation Groups for Charts based on Attack Patterns
     */
    mitigationGroups: Ember.computed("relationshipReferencedObjects", "model.ratingMarkingDefinitions", "selectedAttackPatterns", function() {
        const relationshipReferencedObjects = this.get("relationshipReferencedObjects");
        const ratingMarkingDefinitions = this.get("model.ratingMarkingDefinitions");
        const attackPatterns = this.get("selectedAttackPatterns");
        const total = attackPatterns.get("length");

        return this.get("courseOfActionService").getMitigationGroups(ratingMarkingDefinitions, relationshipReferencedObjects, total, attackPatterns);
    }),

    /**
     * Phase Name Attack Patterns group on Attack Pattern Kill Chain Phases
     * 
     * @function
     * @return {Array} Array of Kill Chain Phase Name groups of Attack Patterns
     */
    phaseNameAttackPatterns: Ember.computed("selectedAttackPatterns", function() {
        const attackPatterns = this.get("selectedAttackPatterns");
        return this.get("attackPatternService").getPhaseNameAttackPatterns(attackPatterns);
    }),

    /** @type {Object} */
    actions: {
        /**
         * Mitigation Plot Selected handler for Plotly Events
         * 
         * @function actions:mitigationPlotSelected
         * @param {Object} event Plotly Event Object
         * @return {undefined} 
         */
        mitigationPlotSelected(data) {
            let label;

            if (data.points) {
                data.points.forEach(function(point) {
                    label = point.label;
                });
            }

            if (label) {
                const ratingMarkingDefinitions = this.get("model.ratingMarkingDefinitions");
                const markingDefinition = ratingMarkingDefinitions.findBy("definition.label", label);
                if (markingDefinition) {
                    const rating = markingDefinition.get("definition.rating");
                    const reportId = this.get("model.report.id");
                    this.transitionToRoute("report-mitigates-rating", reportId, rating);
                }
            }
        }
    }
});