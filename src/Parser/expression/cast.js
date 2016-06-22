import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * Parse a type cast expression
 * @param  {Node} base
 * @return {Node}
 */
export function parseCast(base) {

  let node = new Node.TypeCast();

  node.operator = this.current.name;
  this.next();
  /** Conditional cast */
  if (this.peek(TT.CONDITIONAL)) {
    node.isConditional = true;
    this.next();
  }
  else if (this.peek(TT.NOT)) {
    node.isForced = true;
    this.next();
  }
  node.expression = base;
  node.type = this.parseLiteral();

  return (node);

}