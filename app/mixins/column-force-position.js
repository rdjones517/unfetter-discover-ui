import Ember from "ember";
import force from "d3-force";

/**
 * Column Force Position Mixin
 *
 * @module
 * @extends ember/Mixin
 */
export default Ember.Mixin.create({
  /**
   * Set Force Position
   *
   */
  setColumnForcePosition(simulation, graph) {
    const nodeClasses = {};

    graph.nodes.forEach((node) => {
      const nodeClass = node.classNames;
      if (nodeClasses[nodeClass]) {
        nodeClasses[nodeClass].push(node);
      } else {
        nodeClasses[nodeClass] = [node];
      }
    });

    const nodeClassColumns = {};
    let totalColumns = 0;
    for (let nodeClass in nodeClasses) {
      totalColumns += 1;
      nodeClassColumns[nodeClass] = 0;
    }

    const totalColumnSections = totalColumns + 2;
    const bounding = this.element.getBoundingClientRect();
    const width = bounding.width;
    const columnSectionWidth = width / totalColumnSections;
    let currentColumnPosition = columnSectionWidth;

    const nodePositionX = {};
    const nodePositionY = {};
    for (let nodeClass in nodeClassColumns) {
      nodeClassColumns[nodeClass] = currentColumnPosition;

      const currentNodes = nodeClasses[nodeClass];
      this.setNodePositions(nodePositionX, nodePositionY, currentColumnPosition, currentNodes);

      currentColumnPosition += columnSectionWidth;
    }

    const forcePositionX = force.forceX();
    forcePositionX.strength(3);
    forcePositionX.x((node) => {
      return nodePositionX[node.id];
    });

    const forcePositionY = force.forceY();
    forcePositionY.strength(3);
    forcePositionY.y((node) => {
      return nodePositionY[node.id];
    });

    simulation.force("columnForcePositionX", forcePositionX);
    simulation.force("columnForcePositionY", forcePositionY);
  },

  /**
   * Set Node Positions
   *
   * @param {Object} nodePositionX Hash of Node Identifier to X Position
   * @param {Object} nodePositionY Hash of Node Identifier to Y Position
   * @param {number} Current Column Position number
   * @param {Array} Array of Nodes
   */
  setNodePositions(nodePositionX, nodePositionY, currentColumnPosition, currentNodes) {
    let currentNodePositionY = 1;
    currentNodes.forEach((node) => {
      nodePositionX[node.id] = currentColumnPosition;
      nodePositionY[node.id] = currentNodePositionY += (node.radius * 2);
    });
  }
});
