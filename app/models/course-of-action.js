import DS from "ember-data";
import Ember from "ember";

/**
 * Course of Action Model
 * 
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    name: DS.attr("string"),
    description: DS.attr(),
    labels: DS.attr(),
    external_references: DS.attr(),
    x_unfetter_rating_labels: DS.attr(),
    version: DS.attr("string"),
    created: DS.attr("date"),
    modified: DS.attr("date"),

    type: Ember.computed("id", function() {
        return "course-of-action";
    })
});
