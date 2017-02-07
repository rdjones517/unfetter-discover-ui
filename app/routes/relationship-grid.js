import Ember from 'ember';

/**
 * Relationships Grid Route retrieves mitigates Relationships along with Courses of Action and Attack Patterns
 *
 * @module
 * @extends routes/ItemRoute
 */
export default Ember.Route.extend({
    /**
     * Model queries for Relationships along with Courses of Action and Attack Patterns
     *
     * @return {Object} Promise Object
     */
    model() {
        const hash = {};
        hash.help = {
            description: "This page allows your to quickly create relationships between a Course of Action and an Attack Pattern that it mitigates.  " +
            "Every selected checkbox is a relationship."
        };
        let store = this.get("store");
        const relationshipParameters = {
            "filter[where][relationship_type]": "mitigates"
        };

        hash.courseOfActions = store.query("course-of-action", { "filter[order]": "phase-name" });
        hash.attackPatterns = store.query("attack-pattern", { "filter[order]": "name" });
        hash.mitigatesRelationships = store.query("relationship", relationshipParameters);

        return Ember.RSVP.hash(hash);
    },
});
