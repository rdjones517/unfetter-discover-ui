import Ember from 'ember';

/**
 * Granular Marking Service supports rating relationship processing
 * 
 * @module
 * @extends ember/Service
 */
export default Ember.Service.extend({
    /**
     * Get Icon for Rating
     * 
     * @param {number} rating Rating
     * @return {string} Icon
     */
    getIcon(rating) {
        let icon = "question";

        if (rating === 1) {
            icon = "exclamation";
        } else if (rating === 2) {
            icon = "star-o";
        } else if (rating === 3) {
            icon = "star-half-o";
        } else if (rating === 4) {
            icon = "star";
        }

        return icon;
    },

    /**
     * Get Rating Marked Object References using Granular Marking selectors
     * 
     * @param {Array} objectRefs Array of Object Reference Identifiers
     * @param {Array} granularMarkings Array of Granular Markings
     * @param {Array} ratingMarkingDefinitions Array of Marking Definitions
     * @return {Array} Array of Marked Object References
     */
    getRatingMarkedObjectReferences(objectRefs, granularMarkings, ratingMarkingDefinitions) {
        const ratingMarkedObjectReferences = [];

        if (objectRefs === undefined) {
            objectRefs = [];
        }

        const self = this;
        objectRefs.forEach(function(objectRef, index) {
            let selector = `object_refs[${index}]`;

            let filteredMarkings = [];
            granularMarkings.forEach(function(granularMarking) {
                let selectors = granularMarking.selectors;
                if (selectors.contains(selector)) {
                    filteredMarkings.push(granularMarking);
                }
            });

            const objectMarkingDefinitions = [];
            filteredMarkings.forEach(function(granularMarking) {
                let markingRef = granularMarking.marking_ref;
                let markingDefinition = ratingMarkingDefinitions.findBy("id", markingRef);
                objectMarkingDefinitions.push(markingDefinition);
            });

            let rating = 0;
            let ratingMarkingDefinition;
            objectMarkingDefinitions.forEach(function(markingDefinition) {
                let definition = markingDefinition.get("definition");
                if (definition.label) {
                    ratingMarkingDefinition = markingDefinition;
                    rating = definition.rating;
                }
            });

            let ratingIcon = self.getIcon(rating);
            let ratingMarkedObjectReference = Ember.Object.create({
                granular_markings: filteredMarkings,
                object_ref: objectRef,
                marking_definitions: objectMarkingDefinitions,
                rating_marking_definition: ratingMarkingDefinition,
                ratingIcon: ratingIcon
            });

            ratingMarkedObjectReferences.push(ratingMarkedObjectReference);
        });

        return ratingMarkedObjectReferences;
    }
});