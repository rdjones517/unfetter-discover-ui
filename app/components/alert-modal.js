import Ember from "ember";

/**
 * Alert Modal Component with dismissDialog action
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {String[]} */
    classNames: [ "modal", "alert-modal" ],

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
        }
    }
});
