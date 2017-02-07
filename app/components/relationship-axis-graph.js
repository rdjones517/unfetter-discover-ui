import Ember from "ember";
import ResizeAware from "ember-resize/mixins/resize-aware";
import ENV from "unfetter-discover-ui/config/environment";
import selection from "d3-selection";
import scale from "d3-scale";
import shape from "d3-shape";
import zoom from "d3-zoom";

/**
 * Relationship Axis Graph Component based on D3
 *
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend(ResizeAware, {
    /**
     * Component rendered tag
     *
     * @type {string}
     */
    tagName: "svg",

    /**
     * Component rendered CSS classes
     *
     * @type {string}
     */
    classNames: "relationship-axis-graph",

    /**
     * Minimum Zoom defaults to 0.5
     *
     * @type {double}
     */
    minimumZoom: 0.25,

    /**
     * Maximum Zoom defaults to 5
     *
     * @type {double}
     */
    maximumZoom: 5,

    /**
     * Default Node Radius
     *
     * @type {number}
     */
    defaultNodeRadius: 5,

    /**
     * Padding for graph based on number of pixels
     *
     * @type {number}
     */
    padding: 50,

    /**
     * Header Icon Size in pixels
     *
     * @type {number}
     */
    headerIconSize: 30,

    /**
     * Header Label Size in pixels
     *
     * @type {number}
     */
    headerLabelSize: 15,

    /**
     * Array of Relationships
     *
     * @type {Array}
     */
    relationships: [],

    /**
     * Array of Object Type Relationship Objects
     *
     * @type {Array}
     */
    objectTypeRelationships: [],

    /**
     * Selection Locked
     *
     */
    selectionLocked: false,

    /**
     * Did Insert Element
     *
     * @return {undefined}
     */
    didInsertElement() {
        this._super(...arguments);

        this.renderElements();
    },

    /**
     * Debounced Did Resize handler from ResizeAware mixin
     *
     */
    debouncedDidResize() {
        this.renderElements();
    },

    /**
     * Object Relationships computed based on relationships
     *
     * @return {Object} Object Identifier to Array of Relationships
     */
    objectRelationships: Ember.computed("relationships", function() {
        const objectRelationships = {};

        const relationships = this.get("relationships");
        relationships.forEach((relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");

            if (objectRelationships[sourceRef]) {
                objectRelationships[sourceRef].push(relationship);
            } else {
                objectRelationships[sourceRef] = [relationship];
            }

            if (objectRelationships[targetRef]) {
                objectRelationships[targetRef].push(relationship);
            } else {
                objectRelationships[targetRef] = [relationship];
            }
        });

        return objectRelationships;
    }),

    /**
     * Object Types Enabled
     *
     */
    objectTypesEnabled: Ember.computed("objectTypeRelationships", function() {
        const objectTypeRelationships = this.get("objectTypeRelationships");
        const objectTypesEnabled = [];

        objectTypeRelationships.forEach((objectTypeRelationship) => {
            const objectType = objectTypeRelationship.label;
            objectTypesEnabled.push(objectType);
        });

        return objectTypesEnabled;
    }),

    /**
     * Object Type Relationships Observer
     *
     */
    objectTypeRelationshipsObserver: Ember.observer("objectTypeRelationships", function() {
        this.renderElements();
    }),

    /**
     * Render Elements
     *
     */
    renderElements() {
        const containerGroup = this.get("containerGroup");
        if (containerGroup) {
            containerGroup.remove();
        }
        this.createElements();
        this.setZoomBehavior();
    },

    /**
     * Create Elements
     *
     */
    createElements() {
        const objectTypeRelationships = this.get("objectTypeRelationships");
        const objectTypeHorizontalPositions = this.getObjectTypeHorizontalPositions();

        const containerGroup = this.createContainerGroup();
        this.createZoomOverlay();

        const elementsGroup = containerGroup.append("g");
        this.set("elementsGroup", elementsGroup);

        const linksGroup = elementsGroup.append("g");
        const axisGroup = elementsGroup.append("g");

        const headerIconSize = this.get("headerIconSize");
        const halfHeaderIconSize = (headerIconSize / 2);
        const headerLabelSize = this.get("headerLabelSize");
        const padding = this.get("padding");
        const verticalPositionStart = (padding * 1.5) + headerIconSize + headerLabelSize;
        const verticalPositionEnd = this.getPaddedBoundingClientHeight();

        const nodes = {};
        const shapesGroup = elementsGroup.append("g");

        objectTypeRelationships.forEach((objectTypeRelationship) => {
            const axis = axisGroup.append("line");
            const objectType = objectTypeRelationship.label;
            const horizontalPosition = objectTypeHorizontalPositions[objectType];

            axis.attr("class", "axis");
            axis.attr("x1", horizontalPosition);
            axis.attr("x2", horizontalPosition);
            axis.attr("y1", verticalPositionStart);
            axis.attr("y2", verticalPositionEnd);

            const axisHeaderGroup = axisGroup.append("g");
            axisHeaderGroup.attr("class", `axis-header-group axis-header-group-${objectType}`);

            const axisHeaderIcon = axisHeaderGroup.append("image");
            axisHeaderIcon.attr("xlink:href", this.getIconHref(objectType));
            axisHeaderIcon.attr("class", `axis-header-icon axis-header-icon-${objectType}`);
            axisHeaderIcon.attr("id", `axis-header-icon-${objectType}`);
            axisHeaderIcon.attr("width", `${headerIconSize}px`);
            axisHeaderIcon.attr("height", `${headerIconSize}px`);
            axisHeaderIcon.attr("y", padding);
            axisHeaderIcon.attr("x", horizontalPosition - halfHeaderIconSize);

            const objectIdentifiers = this.getObjectIdentifiers(objectTypeRelationship);

            const axisHeaderLabel = axisHeaderGroup.append("text");
            axisHeaderLabel.attr("class", `axis-header-label axis-header-label-${objectType}`);
            axisHeaderLabel.attr("id", `axis-header-label-${objectType}`);
            axisHeaderLabel.attr("y", padding + headerIconSize + headerLabelSize);
            axisHeaderLabel.attr("x", horizontalPosition);
            axisHeaderLabel.text(objectIdentifiers.length);

            const objectScaleDomain = [0, (objectIdentifiers.length - 1)];
            const objectScaleRange = [verticalPositionStart, verticalPositionEnd];
            const objectScale = scale.scaleLinear().domain(objectScaleDomain).range(objectScaleRange);

            let objectTypeIndex = 0;
            objectIdentifiers.forEach((objectIdentifier) => {
                const verticalPosition = objectScale(objectTypeIndex);
                objectTypeIndex++;
                const node = {
                    id: objectIdentifier,
                    objectType: objectType,
                    x: horizontalPosition,
                    y: verticalPosition
                };
                nodes[objectIdentifier] = node;
            });
        }, this);

        const relationships = this.get("relationships");
        relationships.forEach((relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");

            const sourceNode = nodes[sourceRef];
            const targetNode = nodes[targetRef];
            if (sourceNode) {
                if (targetNode) {
                    const points = this.getLinkPoints(sourceNode, targetNode);
                    const line = shape.line().curve(shape.curveBasis);
                    const path = linksGroup.append("path");
                    path.attr("class", "link");
                    path.attr("d", line(points));
                    path.attr("id", relationship.get("id"));
                }
            }
        }, this);

        const nodesArray = [];
        for (let id in nodes) {
            const node = nodes[id];
            nodesArray.push(node);
        }

        const defaultNodeRadius = this.get("defaultNodeRadius");
        const nodeShapes = shapesGroup.selectAll("circle").data(nodesArray).enter().append("circle");
        nodeShapes.attr("id", (node) => { return node.id; });
        nodeShapes.attr("r", defaultNodeRadius);
        nodeShapes.attr("class", (node) => { return `node ${node.objectType}`; });
        nodeShapes.attr("cx", (node) => { return node.x; });
        nodeShapes.attr("cy", (node) => { return node.y; });
        nodeShapes.on("click", this.nodeClick.bind(this));
        nodeShapes.on("mouseover", this.nodeMouseOver.bind(this));
        nodeShapes.on("mouseout", this.nodeMouseOut.bind(this));
    },

    /**
     * Get Icon Hyperlink Reference URL
     *
     * @param {string} objectType Object Type
     * @return {string} Hyperlink Reference URL
     */
    getIconHref(objectType) {
        return `${ENV.rootURL}stix-icons/svg/${objectType}-b.svg`;
    },

    /**
     * Get Link Points
     *
     * @param {Object} sourceNode Source Node
     * @param {Object} targetNode Target Node
     * @return {Array} Array of Points for Link
     */
    getLinkPoints(sourceNode, targetNode) {
        const points = [
            [sourceNode.x, sourceNode.y],
            [(sourceNode.x * 0.67) + (0.33 * targetNode.x), sourceNode.y],
            [(sourceNode.x * 0.33) + (0.67 * targetNode.x), targetNode.y],
            [targetNode.x, targetNode.y]
        ];
        return points;
    },

    /**
     * Node Mouse Over
     *
     * @param {Object} node Node Object
     */
    nodeMouseOver(node) {
        this.sendAction("nodeMouseover", node);
        const selectionLocked = this.get("selectionLocked");
        if (!selectionLocked) {
            this.setSelections(node);
        }
    },

    /**
     * Node Mouse Out
     *
     */
    nodeMouseOut(node) {
        this.sendAction("nodeMouseout", node);
        const selectionLocked = this.get("selectionLocked");
        if (!selectionLocked) {
            this.clearSelections();
        }
    },

    /**
     * Node Click
     *
     * @param {Object} node Node Object
     */
    nodeClick(node) {
        const selectionLocked = this.get("selectionLocked");
        if (selectionLocked) {
            this.set("selectionLocked", false);
            this.clearSelections();
        } else {
            this.set("selectionLocked", true);
            this.setSelections(node);
        }
    },

    /**
     * Set Selections
     *
     * @param {Object} node Node Object
     */
    setSelections(node) {
        selection.selectAll(".node").classed("unselected", true);
        selection.selectAll(".link").classed("unselected", true);
        const nodeObjectType = this.getObjectType(node.id);
        const nodeObjectTypes = [nodeObjectType];
        this.setElementSelected(node.id);
        this.selectRelationships(node.id, nodeObjectTypes);

        const objectTypeRelationships = this.get("objectTypeRelationships");
        objectTypeRelationships.forEach((objectTypeRelationship) => {
            const objectType = objectTypeRelationship.label;

            const objectTypeNodes = selection.selectAll(`.node.${objectType}`);
            const objectTypeNodesSize = objectTypeNodes.size();

            const selectedObjectTypeNodes = selection.selectAll(`.node.${objectType}.selected`);
            const selectedObjectTypeNodesSize = selectedObjectTypeNodes.size();

            const axisHeaderLabel = selection.select(`#axis-header-label-${objectType}`);
            axisHeaderLabel.text(`${selectedObjectTypeNodesSize} of ${objectTypeNodesSize}`);
        });
    },

    /**
     * Clear Selections
     *
     */
    clearSelections() {
        selection.selectAll(".node").classed("unselected", false).classed("selected", false);
        selection.selectAll(".link").classed("selected", false).classed("unselected", false);

        const objectTypeRelationships = this.get("objectTypeRelationships");
        objectTypeRelationships.forEach((objectTypeRelationship) => {
            const objectType = objectTypeRelationship.label;
            const objectTypeNodes = selection.selectAll(`.node.${objectType}`);
            const objectTypeNodesSize = objectTypeNodes.size();

            const axisHeaderLabel = selection.select(`#axis-header-label-${objectType}`);
            axisHeaderLabel.text(objectTypeNodesSize);
        });
    },

    /**
     * Select Relationships sets selected status on nodes and links
     *
     * @param {string} id Object Identifier
     * @param {Array} nodeObjectTypes Array of Object Types to avoid selecting
     */
    selectRelationships(id, nodeObjectTypes) {
        const objectTypesEnabled = this.get("objectTypesEnabled");
        const objectRelationships = this.get("objectRelationships");
        const nodeRelationships = objectRelationships[id];
        if (nodeRelationships) {
            nodeRelationships.forEach((relationship) => {
                const relationshipId = relationship.get("id");

                const sourceRef = relationship.get("source_ref");
                const sourceRefObjectType = this.getObjectType(sourceRef);

                const targetRef = relationship.get("target_ref");
                const targetRefObjectType = this.getObjectType(targetRef);

                if (sourceRef === id) {
                    if (!nodeObjectTypes.contains(targetRefObjectType)) {
                        if (objectTypesEnabled.contains(targetRefObjectType)) {
                            this.setElementSelected(relationshipId);
                            this.setElementSelected(targetRef);

                            const targetObjectTypes = nodeObjectTypes.concat(targetRefObjectType);
                            this.selectRelationships(targetRef, targetObjectTypes);
                        }
                    }
                } else {
                    if (!nodeObjectTypes.contains(sourceRefObjectType)) {
                        if (objectTypesEnabled.contains(sourceRefObjectType)) {
                            this.setElementSelected(relationshipId);
                            this.setElementSelected(sourceRef);

                            const sourceObjectTypes = nodeObjectTypes.concat(sourceRefObjectType);
                            this.selectRelationships(sourceRef, sourceObjectTypes);
                        }
                    }
                }
            }, this);
        }
    },

    /**
     * Set Element Selected
     *
     * @param {string} Element Identifier
     */
    setElementSelected(id) {
        const selectedElement = selection.select(`#${id}`);
        selectedElement.classed("selected", true);
        selectedElement.classed("unselected", false);
    },

    /**
     * Set Zoom Behavior on Component Container using overlay
     *
     */
    setZoomBehavior() {
        const zoomBehavior = zoom.zoom();
        const minimumZoom = this.get("minimumZoom");
        const maximumZoom = this.get("maximumZoom");
        zoomBehavior.scaleExtent([minimumZoom, maximumZoom]);
        zoomBehavior.on("zoom", this.zoomHandler.bind(this));

        const containerGroup = this.get("containerGroup");
        containerGroup.call(zoomBehavior);

        return zoomBehavior;
    },

    /**
     * Create Zoom Overlay
     *
     * @return {Object} Rectangle Element
     */
    createZoomOverlay() {
        const bounding = this.element.getBoundingClientRect();
        const width = bounding.width;
        const height = bounding.height;

        const containerGroup = this.get("containerGroup");
        const zoomOverlay = containerGroup.append("rect");
        zoomOverlay.attr("width", width);
        zoomOverlay.attr("height", height);
        zoomOverlay.style("fill", "none");
        zoomOverlay.style("pointer-events", "all");
        return zoomOverlay;
    },

    /**
     * Zoom Handler for updating bounding transform
     *
     * @return {undefined}
     */
    zoomHandler() {
        const elementsGroup = this.get("elementsGroup");
        elementsGroup.attr("transform", selection.event.transform);
    },

    /**
     * Get Object Identifiers
     *
     * @param {Object} Object Type Relationship Object
     * @return {Array} Unique Array of Object Identifiers from Relationships
     */
    getObjectIdentifiers(objectTypeRelationship) {
        const relationships = objectTypeRelationship.relationships;
        const objectType = objectTypeRelationship.label;
        const objectIdentifiers = [];
        relationships.forEach((relationship) => {
            const sourceRef = relationship.get("source_ref");
            const targetRef = relationship.get("target_ref");

            if (sourceRef.startsWith(objectType)) {
                objectIdentifiers.push(sourceRef);
            }
            if (targetRef.startsWith(objectType)) {
                objectIdentifiers.push(targetRef);
            }
        });

        return objectIdentifiers.uniq();
    },

    /**
     * Get Object Type Horizontal Positions computed based on client width and number of Object Types
     *
     * @return {Object} Hash of Object Type Label to Horizontal Position number
     */
    getObjectTypeHorizontalPositions() {
        const objectTypeRelationships = this.get("objectTypeRelationships");
        const objectTypeCount = objectTypeRelationships.length;

        const paddedBoundingClientWidth = this.getPaddedBoundingClientWidth();
        const axisMargin = Math.round(paddedBoundingClientWidth / (objectTypeCount - 1));

        const objectTypeHorizontalPositions = {};
        let horizontalPosition = this.get("padding");
        objectTypeRelationships.forEach((objectTypeRelationship) => {
            const label = objectTypeRelationship.label;
            objectTypeHorizontalPositions[label] = horizontalPosition;
            horizontalPosition += axisMargin;
        });

        return objectTypeHorizontalPositions;
    },

    /**
     * Get Padded Bounding Client Height from DOM Element minus padding
     *
     * @return {number} Padded Bounding ClientHeightWidth
     */
    getPaddedBoundingClientHeight() {
        const boundingHeight = this.getBoundingClientHeight();
        const padding = this.get("padding");
        const paddedBoundingHeight = boundingHeight - (padding * 2);
        return Math.round(paddedBoundingHeight);
    },

    /**
     * Get Padded Bounding Client Width from DOM Element minus padding
     *
     * @return {number} Padded Bounding Client Width
     */
    getPaddedBoundingClientWidth() {
        const boundingWidth = this.getBoundingClientWidth();
        const padding = this.get("padding");
        const paddedBoundingWidth = boundingWidth - (padding * 2);
        return Math.round(paddedBoundingWidth);
    },

    /**
     * Get Bounding Client Height from DOM Element
     *
     * @return {number} Bounding Client Height
     */
    getBoundingClientHeight() {
        const bounding = this.element.getBoundingClientRect();
        const height = bounding.height;
        return height;
    },

    /**
     * Get Bounding Client Width from DOM Element
     *
     * @return {number} Bounding Client Width
     */
    getBoundingClientWidth() {
        const bounding = this.element.getBoundingClientRect();
        const width = bounding.width;
        return width;
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
     * Create Container Group
     *
     * @return {Object} Container Group
     */
    createContainerGroup() {
        const selectedElement = selection.select(this.element);
        const containerGroup = selectedElement.append("g");
        this.set("containerGroup", containerGroup);
        return containerGroup;
    }
});
