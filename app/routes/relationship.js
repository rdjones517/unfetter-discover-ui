import Ember from 'ember';


/**
 * Attack Pattern Route retrieves individual records and related records
 * 
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
    /**
     * Model calls findRecord for individual record and for source and target referenced objects
     * 
     * @param {Object} parameters Parameters Object
     * @return {Object} Promise Object
     */
    model(parameters) {
        const hash = {};
        hash.help = {
            description: "Relationships are what makes the Unfetter Discover project unique.   One type of relationship is created to "+
            "identify that a particular Course Of Action can mitigate a particular Attack Pattern.  Another type of relationship "+
            "describes an Attack Pattern is used by a Threat Actor."
        };
        const store = this.get("store");
        hash.item = store.findRecord("relationship", parameters.id);

        const self = this;
        hash.source = hash.item.then(function(relationship) {
            const ref = relationship.get("source_ref");
            const type = self.getIdentifierType(ref);
            return store.findRecord(type, ref);
        });

        hash.target = hash.item.then(function(relationship) {
            const ref = relationship.get("target_ref");
            const type = self.getIdentifierType(ref);
            return store.findRecord(type, ref);
        });

        return Ember.RSVP.hash(hash);
    },

    /**
     * Get Identifier Type based on identifier
     * 
     * @param {string} identifier Identifier
     * @return {string} Identifier Type
     */
    getIdentifierType(identifier) {
        const identifierElements = identifier.split("--");
        return identifierElements[0];
    }
});
