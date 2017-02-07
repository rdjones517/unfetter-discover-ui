import DS from "ember-data";

/**
 * Marking Definition Model
 * 
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    definition_type: DS.attr("string"),
    definition: DS.attr(),
    created: DS.attr("date"),
    external_references: DS.attr()
});
