import Ember from "ember";

/**
 * Phase Group Summary Card for summarizing Kill Chain Phases
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {String[]} */
    classNames: [ "card" ],

    /**
     * Phase Group Object with associated Attack Patterns
     * 
     * @type {Object}
     */
    phaseGroup: undefined
});
