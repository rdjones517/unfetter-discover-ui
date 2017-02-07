import Ember from 'ember';

/**
 * Campaigns Dashboard Route queries for a collection of records
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
        hash.items = store.query("campaign", parameters);
        hash.relationships = hash.items.then((items) => {
            const promises = [];
            items.forEach((item) => {
                const id = item.get("id");
                const itemParameters = {
                    "filter": `{ "where": { "or": [ { "source_ref": "${id}" }, { "target_ref": "${id}" } ] } }`
                };
                const promise = store.query("relationship", itemParameters);
                promises.push(promise);
            });
            return Ember.RSVP.all(promises);
        });
        return Ember.RSVP.hash(hash);
    }
});
