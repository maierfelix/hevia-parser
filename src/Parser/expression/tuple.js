import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseTupleExpression() {

  let node = new Node.Tuple();

  while (true) {
    node.arguments.push(this.parseExpressionStatement());
    /** Nested tuple */
    if (this.peek(TT.LPAREN)) {
      node.arguments.push(this.parseExpressionStatement());
    }
    if (this.peek(TT.COMMA)) this.next();
    else break;
  };

  return (node);

}

/**
 * @return {Node}
 */
export function parseTupleType() {

  let node = new Node.TupleType();

  this.expect(TT.LPAREN);

  while (this.isNativeType(this.current.name)) {
    node.arguments.push(this.current.name);
    this.next();
    if (this.peek(TT.COMMA)) this.next();
    else break;
  };

  this.expect(TT.RPAREN);

  return (node);

}