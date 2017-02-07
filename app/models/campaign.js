import DS from "ember-data";
import Ember from "ember";

/**
 * Campaign Model
 *
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    description: DS.attr(),
    objective: DS.attr(),
    labels: DS.attr(),
    external_references: DS.attr(),
    first_seen: DS.attr("date"),
    created: DS.attr("date"),
    modified: DS.attr("date"),
    version: DS.attr(),

    type: Ember.computed("id", function() {
        return "campaign";
    })
});
