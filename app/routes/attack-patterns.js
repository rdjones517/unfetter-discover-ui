import Ember from 'ember';

/**
 * Attack Patterns Route queries for a collection of records
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
            description: "Each Attack Pattern is a type of TTP that describes behaviors and actions that adversaries may take in your network."+
            "  Attack Patterns are used to help categorize an attack, generalize specific attacks to the patterns that they follow, "+
            "and provide detailed information about how attacks are preformed.  An example of an attack pattern could be 'spear fishing',"+
            " 'lateral movement', or 'exploit vulnerability'.  Unfetter|Discover is preloaded with the MITRE's ATT&amp;CK model as a working "+
            "set of attack patterns.  On this page, more Attack Patterns can be created or deleted."
        };
        hash.items = store.query("attack-pattern", parameters);

        return Ember.RSVP.hash(hash);
    }
});
