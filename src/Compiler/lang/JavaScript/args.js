import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../../labels";

import Node from "../../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../../utils";

/**
 * @param {Node} node
 */
export function emitArguments(param) {

  let ii = 0;
  let length = param.length;

  for (; ii < length; ++ii) {
    this.emitStatement(param[ii]);
    if (ii + 1 < length) this.write(",");
  };

}

/**
 * @param {Node} node
 */
export function emitParameter(node) {
  if (this.insideCall) {
    this.emitStatement(node.argument);
  } else {
    this.emitStatement(node.init);
  }
}