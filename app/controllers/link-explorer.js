import Ember from "ember";

/**
 * Graphs Controller
 *
 * @module
 * @extends ember/Controller
 */
export default Ember.Controller.extend({
    centerEnabled: true,

    chargeEnabled: true,

    collideEnabled: true,

    columnPositionEnabled: true,

    linkEnabled: true,

    /**
     * Forces Enabled
     *
     * @return {Array} Array of strings listing enabled forces
     */
    forcesEnabled: Ember.computed("centerEnabled", "chargeEnabled", "collideEnabled", "columnPositionEnabled", "linkEnabled", function() {
        const forcesEnabled = [];

        if (this.get("centerEnabled")) {
            forcesEnabled.push("center");
        }
        if (this.get("chargeEnabled")) {
            forcesEnabled.push("charge");
        }
        if (this.get("collideEnabled")) {
            forcesEnabled.push("collide");
        }
        if (this.get("columnPositionEnabled")) {
            forcesEnabled.push("columnPosition");
        }
        if (this.get("linkEnabled")) {
            forcesEnabled.push("link");
        }

        return forcesEnabled;
    }),

    /**
     * Graph computed property based on relationships
     *
     * @return {Object} Graph Object containing nodes and links
     */
    graph: Ember.computed("model.relationships", function() {
        const relationships = this.get("model.relationships");
        const nodes = this.getNodes(relationships);
        const links = this.getLinks(relationships);
        return {
            nodes: nodes,
            links: links
        };
    }),

    /**
     * Get unique set of Nodes from Relationships
     *
     * @param {Array} Relationships
     * @return {Array} Unique set of Nodes
     */
    getNodes(relationships) {
        const references = relationships.reduce((accumulation, relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");
            accumulation.push(sourceRef);
            accumulation.push(targetRef);
            return accumulation;
        }, []);

        const counts = {};
        references.forEach((reference) => {
            if (counts[reference]) {
                counts[reference] += 1;
            } else {
                counts[reference] = 10;
            }
        });

        const nodes = references.uniq().map(reference => {
            return {
                id: reference,
                classNames: reference.split("--")[0],
                radius: counts[reference],
                collideRadius: counts[reference]
            };
        });

        return nodes;
    },

    /**
     * Get Links from Relationships
     *
     * @param {Array} Relationships
     */
    getLinks(relationships) {
        return relationships.map(relationship => {
            return this.getLink(relationship);
        }, this);
    },

    /**
     * Get Link from Relationships
     *
     * @param {Object} relationship Relationship Object
     * @return {Object} Link Object
     */
    getLink(relationship) {
        return {
            id: relationship.get("id"),
            source: relationship.get("source_ref"),
            target: relationship.get("target_ref")
        };
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
         * Reset Graph
         *
         */
        resetGraph() {
            this.notifyPropertyChange("model.relationships");
        },

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
