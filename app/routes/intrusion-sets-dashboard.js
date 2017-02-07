import Ember from 'ember';

/**
 * Threat Actors Dashboard Route queries for a collection of records
 *
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
    /**
     * Model queries for collection of records
     *
     * @return {Object} Promise Object
     */
    model() {
        let store = this.get("store");
        let hash = {};

        const attackPatternParameters = {
            "filter[order]": "name"
        };
        hash.attackPatterns = store.query("attack-pattern", attackPatternParameters);

        const intrusionSetParameters = {
            "filter[order]": "name"
        };
        hash.intrusionSets = store.query("intrusion-set", intrusionSetParameters);

        const relationshipParameters = {
            "filter[where][relationship_type]": "uses"
        };
        hash.relationships = store.query("relationship", relationshipParameters);

        return Ember.RSVP.hash(hash);
    }
});
