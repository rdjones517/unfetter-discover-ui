import DS from "ember-data";

/**
 * Application Serializer for customized key handling necessary for preserving attribute names with underscores
 * 
 * @module
 * @extends ember-data/JSONAPISerializer
 */
export default DS.JSONAPISerializer.extend({
    /**
     * Key for Attribute function returns attribute name without modification to support attributes with underscores
     * 
     * @override
     * @param {string} attr Attribute name
     * @return {string} Key from Attribute Name without modification
     */
    keyForAttribute: function(attr) {
        return attr;
    }
});