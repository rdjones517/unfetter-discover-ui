import Ember from "ember";

/**
 * Report Dashboard Model Mixin to find required records
 *
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
    /**
     * Get Model calls findRecord for Reports and queries for relationships and related objects
     *
     * @param {Object} parameters Parameters Object
     * @return {Object} Object Hash for Promises
     */
    getModelHash(parameters) {
        const hash = {};
        hash.help = {
            description: "This Report Dashboard shows all the Attack Patterns related to your Courses of Actions for a particular "+
            "rating (High, Medium, Low).  The Attack Patterns below are stopped or detered by the Courses of Action that you rated "+
            "at the Rating level. This page helps you understand how well you are mitigating or detering attacker behaviors and capabilities."
        };

        const store = this.get("store");

        const attackPatternParameters = {
            "filter[order]": "name"
        };

        const courseOfActionParameters = {
            "filter[order]": "name"
        };

        const relationshipParameters = {
            "filter[where][relationship_type]": "mitigates"
        };

        hash.attackPatterns = store.query("attack-pattern", attackPatternParameters);
        hash.courseOfActions = store.query("course-of-action", courseOfActionParameters);
        hash.mitigatesRelationships = store.query("relationship", relationshipParameters);

        hash.report = store.findRecord("report", parameters.id);
        hash.markingDefinitions = hash.report.then(function(report) {
            const granularMarkings = report.get("granular_markings");
            const markingRefs = granularMarkings.mapBy("marking_ref").uniq();

            const promises = [];
            markingRefs.forEach(function(markingRef) {
                const promise = store.findRecord("marking-definition", markingRef);
                promises.push(promise);
            });

            return Ember.RSVP.all(promises);
        });

        const ratingParameters = {
            "filter[order]": "definition.rating",
            "filter[where][definition_type]": "rating"
        };
        hash.ratingMarkingDefinitions = store.query("marking-definition", ratingParameters);

        return hash;
    }
});
