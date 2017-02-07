import Ember from "ember";

/**
 * Navigation Bar Component with support for collapsing and closing
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {string} */
    tagName: "nav",

    /** @type {String[]} */
    classNames: [ "nav-background" ],

    /**
     * Did Insert Element schedules afterRender invocation of setupNavbar()
     * 
     * @override
     * @returns {undefined}
     */
    didInsertElement() {
        this._super(...arguments);
        Ember.run.scheduleOnce("afterRender", this, this.setupNavbar);
    },

    /**
     * Setup Navigation Bar using sideNav() and dropdown() hooks from Materialize CSS
     * 
     * @returns {undefined}
     */
    setupNavbar() {
        const buttonCollapse = Ember.$(".button-collapse");
        if (Ember.typeOf(buttonCollapse.sideNav) === "function") {
            buttonCollapse.sideNav({
                closeOnClick: true
            });
        }

        const dropdownOptions = {
            constrain_width: false,
            belowOrigin: true
        };
        Ember.$(".dropdown-button").dropdown(dropdownOptions);
    }
});
