import Ember from 'ember';

/**
 * Reports Route queries for a collection of records
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
        let parameters = {
            "filter[order]": "created DESC",
            "filter[where][labels]": "posture"
        };
        hash.items = store.query("report", parameters);

        hash.help = {
            description: "A report is a survey of the Courses of Actions that your organization implements, "+
            "and to what level (High, Medium, or Low).  Unfetter|Discover will use the survey to help you "+
            "understand your gaps, how important they are and which should be addressed.  You may create "+
            "multiple reports to see how new or different Courses of Actions implemented may change your security posture."
        };

        return Ember.RSVP.hash(hash);
    }
});
