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
export function emitLiteral(node) {

  if (node.init) node = node.init;

  if (node.isGlobal) {
    this.write("__global.");
  }

  let name = this.isPureType(node) ? getNameByLabel(node.type) : node.value || node.name;

  let resolve = this.scope.get(node.value);

  if (this.isPureType(node)) {
    if (node.type === TT.SELF) {
      this.write("this");
    }
    else if (node.type === TT.NULL) {
      this.write("null");
    }
    else {
      this.write(getLabelByNumber(TT[name]));
    }
  } else {
    this.write(node.value || node.name);
  }

  if (resolve && resolve.isLaterPointer) {
    if (node.isPointer === void 0) {
      this.write(".value");
    }
  } else {
    resolve = this.scope.get(node.value);
    if (!node.isReference && resolve && resolve.isReference) {
      this.write(".value");
    }
  }

}