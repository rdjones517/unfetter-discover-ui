import Ember from "ember";

/**
 * Select Search Field Component using Ember Power Select search
 *
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /**
     * Selected Object
     *
     * @type {Object}
     */
    selected: undefined,

    /**
     * Selections Array
     *
     * @type {Array}
     */
    selections: [],

    /**
     * Selected Observer for updating array of selections
     *
     * @return {undefined}
     */
    selectedObserver: Ember.observer("selected", function() {
        const selected = this.get("selected");
        if (selected) {
            this.set("selected", undefined);

            const selections = this.get("selections");
            selections.pushObject(selected);
        }
    }),

    /**
     * Actions
     *
     * @type {Object}
     */
    actions: {
        /**
         * Remove Selection
         *
         * @param {Object} selection Selection Object
         * @return {undefined}
         */
        removeSelection(selection) {
            const selections = this.get("selections");
            if (selections) {
                selections.removeObject(selection);
            }
        }
    }
});
