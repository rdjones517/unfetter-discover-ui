import Ember from 'ember';

/**
 * Relationship Explorer Route for viewing related objects
 *
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
  /**
   * Model queries for collection of records
   *
   * @return {Object} Promise Object
   */
  model() {
    const hash = {};
    let store = this.get("store");
    let parameters = { "filter[order]": "relationship_type" };
    hash.relationships = store.query("relationship", parameters);

    return Ember.RSVP.hash(hash);
  }
});
