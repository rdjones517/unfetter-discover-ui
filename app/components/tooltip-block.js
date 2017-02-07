import Ember from "ember";

/**
 * Tooltip Block Component encapsulating Materialize CSS tooltip registration
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    tooltip: undefined,

    position: "right",

    delay: 50,

    computedClass: undefined,

    classNameBindings: ["computedClass"],

    attributeBindings: [
        "tooltip:data-tooltip",
        "position:data-position",
        "delay:data-delay"
    ],

    /**
     * Did Insert Element invokes tooltip() registration on rendered HTML element field
     * 
     * @returns {undefined}
     */
    didInsertElement() {
        this._super(...arguments);
        Ember.$(this.element).tooltip();
    }
});
