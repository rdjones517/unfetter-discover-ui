import Ember from "ember";

/**
 * Add Remove External References Mixin for new records
 * 
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
    /** @type {Object} */
    actions: {
        /**
         * Add External Reference object to array for editing
         * 
         * @function actions:addExternalReference
         * @param {Object} item Object to be created
         * @returns {undefined}
         */
        addExternalReference(item) {
            const externalReference = {
                source_name: undefined,
                external_id: undefined,
                url: undefined
            };

            let references = Ember.get(item, "external_references");
            references.pushObject(externalReference);
        },

        /**
         * Remove External Reference object from array
         * 
         * @function actions:removeExternalReference
         * @param {Object} externalReference Object to be removed
         * @returns {undefined}
         */
        removeExternalReference(externalReference) {
            const references = this.get("model.item.external_references");
            references.removeObject(externalReference);
        }
    }
});