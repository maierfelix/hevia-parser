/**
 * Provides predefined recursive
 * node walk structures
 */

export default class Walker {

  /** @constructor */
  constructor() {
    this.mode = "analyze";
    // parse program
    // parse body
    // parse statements
    // found binary expression =>
  }

  /**
   * @param {Node} node
   */
  walkBinaryExpression(node) {

    if (node.left.type === Type.BinaryExpression) {
      this.walkBinaryExpression(node.left);
    } else if (this.isValue(node.left)) {
      this[`${this.mode}BinaryExpression`](node.left);
    } else {
      this.walkStatement(node.left);
    }

    if (node.right.type === Type.BinaryExpression) {
      this.walkBinaryExpression(node.right);
    } else if (this.isValue(node.right)) {
      this[`${this.mode}BinaryExpression`](node.right);
    } else {
      this.walkStatement(node.right);
    }

  }

}