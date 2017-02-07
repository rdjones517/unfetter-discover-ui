import Ember from 'ember';

import ItemRoute from "./item";

/**
 * Attack Pattern Route extends Item Route for retrieving individual records
 * 
 * @module
 * @extends routes/ItemRoute
 */
export default ItemRoute.extend({
    /**
     * Model calls ItemRoute.getItemModel with specified parameters
     * 
     * @param {Object} parameters Parameters Object
     * @return {Object} Promise Object
     */
    model(parameters) {
        const hash = this.getItemModel(parameters, "attack-pattern");
        hash.help = {
            description: "Each Attack Pattern is a type of TTP that describes behaviors and actions that adversaries may take in your network.  "+
            "Attack Patterns are used to help categorize an attack, generalize specific attacks to the patterns that they follow, "+
            "and provide detailed information about how attacks are preformed.  An example of an attack pattern could be 'spear fishing', "+
            "'lateral movement', or 'exploit vulnerability'.  Unfetter|Discover is preloaded with the MITRE's ATT&amp;CK model as a working set of attack patterns."
        };        
        return Ember.RSVP.hash(hash);
    }
});
