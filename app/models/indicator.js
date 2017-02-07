import DS from "ember-data";
import Ember from "ember";

/**
 * Indicator Model
 *
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    description: DS.attr("string"),
    labels: DS.attr(),
    pattern: DS.attr("string"),
    valid_from: DS.attr("date"),
    valid_until: DS.attr("date"),
    kill_chain_phases: DS.attr(),
    external_references: DS.attr(),
    created: DS.attr("date"),
    modified: DS.attr("date"),
    version: DS.attr(),

    type: Ember.computed("id", function() {
        return "indicator";
    })
});
