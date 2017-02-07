import Ember from 'ember';

import ItemRoute from "./item";

/**
 * Tool Route extends Item Route for retrieving individual records
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
        const hash = this.getItemModel(parameters, "tool");
        return Ember.RSVP.hash(hash);
    }
});