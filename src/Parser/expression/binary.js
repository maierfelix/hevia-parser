import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import { Precedence } from "../../precedence";

/**
 * @param  {Number} index Precedence
 * @return {Node}
 */
export function parseBinaryExpression(index) {

  let tmp = null;
  let ast = null;
  let node = null;

  let state = Precedence[index];

  ast = state ? this.parseBinaryExpression(index + 1) : this.parseLiteral();

  while (this.acceptPrecedence(state)) {
    node = new Node.BinaryExpression();
    node.operator = this.current.name;
    this.next();
    node.left = ast;
    tmp = state ? this.parseBinaryExpression(index + 1) : this.parseLiteral();
    node.right = tmp;
    ast = node;
  };

  return (ast);

}

/**
 * @return {Node}
 */
export function parseLiteral() {

  let node = null;

  if (this.eat(TT.LPAREN)) {
    node = this.parseBinaryExpression(0);
    this.eat(TT.RPAREN);
  }
  else {
    node = new Node.Literal();
    if (this.eat(TT.BIT_AND)) {
      node.isPointer = true;
    }
    node.type = this.current.name;
    node.value = this.current.value;
    node.raw = this.current.value;
    this.next();
  }

  if (this.eat(TT.COLON)) {
    if (this.eat(TT.INOUT)) {
      node.isReference = true;
      this.back();
    }
    this.back();
    let tmp = this.parseStrictType();
    if (tmp.kind === Type.TypeAnnotation) {
      node.type = tmp;
    }
    else if (tmp.kind === Type.Literal) {
      node.init = tmp;
    } else {
      console.error("Fatal parse error");
    }
  }

  return (node);

}