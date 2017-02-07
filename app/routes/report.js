import Ember from 'ember';


/**
 * Attack Pattern Route retrieves individual records
 * 
 * @module
 * @extends routes/ItemRoute
 */
export default Ember.Route.extend({
    /**
     * Model calls findRecord for individual records as well as Courses of Action
     * 
     * @param {Object} parameters Parameters Object
     * @return {Object} Promise Object
     */
    model(parameters) {
        let store = this.get("store");
        let hash = {};
        hash.help = {
            description: "A report is a survey of the Courses of Actions that your organization implements, and to "+
            "what level (High, Medium, or Low).  Unfetter|Discover will use the survey to help you understand your gaps, "+
            "how important they are and which should be addressed.  You may create multiple reports to see how new or "+
            "different Courses of Actions implemented may change your security posture."
        };
        hash.item = store.findRecord("report", parameters.id);

        hash.courseObjects = hash.item.then(function(report){
            let promises = [];
            let object_refs = report.get("object_refs");
            object_refs.forEach(function(referenceId) {
                let promise = store.findRecord("course-of-action", referenceId);
                promises.push(promise);
            });
            return Ember.RSVP.all(promises);
        });

        return Ember.RSVP.hash(hash); 
    }    
});
