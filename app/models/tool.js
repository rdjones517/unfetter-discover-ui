import DS from "ember-data";
import Ember from "ember";

/**
 * Tool Model
 * 
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    description: DS.attr("string"),
    labels: DS.attr(),
    aliases: DS.attr(),
    kill_chain_phases: DS.attr(),
    external_references: DS.attr(),

    type: Ember.computed("id", function() {
        return "tool";
    })
});
