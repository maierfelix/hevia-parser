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
export function compileDeclaration(node) {

  switch (node.kind) {
    case Type.VariableDeclaration:
      this.compileVariableDeclaration(node);
    break;
  };

}

/**
 * @param {Node} node
 */
export function compileVariableDeclaration(node) {

  let index = 0;

  let init = null;
  let label = null;

  for (let key of node.declarations) {
    label = key.kind === Type.Parameter ? key.init : key;
    init = node.init[index];
    this.scope.register(label);
    index++;
    if (key.kind !== Type.Parameter) {
      label.resolvedType = this.inferenceExpression(init);
    } else {
      label.resolvedType = key.argument.type;
    }
  };

}