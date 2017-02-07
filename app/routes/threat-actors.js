import Ember from 'ember';

/**
 * Threat Actors Route queries for a collection of records
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
        let parameters = { "filter[order]": "name" };

        let hash = {};
        hash.items = store.query("threat-actor", parameters);
        hash.help = {
            description: "Threat Actors are actual individuals, groups or organizations believed to "+
            "be operating with malicious intent. Threat Actors can be characterized by their motives, "+
            "capabilities, intentions/goals, sophistication level, past activities, resources they have "+
            "access to, and their role in the organization."
        };

        return Ember.RSVP.hash(hash);
    }
});
