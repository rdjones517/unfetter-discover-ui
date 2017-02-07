import Ember from 'ember';

/**
 * Course of Action New Route sets initial model for creating new records
 * 
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend({
    /**
     * Model sets initial model for creating new records
     * 
     * @return {Object} Promise Object
     */
    model() {
        let model = {
            item: {
                name: undefined,
                description: undefined,
                labels: [],
                external_references: [],                
                created: new Date(),
                modified: new Date(),
                version: "1",
                x_unfetter_rating_labels: [
                    { label: "Undefined" },
                    { label: "None" },
                    { label: "Low" },
                    { label: "Medium" },
                    { label: "High" }
                ]
            }
        };
        model.help = {
            description: "A Course of Action is an action taken to prevent an attack or respond to an attack that is in progress.  " +
            "It could be described as a Critical Control or Mitigation.  It could be technical, automatable responses or analytical, but it " +
            "could also represent higher level actions like employee training or penetration testing.  For example, a Course Of Action to apply " +
            "Security Patches could prevent Vulnerability Exploitation.  Once a Course of Action is created, the " +
            "new relationships can be created that link that Course of Action to the Attack Pattern's it mitigates."
        };

        return Ember.RSVP.hash(model);
    }
});
