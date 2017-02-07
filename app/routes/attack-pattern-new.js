import Ember from 'ember';

/**
 * Attack Pattern New Route sets initial model for creating new records
 * 
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
    /**
     * Model sets initial model for creating new records
     * 
     * @return {Object} Promise Object
     */
    model() {
        let model = {
            item: {
                name: undefined,
                description: undefined,
                labels: [],
                kill_chain_phases: [],
                external_references: []
            }
        };
        model.help = {
            description: "Each Attack Pattern is a type of TTP that describes behaviors and actions that adversaries may take in your network.  "+
            "Attack Patterns are used to help categorize an attack, generalize specific attacks to the patterns that they follow, "+
            "and provide detailed information about how attacks are preformed.  An example of an Attack Pattern could be 'spear fishing', "+
            "'lateral movement', or 'exploit vulnerability'.  Unfetter|Discover is preloaded with the MITRE's ATT&amp;CK model as a working set of attack patterns."
        };

        return Ember.RSVP.hash(model);
    }
});
