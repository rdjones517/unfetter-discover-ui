import Ember from "ember";
import CreateBundle from "../mixins/create-bundle";


/**
 * Campaigns Dashboard Controller
 *
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend(CreateBundle, {
    linkedItems: Ember.computed("model.items", "model.relationships", function() {
        const items = this.get("model.items");
        const relationships = this.get("model.relationships");

        const linkedItems = [];
        items.forEach((item) => {
            const id = item.get("id");
            let relationshipObjects = [];
            const relationshipObjectTypes = {};

            relationships.forEach((itemRelationships) => {
                const sourceRelationshipObjects = itemRelationships.filterBy("source_ref", id);
                if (sourceRelationshipObjects) {
                    relationshipObjects = relationshipObjects.concat(sourceRelationshipObjects);
                    sourceRelationshipObjects.forEach((relationshipObject) => {
                        const ref = relationshipObject.get("target_ref");
                        const objectType = ref.split("--")[0];
                        if (relationshipObjectTypes[objectType]) {
                            relationshipObjectTypes[objectType] += 1;
                        } else {
                            relationshipObjectTypes[objectType] = 1;
                        }
                    });
                }
                const targetRelationshipObjects = itemRelationships.filterBy("target_ref", id);
                if (targetRelationshipObjects) {
                    relationshipObjects = relationshipObjects.concat(targetRelationshipObjects);
                    targetRelationshipObjects.forEach((relationshipObject) => {
                        const ref = relationshipObject.get("source_ref");
                        const objectType = ref.split("--")[0];
                        if (relationshipObjectTypes[objectType]) {
                            relationshipObjectTypes[objectType] += 1;
                        } else {
                            relationshipObjectTypes[objectType] = 1;
                        }
                    });
                }
            });

            const linkedItem = Ember.ObjectProxy.create({
                content: item,
                relationshipObjects: relationshipObjects,
                relationshipObjectTypes: relationshipObjectTypes
            });

            linkedItems.push(linkedItem);
        });

        return linkedItems;
    })
});
