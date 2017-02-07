import Ember from 'ember';

/**
 * Attack Pattern New Route sets initial model for creating new records
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
        const hash = {};
        hash.help = {
            description: "Relationships are what makes the Unfetter Discover project unique.   One type of relationship is created "+
            "to identify that a particular Course Of Action can mitigate a particular Attack Pattern.  Another type of relationship "+
            "describes an Attack Pattern is used by a Threat Actor."
        };
        hash.types = [
            {
                label: "Attack Pattern",
                id: "attack-pattern"
            }, {
                label: "Course of Action",
                id: "course-of-action"
            }, {
                label: "Intrusion Set",
                id: "intrusion-set"
            }
        ];

        hash.item = {
            relationship_type: undefined,
            source_ref: undefined,
            target_ref: undefined,
            description: undefined
        };

        return Ember.RSVP.hash(hash);
    }
});
