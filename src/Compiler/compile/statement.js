import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @param {Node} node
 */
export function compileIfStatement(node) {

  if (node.consequent !== null) {
    this.pushScope(node.consequent);
    this.compileBlock(node.consequent);
    this.popScope();
  }

  if (node.alternate !== null) {
    /** Else if */
    if (node.alternate.kind === Type.Block) {
      this.pushScope(node.alternate);
      this.compileBlock(node.alternate);
      this.popScope();
    /** Standalone else */
    } else {
      this.compileIfStatement(node.alternate);
    }
  }

}