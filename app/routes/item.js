import Ember from 'ember';

/**
 * Item Route for retrieving individual recorsd and related objects
 *
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
    /**
     * Get Item Model hash of Promise objects with source and target Relationships
     *
     * @param {Object} parameters Parameters
     * @param {string} type Item Type
     * @return {Object} hash of key and Promise objects
     */
    getItemModel(parameters, type) {
        const store = this.get("store");
        const hash = {};
        hash.item = store.findRecord(type, parameters.id);

        const sourceParameters = {
            "filter[where][source_ref]": parameters.id
        };
        const sourceRelationships = store.query("relationship", sourceParameters);
        const sourcesHandler = Ember.$.proxy(this.getRelatedObjects, this, "target_ref");
        hash.sourceRelationshipObjects = sourceRelationships.then(sourcesHandler);

        const targetParameters = {
            "filter[where][target_ref]": parameters.id
        };
        const targetRelationships = store.query("relationship", targetParameters);
        const targetsHandler = Ember.$.proxy(this.getRelatedObjects, this, "source_ref");
        hash.targetRelationshipObjects = targetRelationships.then(targetsHandler);

        return hash;
    },

    /**
     * Get Related Objects based on Relationships and Referenced Field
     *
     * @param {string} referenceField Referenced Field for Related Objects
     * @param {Array} relationships Array of Relationship objects
     * @return {Object} Ember Promise including array of store.findRecord Promises
     */
    getRelatedObjects(referenceField, relationships) {
        const promises = [];
        const store = this.get("store");
        relationships.forEach(function (relationship) {
            const ref = relationship.get(referenceField);
            const refType = ref.split("--")[0];
            const promise = store.findRecord(refType, ref);
            promises.push(promise);
        });

        return Ember.RSVP.all(promises);
    }
});
