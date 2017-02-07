import Ember from "ember";
import ReportDashboardMitigationMixin from "../mixins/report-dashboard-mitigation";

/**
 * Report Dashboard Controller for visualization for records associated with Report model
 * 
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend(ReportDashboardMitigationMixin, {
    mitigationsMargin: 5,

    mitigationsColors: ["rgb(204, 204, 204)", "rgb(158, 1, 66)", "rgb(231, 197, 105)", "rgb(244, 109, 67)", "rgb(29, 145, 133)"],

    relatedCourseOfActions: undefined,

    /**
     * Phase Name Groups computed based on Attack Pattern Kill Chain Phases
     *  
     * @function
     * @return {Array} Array of Kill Chain Phase Name Groups with associated rating colors
     */
    phaseNameGroups: Ember.computed("model.ratingMarkingDefinitions", "phaseNameAttackPatterns", "relationshipReferencedObjects", function() {
        const relationshipReferencedObjects = this.get("relationshipReferencedObjects");
        const attackPatterns = this.get("model.attackPatterns");
        const ratingMarkingDefinitions = this.get("model.ratingMarkingDefinitions");

        const phaseNameGroups = this.get("attackPatternService").getPhaseNameGroups(attackPatterns);

        const self = this;
        phaseNameGroups.forEach(function(phaseNameGroup) {
            phaseNameGroup.set("values", []);
            phaseNameGroup.set("labels", []);
            phaseNameGroup.set("colors", self.get("mitigationsColors"));

            const groupAttackPatterns = phaseNameGroup.get("attackPatterns");
            let total = groupAttackPatterns.get("length");
            let groups = self.get("courseOfActionService").getMitigationGroups(ratingMarkingDefinitions, relationshipReferencedObjects, total, groupAttackPatterns);
            phaseNameGroup.set("groups", groups);

            groups.forEach(function(group) {
                phaseNameGroup.get("labels").push(group.label);
                phaseNameGroup.get("values").push(group.value);
            });

            const mitigationScoreAdjusted = self.get("courseOfActionService").getMitigationScoreAdjusted(groups, groupAttackPatterns);
            phaseNameGroup.set("mitigationScoreAdjusted", mitigationScoreAdjusted);
        });

        return phaseNameGroups;
    })
});