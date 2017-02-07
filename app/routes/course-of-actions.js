import Ember from 'ember';

/**
 * Course of Actions Route queries for a collection of records
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
        let store = this.get("store");
        let parameters = { "filter[order]": "name" };

        let hash = {};
        hash.items = store.query("course-of-action", parameters);
        hash.help = {
            description: "A Course of Action is an action taken to prevent an attack or respond to an attack that is in progress.  "+
            "It could be described as a Critical Control or Mitigation.  It could be technical, automatable responses or analytical, but it "+
            "could also represent higher level actions like employee training or penetration testing.  For example, a Course Of Action to apply "+
            "Security Patches could prevent Vulnerability Exploitation"
        };
        return Ember.RSVP.hash(hash);
    }
});
