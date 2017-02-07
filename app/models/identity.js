import DS from "ember-data";
import Ember from "ember";

/**
 * Identity Model
 *
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    description: DS.attr("string"),
    labels: DS.attr(),
    external_references: DS.attr(),
    created: DS.attr("date"),
    modified: DS.attr("date"),
    version: DS.attr(),
    identity_class: DS.attr(),
    contact_information: DS.attr(),
    sectors: DS.attr(),

    type: Ember.computed("id", function() {
        return "identity";
    })
});
