import Ember from 'ember';

/**
 * Application Route loads Marking Definitions in order to receive default Security Marking Label from server
 *
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
    /**
     * Model requests Marking Definitions
     *
     * @return {Object} Promise Object
     */
    model() {
        const hash = {};

        const store = this.get("store");
        hash.markingDefinitions = new Ember.RSVP.Promise(function(resolve) {
            const markingDefinitionsPromise = store.findAll("marking-definition");
            markingDefinitionsPromise.then(function(markingDefinitions) {
                resolve(markingDefinitions);
            });
            markingDefinitionsPromise.catch(function() {
                resolve({});
            });
        });

        return Ember.RSVP.hash(hash);
    },

    /**
     * After Model sets Security Marking based on securityMarkingLabel from ApplicationAdapter
     *
     * @param {Object} model Resolved Model Object
     * @returns {undefined}
     */
    afterModel(model) {
        const store = this.get("store");
        const adapter = store.adapterFor("application");
        let securityMarkingLabel = adapter.get("securityMarkingLabel");
        if (securityMarkingLabel) {
            model.securityMarking = {
                label: securityMarkingLabel
            };
        }
    }
});
