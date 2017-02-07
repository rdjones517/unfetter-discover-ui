import Ember from 'ember';

/**
 * Indicators Route queries for a collection of records
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
        hash.help = {
            description: "Indicators contain a pattern that can be used to detect suspicous or malicious cyber activity."
        };
        hash.items = store.query("indicator", parameters);

        return Ember.RSVP.hash(hash);
    }
});
