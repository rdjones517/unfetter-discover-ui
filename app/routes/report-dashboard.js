import Ember from 'ember';
import ReportDashboardModelMixin from "../mixins/report-dashboard-model";

/**
 * Report Dashboard Route queries for individual Report records along with related elements
 * 
 * @module
 * @extends ember/Route
 */
export default Ember.Route.extend(ReportDashboardModelMixin, {
    /**
     * Model calls findRecord for Reports and queries for relationships and related objects
     * 
     * @param {Object} parameters Parameters Object
     * @return {Object} Promise
     */
    model(parameters) {
        const hash = this.getModelHash(parameters);
        return Ember.RSVP.hash(hash);
    }
});
