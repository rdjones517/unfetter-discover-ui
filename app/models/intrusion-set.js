import DS from "ember-data";
import Ember from "ember";

/**
 * Intrusion Set Model
 * 
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    aliases: DS.attr(),
    labels: DS.attr(),
    external_references: DS.attr(),
    description: DS.attr("string"),

    type: Ember.computed("id", function() {
        return "intrusion-set";
    })
});
