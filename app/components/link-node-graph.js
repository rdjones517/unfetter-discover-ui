import Ember from "ember";
import force from "d3-force";
import selection from "d3-selection";
import zoom from "d3-zoom";
import drag from "d3-drag";
import ColumnForcePosition from "../mixins/column-force-position";

/**
 * Link Node Graph Component based on D3
 *
 * @module
 * @extends ember/Component
 */
export default Ember.Component.extend(ColumnForcePosition, {
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
  classNames: "link-node-graph",

  /**
   * CSS Selector for nodes
   *
   * @type {string}
   */
  nodeSelector: ".node",

  /**
   * CSS Selector for links
   *
   * @type {string}
   */
  linkSelector: ".link",

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
   * Force Link Distance Length
   *
   * @type {string}
   */
  linkDistance: 70,

  /**
   * Node Radius defaults to 10
   *
   * @type {double}
   */
  nodeRadius: 10,

  /**
   * Collide Radius defaults to 10
   *
   * @type {double}
   */
  collideRadius: 10,

  /**
   * Charge Strength defaults to -30
   *
   *  @type {double}
   */
  chargeStrength: -30,

  /**
   * Group Element
   *
   * @type {Object}
   */
  group: undefined,

  /**
   * Drag Enabled defaults to true
   *
   * @type {boolean}
   */
  dragEnabled: true,

  /**
   * Zoom Enabled defaults to true
   *
   * @type {boolean}
   */
  zoomEnabled: true,

  /**
   * Forces Enabled
   *
   * @type {Array}
   */
  forcesEnabled: [ "center", "collide", "charge", "link", "columnPosition" ],

  /**
   * Did Insert Element
   *
   * @return {undefined}
   */
  didInsertElement() {
    this._super(...arguments);
    const group = this.createGroup();
    this.set("group", group);

    this.setupGraph();
  },

  /**
   * Graph Observer
   *
   */
  graphObserver: Ember.observer("graph", function() {
    let group = this.getGroup();
    if (group) {
      group.remove();
    }
    group = this.createGroup();
    this.set("group", group);
    this.setupGraph();
  }),

  /**
   * Forces Enabled Observer
   *
   */
  forcesEnabledObserver: Ember.observer("forcesEnabled", function() {
    let group = this.getGroup();
    if (group) {
      group.remove();
    }
    group = this.createGroup();
    this.set("group", group);
    this.setupGraph();
  }),

  /**
   * Setup Graph
   *
   * @param {Object} group Group Element
   * @return {undefined}
   */
  setupGraph() {
    const graph = this.get("graph");

    const zoomEnabled = this.get("zoomEnabled");
    if (zoomEnabled) {
      this.setZoomBehavior();
      this.createZoomOverlay();
    }

    const simulation = this.createSimulation(graph);
    this.set('simulation', simulation);
    simulation.on("tick", this.tickHandler.bind(this));
    this.setupElements(graph);
  },

  /**
   * Set Elements
   *
   * @param {Object} Graph Object containing nodes and links
   */
  setupElements(graph) {
    const group = this.getGroup();
    const shapesGroup = this.createShapesGroup(group);
    this.set("shapesGroup", shapesGroup);

    const linkElements = this.getLinkElements();
    const linkShapes = linkElements.data(graph.links).enter().append("line").attr("class", "link");
    linkShapes.attr("id", this.getNodeId);

    const nodeElements = this.getNodeElements();
    const nodeShapes = nodeElements.data(graph.nodes).enter().append("circle");

    nodeShapes.attr("class", this.getNodeClass);
    nodeShapes.attr("r", this.getNodeRadius.bind(this));
    nodeShapes.attr("id", this.getNodeId);

    const dragEnabled = this.get("dragEnabled");
    if (dragEnabled) {
      this.setDragBehavior(nodeShapes);
    }

    this.setHoverEventBehavior(graph);
  },

  /**
   * Set Hover Event Behavior
   *
   * @param {Object} graph Graph of Nodes and Links
   */
  setHoverEventBehavior(graph) {
    const linkedNodesHash = this.getLinkedNodesHash(graph);
    const nodeLinksHash = this.getNodeLinksHash(graph);
    const shapesGroup = this.get("shapesGroup");
    const nodeShapes = this.getNodeElements();
    const linkShapes = this.getLinkElements();

    const self = this;
    nodeShapes.on("mouseover", (node) => {
      self.sendAction("nodeMouseover", node);
      nodeShapes.style("fill", "lightgray");

      const nodeEl = shapesGroup.select(`#${node.id}`);
      nodeEl.style("fill", undefined);
      nodeEl.style("stroke", "black");

      const currentLinkedNodes = linkedNodesHash[node.id];
      if (currentLinkedNodes) {
        currentLinkedNodes.forEach((linkedNodeId) => {
          const linkedNodeEl = shapesGroup.select(`#${linkedNodeId}`);
          linkedNodeEl.style("fill", undefined);
        });
      }

      linkShapes.style("stroke-opacity", 0.25);
      const currentNodeLinks = nodeLinksHash[node.id];
      if (currentNodeLinks) {
        currentNodeLinks.forEach((linkId) => {
          const linkEl = shapesGroup.select(`#${linkId}`);
          linkEl.style("stroke", "black");
          linkEl.style("stroke-opacity", undefined);
        });
      }
    });

    nodeShapes.on("mouseout", (node) => {
      self.sendAction("nodeMouseout", node);
      nodeShapes.style("fill", undefined);
      nodeShapes.style("stroke", undefined);
      linkShapes.style("stroke", undefined);
      linkShapes.style("stroke-opacity", undefined);
    });
  },

  /**
   * Get Linked Nodes Hash of Node Identifier to Array of Target Identifiers
   *
   * @param {Object} graph Graph of Nodes and Links
   * @return {Object} Hash of Node Identifier to Array of Target Identifiers
   */
  getLinkedNodesHash(graph) {
    const linkedNodesHash = {};
    graph.links.forEach((link) => {
      const source = link.source.id;
      const target = link.target.id;

      if (linkedNodesHash[source]) {
        linkedNodesHash[source].push(target);
      } else {
        linkedNodesHash[source] = [target];
      }

      if (linkedNodesHash[target]) {
        linkedNodesHash[target].push(source);
      } else {
        linkedNodesHash[target] = [source];
      }
    });

    return linkedNodesHash;
  },

  /**
   * Get Node Links Hash
   *
   * @param {Object} graph Graph of Nodes and Links
   * @return {Object} Hash of Node Identifier to Array of Link Identifiers
   */
  getNodeLinksHash(graph) {
    const hash = {};
    graph.links.forEach((link) => {
      const source = link.source.id;
      const target = link.target.id;

      if (hash[source]) {
        hash[source].push(link.id);
      } else {
        hash[source] = [link.id];
      }

      if (hash[target]) {
        hash[target].push(link.id);
      } else {
        hash[target] = [link.id];
      }
    });

    return hash;
  },

  /**
   * Set Drag Behavior on Node Shapes
   *
   * @param {Array} nodeShapes Array of Node Shape Elements
   */
  setDragBehavior(nodeShapes) {
    const dragBehavior = drag.drag();
    dragBehavior.on("drag", this.dragHandler);
    dragBehavior.on("start", this.dragStartHandler.bind(this));
    dragBehavior.on("end", this.dragEndHandler.bind(this));
    nodeShapes.call(dragBehavior);
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

    const group = this.getGroup();
    group.call(zoomBehavior);

    return zoomBehavior;
  },

  /**
   * Create simulation
   *
   * @param {Object} graph Graph Object containing nodes and links
   * @return {Object} D3 Force Simluation
   */
  createSimulation(graph) {
    const simulation = force.forceSimulation();
    simulation.nodes(graph.nodes);

    const forcesEnabled = this.get("forcesEnabled");
    if (forcesEnabled.contains("charge")) {
      this.setForceCharge(simulation);
    }

    if (forcesEnabled.contains("center")) {
      this.setForceCenter(simulation);
    }

    if (forcesEnabled.contains("link")) {
      this.setForceLink(simulation, graph);
    }

    if (forcesEnabled.contains("collide")) {
      this.setForceCollide(simulation);
    }

    if (forcesEnabled.contains("columnPosition")) {
      this.setColumnForcePosition(simulation, graph);
    }

    return simulation;
  },

  /**
   * Set Force Collide
   *
   * @param {Object} simulation D3 Force Simulation
   * @return {Object} Force Collide Object
   */
  setForceCollide(simulation) {
    const forceCollide = force.forceCollide();
    forceCollide.radius(this.getNodeCollideRadius.bind(this));
    simulation.force("collide", forceCollide);
    return forceCollide;
  },

  /**
   * Set Force Charge on Simulation
   *
   * @param {Object} simulation D3 Force Simulation
   * @return {undefined}
   */
  setForceCharge(simulation) {
    const manyBody = force.forceManyBody();
    const chargeStrength = this.get("chargeStrength");
    manyBody.strength(chargeStrength);
    simulation.force("charge", manyBody);
  },

  /**
   * Set Force Link
   *
   * @param {Object} simulation D3 Force Simulation
   * @param {Object} graph Graph including nodes and links
   * @return {Object} Force Link
   */
  setForceLink(simulation, graph) {
    const forceLink = force.forceLink();
    forceLink.id(this.getLinkId);
    forceLink.links(graph.links);

    const linkDistance = this.get("linkDistance");
    forceLink.distance(linkDistance);

    simulation.force("link", forceLink);
    return forceLink;
  },

  /**
   * Set Force Center using Bounding Client Rectangle
   *
   * @param {Object} simulation D3 Force Simulation
   * @return {Object} Force Center
   */
  setForceCenter(simulation) {
    const centerCoordinates = this.getCenterCoordinates();
    const forceCenter = force.forceCenter(centerCoordinates.x, centerCoordinates.y);

    simulation.force("center", forceCenter);
    return forceCenter;
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

    const group = this.getGroup();
    const zoomOverlay = group.append("rect");
    zoomOverlay.attr("width", width);
    zoomOverlay.attr("height", height);
    zoomOverlay.style("fill", "none");
    zoomOverlay.style("pointer-events", "all");
    return zoomOverlay;
  },

  /**
   * Get Center Coordinates
   *
   * @return {Object} Center Coordinates Object with X and Y properties
   */
  getCenterCoordinates() {
    const bounding = this.element.getBoundingClientRect();
    const width = bounding.width;
    const height = bounding.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const coordinates = {
      x: centerX,
      y: centerY
    };
    return coordinates;
  },

  /**
   * Tick Handler for updating elements
   *
   * @return {undefined}
   */
  tickHandler() {
    const nodeElements = this.getNodeElements();

    nodeElements.attr("cx", d => { return d.x; });
    nodeElements.attr("cy", d => { return d.y; });

    const linkElements = this.getLinkElements();
    linkElements.attr("x1", d => { return d.source.x; });
    linkElements.attr("y1", d => { return d.source.y; });
    linkElements.attr("x2", d => { return d.target.x; });
    linkElements.attr("y2", d => { return d.target.y; });
  },

  /**
   * Zoom Handler for updating bounding transform
   *
   * @return {undefined}
   */
  zoomHandler() {
    const shapesGroup = this.get('shapesGroup');
    shapesGroup.attr("transform", selection.event.transform);
  },

  /**
   * Drag Start Handler
   *
   * @param {Object} eventObject Event Object with coordinates
   */
  dragStartHandler(eventObject) {
    if (!selection.event.active) {
      const simulation = this.get('simulation');
      simulation.alphaTarget(0.3).restart();
    }
    eventObject.fx = eventObject.x;
    eventObject.fy = eventObject.y;
  },

  /**
   * Drag End Handler
   *
   */
  dragEndHandler() {
    if (!selection.event.active) {
      const simulation = this.get('simulation');
      simulation.alphaTarget(0);
    }
  },

  /**
   * Drag Handler
   *
   * @param {Object} eventObject Event Object with coordinates
   */
  dragHandler(eventObject) {
    eventObject.fx = selection.event.x;
    eventObject.fy = selection.event.y;
  },

  /**
   * Get Link Elements
   *
   * @return {Array} Array of Links
   */
  getLinkElements() {
    const linkSelector = this.get("linkSelector");
    const shapesGroup = this.get('shapesGroup');
    return shapesGroup.selectAll(linkSelector);
  },

  /**
   * Get Node Elements
   *
   * @return {Array} Array of Nodes
   */
  getNodeElements() {
    const nodeSelector = this.get("nodeSelector");
    const shapesGroup = this.get('shapesGroup');
    return shapesGroup.selectAll(nodeSelector);
  },

  /**
   * Get Group
   *
   * @return Group Element
   */
  getGroup() {
    return this.get("group");
  },

  /**
   * Create Group
   *
   * @return {Object} Group Element
   */
  createGroup() {
    const container = selection.select(this.element);
    return container.append("g");
  },

  /**
   * Create Shapes Group
   *
   * @param {Object} group Container Group
   * @return {Object} Group Element
   */
  createShapesGroup(group) {
    return group.append("g");
  },

  /**
   * Get Link Identifier from id field
   *
   * @param {Object} link Link Object
   * @return {string} Link Identifier
   */
  getLinkId(link) {
    return link.id;
  },

  /**
   * Get Node Identifier
   *
   * @param {Object} node Node Object
   * @return {string} Node Identifier
   */
  getNodeId(node) {
    let id = Math.random().toString();
    if (node.id) {
      id = node.id;
    }
    return id;
  },

  /**
   * Get Node Class using identifier
   *
   * @param {Object} node Node Object
   * @return {string} Node Class
   */
  getNodeClass(node) {
    let classNames = "node";
    if (node.classNames) {
      classNames = `node ${node.classNames}`;
    }
    return classNames;
  },

  /**
   * Get Node Radius
   *
   * @param {Object} node Node Object
   * @return {double} Node Radius
   */
  getNodeRadius(node) {
    let nodeRadius = this.get("nodeRadius");
    if (node.radius) {
      nodeRadius = node.radius;
    }
    return nodeRadius;
  },

  /**
   * Get Node Collide Radius
   *
   * @param {Object} node Node Object
   * @return {double} Node Collide Radius
   */
  getNodeCollideRadius(node) {
    let collideRadius = this.get("collideRadius");
    if (node.collideRadius) {
      collideRadius = node.collideRadius;
    }
    return collideRadius;
  }
});
