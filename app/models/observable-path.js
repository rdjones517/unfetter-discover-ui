import Ember from "ember";
import DS from "ember-data";

/**
 * Observable Path Model
 *
 * @module
 * @extends ember-data/Model
 */
export default DS.Model.extend({
    object_type: DS.attr(),
    object_action: DS.attr(),
    property_name: DS.attr(),
    key_name: DS.attr(),

    type: Ember.computed("id", function() {
        return "observable-path";
    })
});
