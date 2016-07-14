import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseClass() {

  let node = new Node.ClassDeclaration();

  this.expect(TT.CLASS);

  if (this.peek(Token.Identifier)) {
    node.name = this.extract(Token.Identifier).value;
  // Fake class for a func or var
  } else {
    if (!this.peek(TT.LBRACE)) {
      return (this.parseSpecialClass(node));
    }
  }

  if (this.eat(TT.COLON)) {
    node.extend = this.parseCommaSeperatedValues() || [];
  }

  if (this.eat(TT.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(TT.RBRACE);
  }

  return (node);

}

/**
 * @param  {Node} base
 * @return {Node}
 */
export function parseSpecialClass(base) {

  let node = this.parseStatement();

  node.isClassed = true;

  return (node);

}