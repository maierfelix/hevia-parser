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
  [x] tuple
  [x] type
*/
export function parseStrictType(base) {

  let node = new Node.Parameter();

  if (this.eat(TT.COLON)) {
    this.eat(TT.INOUT);
    node.init = base;
    if (this.isNativeType(this.current.name)) {
      node.argument = this.parseType();
    } else {
      node.argument = this.parseExpressionStatement();
    }
  }
  else if (this.eat(TT.ARROW)) {
    if (this.peek(TT.LPAREN)) {
      node = this.parseExpressionStatement();
    } else {
      node = this.parseType();
    }
  }

  return (node);

}

export function parseType() {

  let node = new Node.TypeAnnotation();

  node.type = this.current.name;

  this.next();

  node.isOptional = this.eat(TT.CONDITIONAL);

  return (node);

}

/**
 * @param  {Number}  type
 * @return {Boolean}
 */
export function isNativeType(type) {
  switch (type) {
    case TT.VOID:
    case TT.INT:
    case TT.INT8:
    case TT.UINT8:
    case TT.INT32:
    case TT.INT64:
    case TT.UINT64:
    case TT.DOUBLE:
    case TT.FLOAT:
    case TT.BOOLEAN:
    case TT.STRING:
    case TT.CHARACTER:
      return (true);
    break;
    default:
      return (false);
    break;
  };
}