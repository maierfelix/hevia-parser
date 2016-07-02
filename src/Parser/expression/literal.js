import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @return {Node}
 */
export function parseLiteral() {

  if (this.peek(TT.LPAREN)) {
    this.expect(TT.LPAREN);
    let tmp = this.parseExpressionStatement();
    this.expect(TT.RPAREN);
    return (tmp);
  }

  let node = new Node.Literal();

  if (this.eat(TT.UL)) {
    node.isExplicit = true;
  }

  if (this.current.value === "&") {
    node.isPointer = true;
    this.next();
  }

  node.type = this.current.name;
  node.value = this.current.value;
  node.raw = this.current.value;
  this.next();

  /** Labeled literal */
  if (this.peek(Token.Identifier)) {
    if (!this.isOperator(TT[this.current.value])) {
      let tmp = this.parseLiteral();
      tmp.label = node;
      node = tmp;
    }
  }

  if (!this.inTernary) {
    if (this.eat(TT.COLON)) {
      if (this.eat(TT.INOUT)) {
        node.isReference = true;
        this.back();
      }
      this.back();
      node = this.parseStrictType(node);
    }
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseArrayDeclaration() {

  let node = new Node.ArrayDeclaration();

  let args = this.parseParenthese(TT.LBRACK, TT.RBRACK);

  node.argument = this.parseArguments(args);

  return (node);

}