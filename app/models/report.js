import DS from "ember-data";
import Ember from "ember";

/**
 * Report Model
 * 
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    published: DS.attr("date", {
        defaultValue() {
            return new Date();
        }
    }),
    description: DS.attr("string"),
    labels: DS.attr(),
    object_refs: DS.attr(),
    created: DS.attr("date", {
        defaultValue() {
            return new Date();
        }
    }),
    modified: DS.attr("date", {
        defaultValue() {
            return new Date();
        }
    }),    
    granular_markings: DS.attr(),
    object_marking_refs: DS.attr(),
    version: DS.attr(),

    type: Ember.computed("id", function() {
        return "report";
    })
});
