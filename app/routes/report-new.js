import Ember from 'ember';

/**
 * Report New Route sets initial model for creating new records
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
            description: "A report is a survey of the Courses of Actions that your organization implements, and to what "+
            "level (High, Medium, or Low).  Rate each Course of Action to the best of your ability.  If you are not sure, just select UNKNOWN."+
            "On the final page of the survey, you will be asked to enter a name for the report and a description.  Unfetter|Discover will "+
            "use the survey to help you understand your gaps, how important they are and which should be addressed.  You may create "+
            "multiple reports to see how new or different Courses of Actions implemented may change your security posture."
        };
        hash.item = {
            name: "Courses of Action",
            description: undefined,
            labels: [ "posture" ],
            object_refs: [],
            granular_markings: [],
            published: new Date(),
            created: new Date(),
            modified: new Date(),
            version: "1"
        };

        const store = this.get("store");

        const definitionParameters = {
            "filter[order]": "definition.rating",
            "filter[where][definition_type]": "rating"
        };
        hash.ratingMarkingDefinitions = store.query("marking-definition", definitionParameters);

        hash.courseOfActions = store.findAll("course-of-action");

        return Ember.RSVP.hash(hash);
    }
});
