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

  // Tuple
  if (this.peek(TT.LPAREN)) {
    node = this.parseTupleType();
  }
  // Identifier
  else if (this.peek(Token.Identifier)) {
    node = this.parseLiteral();
    if (this.peek(TT.LT)) {
      node.generic = this.parseGeneric();
    }
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

export function parseGeneric() {

  let node = new Node.GenericClause();

  this.expect(TT.LT);

  let args = [];
  let id = null;

  while (true) {
    id = this.parseTypeExpression();
    args.push(id);
    if (!this.eat(TT.COMMA)) break;
  };

  this.expect(TT.GT);

  node.arguments = args;

  return (node);

}

export function parseTypeInheritance() {

  this.expect(TT.COLON);

  let args = [];
  let id = null;

  while (true) {
    id = this.parseLiteral();
    args.push(id);
    if (!this.eat(TT.COMMA)) break;
  };

  return (args);

}