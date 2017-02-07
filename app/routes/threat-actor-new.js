import Ember from 'ember';

/**
 * Threat Actor New Route sets initial model for creating new records
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
                aliases: [],
                description: undefined,
                labels: [],
                external_references: []
            },
            relationship: {},
            labels: [
                {
                    label: "activist"
                },
                {
                    label: "competitor"
                },
                {
                    label: "crime-syndicate"
                },
                {
                    label: "criminal"
                },
                {
                    label: "hacker"
                },
                {
                    label: "insider-accidental"
                },
                {
                    label: "insider-disgruntled"
                },
                {
                    label: "nation-state"
                },
                {
                    label: "sensationalist"
                },
                {
                    label: "spy"
                },
                {
                    label: "terrorist"
                }
            ]
        };
        model.help = {
            description: "Threat Actors are actual individuals, groups or organizations believed to be operating with malicious intent. "+
            "Threat Actors can be characterized by their motives, capabilities, intentions/goals, sophistication level, past activities, "+
            "resources they have access to, and their role in the organization."
        };
        return Ember.RSVP.hash(model);
    }
});
