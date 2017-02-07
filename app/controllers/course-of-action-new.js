import Ember from "ember";
import AddRemoveExternalReferences from "../mixins/add-remove-external-references";
import AddRemoveLabels from "../mixins/add-remove-labels";

/**
 * Course of Action New Controller responsible for creating Course of Action records
 * 
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend(AddRemoveExternalReferences, AddRemoveLabels, {
    /** @type {Object} */
    actions: {
        /**
         * Save Item to Store
         * 
         * @function actions:save
         * @param {Object} item Object to be created
         * @returns {undefined}
         */
        save(item) {
            const externalReferences = Ember.get(item, "external_references");
            externalReferences.forEach(function(externalReference) {
                let invalid = true;
                if (Ember.isPresent(externalReference.source_name)) {
                    if (Ember.isPresent(externalReference.external_id)) {
                        invalid = false;
                    }
                }
                if (invalid) {
                    externalReferences.removeObject(externalReference);
                }
            });

            let store = this.get("store");

            let labelsArray = [];

            let labels = Ember.get(item, "labels");
            labels.forEach(function(label) {
                if (Ember.isPresent(label.label)) {
                    labelsArray.push(label.label);
                }
            });
            Ember.set(item, "labels", labelsArray);

            let ratingLabelArray = [];
            let ratingLabels = Ember.get(item, "x_unfetter_rating_labels");
            ratingLabels.forEach(function(label) {
                if (Ember.isPresent(label.label)) {
                    ratingLabelArray.push(label.label);
                }
            });
            Ember.set(item, "x_unfetter_rating_labels", ratingLabelArray);
            let itemRecord = store.createRecord("course-of-action", item);
            let promise = itemRecord.save();

            let self = this;
            promise.then(function() {
                self.transitionToRoute("course-of-actions");
            });
            promise.catch(function(error) {
                Ember.set(item, "labels", labels);
                var alert = {
                    label: "Save Failed",
                    error: error
                };
                self.set("model.alert", alert);
            });
        }
    }
});