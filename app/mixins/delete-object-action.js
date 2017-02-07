import Ember from "ember";

/**
 * Delete Object Action Mixin for removing records following confirmation
 * 
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
    queryParams: [ "deleteObjectId" ],

    /**
     * Delete Object invoked following confirmation
     * 
     * @function
     * @return Deleted Object
     */
    deleteObject: Ember.computed("deleteObjectId", "model.items", function() {
        const items = this.get("model.items");
        const deleteObjectId = this.get("deleteObjectId");
        return items.findBy("id", deleteObjectId);
    }),

    /** @type {Object} */
    actions: {
        /**
         * Delete Confirmed action handler
         * 
         * @function actions:deleteConfirmed
         * @returns {undefined}
         */
        deleteConfirmed() {
            const item = this.get("deleteObject");
            if (item) {
                this.set("deleteObjectId", undefined);
                let promise = item.destroyRecord();
                
                const self = this;
                promise.catch(function (error) {
                    var alert = {
                        label: "Delete Failed",
                        error: error
                    };
                    self.set("alert", alert);
                    self.set("alertObjectId", item.get("id"));
                });
            }
        }
    }
});