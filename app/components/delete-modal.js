import Ember from "ember";

/**
 * Delete Modal Component with dismiss and confirm dialogs
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {string} */
    classNames: [ "modal", "delete-modal" ],

    /** @type {Object} */
    actions: {
        /**
         * Dismiss Dialog sends dismiss action when invoked
         * 
         * @function actions:dismissDialog
         * @returns {undefined}
         */
        dismissDialog: function() {
            this.sendAction("dismiss");
        },

        /**
         * Confirm Dialog sends deleteConfirmed action when invoked
         * 
         * @function actions:confirmDialog
         * @returns {undefined}
         */
        confirmDialog: function() {
            this.sendAction("deleteConfirmed");
        }
    }
});
