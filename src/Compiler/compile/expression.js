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
export function compileExpression(node) {

  switch (node.kind) {
    case Type.CallExpression:
      this.compileCallExpression(node);
    break;
  };

}

/**
 * @param {Node} node
 */
export function compileCallExpression(node) {

}