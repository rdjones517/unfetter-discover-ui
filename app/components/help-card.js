import Ember from "ember";

/**
 * Help Card Component with support for collapsing and closing
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {boolean} */
    collapsed: true,

    /** @type {boolean} */
    closed: false,

    /**
     * Collapsed Icon computed based on collapsed status
     * 
     * @function
     * @returns {string} Icon Class String
     */
    collapsedIcon: Ember.computed("collapsed", function () {
        const collapsed = this.get("collapsed");
        let icon = "caret-up";
        if (collapsed) {
            icon = "caret-down";
        }
        return icon;
    }),

    /**
     * Closed Icon computed based on closed status
     * 
     * @function
     * @returns {string} Icon Class String
     */
    closedIcon: Ember.computed("closed", function () {
        const closed = this.get("closed");
        let icon = "times";
        if (closed) {
            icon = "question-circle-o";
        }
        return icon;
    }),

    /** @type {Object} */
    actions: {
        /**
         * Toggle Collapsed adjusts collapsed field
         * 
         * @function actions:toggleCollapsed
         * @returns {undefined}
         */
        toggleCollapsed: function () {
            var collapsed = this.get("collapsed");
            if (collapsed) {
                collapsed = false;
            } else {
                collapsed = true;
            }
            this.set("collapsed", collapsed);
        },

        /**
         * Toggle Closed adjusts closed field
         * 
         * @function actions:toggleClosed
         * @returns {undefined}
         */
        toggleClosed: function () {
            var closed = this.get("closed");
            if (closed) {
                closed = false;
            } else {
                closed = true;
            }
            this.set("closed", closed);
        }
    }
});
