import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

/*
 * @return {Node}
 */
export function parseType(base) {

  let node = new Node.TypeExpression();

  node.name = base;

  if (this.eat(TT.COLON)) {
    node.isReference = this.eat(TT.INOUT);
  }

  node.type = this.parseTypeExpression();

  return (node);

}

/*
 * @return {Node}
 */
export function parseTypeExpression() {

  let node = null;

  // Array
  if (this.eat(TT.LBRACK)) {
    node = this.parseTypeExpression();
    if (this.eat(TT.COLON)) {
      console.log(node, this.parseTypeExpression());
    }
  }
  // Tuple
  else if (this.peek(TT.LPAREN)) {
    node = this.parseTupleType();
  }
  // Identifier
  else if (this.peek(Token.Identifier)) {
    node = this.parseLiteral();
  }
  // Arrow
  else if (this.eat(TT.ARROW)) {
    node = this.parseLiteral();
  }
  else {
    node = this.parseExpressionStatement();
  }

  return (node);

}

/*
 * @return {Array}
 */
export function parseTupleType() {

  let node = this.parseMaybeArguments();

  return (node);

}