import Ember from "ember";

/**
 * Relationship Explorer Controller
 *
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend({
    /**
     * Default Order for Object Types
     * @type {Object}
     */
    defaultOrder: {
        "course-of-action": 10,
        "malware": 20,
        "threat-actor": 30,
        "intrusion-set": 35,
        "attack-pattern": 40,
        "indicator": 50,
        "observable-path": 60,
        "tool": 70
    },

    /**
     * Object Type Counts computed property based on relationships
     *
     * @return {Array} Array of Object Types
     */
    objectTypeCounts: Ember.computed("model.relationships", function() {
        const relationships = this.get("model.relationships");
        const objectTypeCounts = {};
        const objectTypeIdentifiers = {};

        relationships.forEach((relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");
            const sourceType = this.getObjectType(sourceRef);
            const targetType = this.getObjectType(targetRef);

            this.setObjectTypeIdentifiers(objectTypeIdentifiers, sourceType, sourceRef);
            this.setObjectTypeIdentifiers(objectTypeIdentifiers, targetType, targetRef);
        }, this);

        for (let objectType in objectTypeIdentifiers) {
            const objectIdentifiers = objectTypeIdentifiers[objectType];
            const uniqueObjectIdentifiers = objectIdentifiers.uniq();
            objectTypeCounts[objectType] = uniqueObjectIdentifiers.length;
        }

        const objectTypes = [];
        const defaultOrder = this.get("defaultOrder");
        for (let objectType in objectTypeCounts) {
            let order = defaultOrder[objectType];
            if (order === undefined) {
                order = 0;
            }
            const objectTypeDescriptor = {
                label: objectType,
                count: objectTypeCounts[objectType],
                order: order,
                enabled: true
            };
            objectTypes.push(objectTypeDescriptor);
        }

        const sortedObjectTypes = objectTypes.sort(this.orderPropertyComparator.bind(this));
        return sortedObjectTypes;
    }),

    /**
     * Object Type Relationships computed property based on relationships
     *
     * @return {Array} Array of Object Types
     */
    objectTypeRelationships: Ember.computed("model.relationships", "objectTypeCounts.@each.enabled", function() {
        const objectTypeCounts = this.get("objectTypeCounts");
        const enabledObjectTypeCounts = objectTypeCounts.filterBy("enabled", true);
        const enabledObjectTypeLabels = enabledObjectTypeCounts.map((objectTypeCount) => { return objectTypeCount.label; });
        const objectTypeOrder = {};
        let objectOrder = 1;
        enabledObjectTypeCounts.forEach((objectTypeCount) => {
            objectTypeOrder[objectTypeCount.label] = objectOrder;
            objectOrder += 1;
        });

        const relationships = this.get("model.relationships");
        const objectTypeRelationships = {};

        relationships.forEach((relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");
            const sourceType = this.getObjectType(sourceRef);
            const targetType = this.getObjectType(targetRef);

            if (enabledObjectTypeLabels.contains(sourceType)) {
                this.setObjectTypeRelationship(objectTypeRelationships, sourceType, relationship);
            }
            if (enabledObjectTypeLabels.contains(targetType)) {
                this.setObjectTypeRelationship(objectTypeRelationships, targetType, relationship);
            }
        }, this);

        const objectTypes = [];

        for (let objectType in objectTypeRelationships) {
            let order = objectTypeOrder[objectType];
            if (order === undefined) {
                order = 0;
            }
            const objectTypeDescriptor = {
                label: objectType,
                relationships: objectTypeRelationships[objectType],
                order: order
            };
            objectTypes.push(objectTypeDescriptor);
        }
        const sortedObjectTypes = objectTypes.sort(this.orderPropertyComparator.bind(this));
        return sortedObjectTypes;
    }),

    /**
     * Order Property Comparator
     *
     * @param {Object} firstObject First Object
     * @param {Object} secondObject Second Object
     * @return {number} Comparison
     */
    orderPropertyComparator(firstObject, secondObject) {
        let firstOrder = firstObject.order;
        let secondOrder = secondObject.order;
        if (firstOrder === undefined) {
            firstOrder = 0;
        }
        if (secondOrder === undefined) {
            secondOrder = 0;
        }

        let comparison = 0;
        if (firstOrder > secondOrder) {
            comparison = 1;
        } else if (firstOrder < secondOrder) {
            comparison = -1;
        }

        return comparison;
    },

    /**
     * Set Object Type Count on Hash of Object Type to number
     *
     * @param {Object} objectTypeCounts Object Type to number
     * @param {string} objectType Object Type
     * @return {undefined}
     */
    setObjectTypeCount(objectTypeCounts, objectType) {
        if (objectTypeCounts[objectType]) {
            objectTypeCounts[objectType] += 1;
        } else {
            objectTypeCounts[objectType] = 1;
        }
    },

    /**
     * Set Object Type Identifiers on Hash of Object Type to Identifiers
     *
     * @param {Object} objectTypeIdentifiers Object Type to Array of Identifiers
     * @param {string} objectType Object Type
     * @param {string} objectIdentifier Object Identifier
     * @return {undefined}
     */
    setObjectTypeIdentifiers(objectTypeIdentifiers, objectType, objectIdentifier) {
        if (objectTypeIdentifiers[objectType]) {
            objectTypeIdentifiers[objectType].push(objectIdentifier);
        } else {
            objectTypeIdentifiers[objectType] = [objectIdentifier];
        }
    },

    /**
     * Set Object Type Relationship on Hash of Object Type to number
     *
     * @param {Object} objectTypeCounts Object Type to number
     * @param {string} objectType Object Type
     * @return {undefined}
     */
    setObjectTypeRelationship(objectTypeRelationships, objectType, relationship) {
        if (objectTypeRelationships[objectType]) {
            objectTypeRelationships[objectType].push(relationship);
        } else {
            objectTypeRelationships[objectType] = [relationship];
        }
    },

    /**
     * Get Object Type from identifier
     *
     * @param {string} identifier STIX Object Identifier
     * @return {string} Object Type
     */
    getObjectType(identifier) {
        return identifier.split("--")[0];
    },

    /**
     * Node Mouseover Handler
     *
     * @param {Object} node Node Object
     */
    nodeMouseoverHandler(node) {
        const store = this.get("store");
        const id = node.id;
        const modelName = id.split("--")[0];
        const record = store.peekRecord(modelName, id);
        if (record) {
            this.showSelectedRecord(record);
        } else {
            const promise = store.findRecord(modelName, id);
            const self = this;
            promise.then((foundRecord) => {
                self.showSelectedRecord(foundRecord);
            });
        }
    },

    /**
     * Show Selected Record
     *
     * @param {Object} record DS.Record
     */
    showSelectedRecord(record) {
        this.set("selectedRecord", record);
    },

    /**
     * Node Mouseout Handler
     *
     */
    nodeMouseoutHandler() {
        this.set("selectedRecord", undefined);
    },

    /**
     * Actions
     *
     * @type {Object}
     */
    actions: {
        /**
         * Graph Node Mouseover
         *
         * @param {Object} node Node Object
         */
        graphNodeMouseover(node) {
            this.nodeMouseoverHandler(node);
        },

        /**
         * Graph Node Mouseout
         *
         * @param {Object} node Node Object
         */
        graphNodeMouseout(node) {
            this.nodeMouseoutHandler(node);
        }
    }
});
