import Ember from 'ember';

/**
 * Course of Action Service supporting computation of ratings and scores
 * 
 * @module
 * @extends ember/Service
 */
export default Ember.Service.extend({
    granularMarkingService: Ember.inject.service("granular-marking"),

    maximumMitigationScoreAdjusted: 10,

    scoreDecimalPlaces: 2,

    /**
     * Get Mitigation Score Adjusted
     * 
     * @param {Array} mitigationGroups Array of Mitigation Groups
     * @param {Array} attackPatterns Array of Attack Patterns
     * @return {number} Mitigation Score Adjusted based on Maximum Possible Score using Maximum Rating
     */
    getMitigationScoreAdjusted(mitigationGroups, attackPatterns) {
        const maximumRating = this.getMaximumRating(mitigationGroups);
        const maximumScore = this.getMaximumScore(maximumRating, attackPatterns);
        const mitigationScoreAggregated = this.getMitigationScoreAggregated(mitigationGroups);
        const mitigationScorePercent = mitigationScoreAggregated / maximumScore;
        const mitigationScoreAdjusted = mitigationScorePercent * this.maximumMitigationScoreAdjusted;
        return mitigationScoreAdjusted.toFixed(this.scoreDecimalPlaces);
    },

    /**
     * Get Mitigation Score aggregated across Mitigation Groups
     * 
     * @param {Array} mitigationGroups Array of Mitigation Groups
     * @return {number} Mitigation Score Aggregated
     */
    getMitigationScoreAggregated(mitigationGroups) {
        let mitigationScoreAggregated = 0;

        mitigationGroups.forEach(function(mitigationGroup) {
            const rating = mitigationGroup.rating;
            const value = mitigationGroup.value;
            const mitigationScore = value * rating;
            mitigationScoreAggregated += mitigationScore;
        });

        return mitigationScoreAggregated;
    },

    /**
     * Get Maximum Score based on Maximum Rating and Attack Patterns
     * 
     * @param {Number} maximumRating Maximum Rating
     * @param {Array} attackPatterns Array of Attack Patterns
     * @return {number} Maximum Score based on Maximum Rating and number of Attack Patterns
     */
    getMaximumScore(maximumRating, attackPatterns) {
        const totalAttackPatterns = attackPatterns.get("length");
        return maximumRating * totalAttackPatterns;
    },

    /**
     * Get Maximum Rating
     * 
     * @param {Array} mitigationGroups Array of Mitigation Groups
     * @return {number} Maximum Rating Number
     */
    getMaximumRating(mitigationGroups) {
        let maximumRating = 0;
        mitigationGroups.forEach(function(mitigationGroup) {
            if (mitigationGroup.rating > maximumRating) {
                maximumRating = mitigationGroup.rating;
            }
        });

        return maximumRating;
    },

    /**
     * Get Mitigation Groups for Plotting
     * 
     * @param {Array} ratingMarkingDefinitions Array of Marking Definitions
     * @param {Array} relationshipRatingMarkedObjectReferences Array of Relationship Objects
     * @param {number} total Total number of Attack Patterns
     * @param {Array} [attackPatterns] Array of Attack Patterns
     * @return {Array} Array of Mitigation Groups
     */
    getMitigationGroups(ratingMarkingDefinitions, relationshipRatingMarkedObjectReferences, total, attackPatterns) {
        const mitigationGroups = [];

        let totalUnknown = 0;
        let totalKnown = 0;
        let mitigationRatings = {};
        const granularMarkingService = this.get("granularMarkingService");

        ratingMarkingDefinitions.forEach(function(marking) {
            let label = marking.get("definition.label");
            let labelClassName = label.toLowerCase();
            let className = `text-mitigation-${labelClassName}`;
            let rating = marking.get("definition.rating");
            let icon = granularMarkingService.getIcon(rating);
            let markingGroup = {
                label: label,
                className: className,
                labelClassName: labelClassName,
                icon: icon,
                value: 0,
                percent: 0,
                rating: marking.get("definition.rating")
            };

            mitigationRatings[label] = markingGroup;
        });

        const attackPatternsFound = [];

        relationshipRatingMarkedObjectReferences.forEach(function(relationship) {
            let targetRef = relationship.get("target_ref");
            let included = false;

            if (attackPatterns) {
                let attackPattern = attackPatterns.findBy("id", targetRef);
                if (attackPattern) {
                    if (attackPatternsFound.contains(targetRef) === false) {
                        attackPatternsFound.push(targetRef);
                        included = true;
                    }
                }
            } else {
                included = true;
            }

            if (included) {
                let label = relationship.get("ratingMarkedObjectReference.rating_marking_definition.definition.label");

                if (label in mitigationRatings) {
                    mitigationRatings[label].value += 1;
                    mitigationRatings[label].percent = (mitigationRatings[label].value / total) * 100;
                    mitigationRatings[label].percent = mitigationRatings[label].percent.toFixed(0);
                }

                if (label === "Unknown") {
                    totalUnknown++;
                } else {
                    totalKnown++;
                }
            }
        });

        const totalNotFound = total - totalKnown;
        const unknownKey = "Unknown";
        if (unknownKey in mitigationRatings) {
            const unknownGroup = mitigationRatings[unknownKey];
            unknownGroup.value = totalNotFound;
            unknownGroup.percent = (totalNotFound / total) * 100;
            unknownGroup.percent = unknownGroup.percent.toFixed(0);
        }

        for (let key in mitigationRatings) {
            let mitigationGroup = mitigationRatings[key];
            mitigationGroups.push(mitigationGroup);
        }
        let mitigationGroupsSorted = mitigationGroups.sortBy("rating");
        return mitigationGroupsSorted;
    }
});