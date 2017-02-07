import Ember from "ember";

/**
 * Object Type Select Component combines multiple select elements and adjusts objects based on type selected
 * 
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend({
    /** @type {string[]} */
    classNames: [ "row" ],

    /** @type {string} */
    typeLabel: "Object Type",

    /** @type {string} */
    typePrompt: undefined,

    /** 
     * Property path on types for label
     *  
     * @default label
     * @type {string}
     */
    typeLabelPath: "label",

    /** 
     * Property path on types for id
     *  
     * @default id
     * @type {string}
     */
    typeValuePath: "id",

    /** @type {string} */
    objectLabel: "Object",

    /** @type {string} */
    objectPrompt: undefined,

    /** 
     * Property path on objects for label
     *  
     * @default label
     * @type {string}
     */
    objectLabelPath: "label",

    /** 
     * Property path on objects for id
     *  
     * @default id
     * @type {string}
     */
    objectValuePath: "id",

    /** 
     * Array of selectable Types
     * 
     * @type {Array}
     */
    types: [],

    /** @type {string} */
    typeValue: undefined,

    /** 
     * Array of selectable Objects
     * 
     * @type {Array}
     */
    objects: [],

    /** @type {string} */
    objectValue: undefined,

    /**
     * Type Value Changed observer sends onTypeValueChanged action with new type value and object value path
     * 
     * @function
     * @returns {undefined}
     */
    typeValueChanged: Ember.observer("typeValue", function() {
        const typeValue = this.get("typeValue");
        const objectValuePath = this.get("objectValuePath");
        this.sendAction("onTypeValueChanged", typeValue, objectValuePath);
    })
});
