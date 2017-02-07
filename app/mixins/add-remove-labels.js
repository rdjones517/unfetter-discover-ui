import Ember from "ember";

/**
 * Add Remove Labels Mixin for new records
 * 
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
    /** @type {Object} */
    actions: {
        /**
         * Add Label object to array for editing
         * 
         * @function actions:addLabel
         * @param {Object} item Object to be created
         * @returns {undefined}
         */
        addLabel(item) {
            let labels = Ember.get(item, "labels");
            let label = {
                label: undefined
            };
            labels.pushObject(label);
        },

        /**
         * Remove Label object from array
         * 
         * @function actions:removeLabel
         * @param {Object} label Object to be removed
         * @returns {undefined}
         */
        removeLabel(label) {
            const labels = this.get("model.item.labels");
            labels.removeObject(label);
        }
    }
});