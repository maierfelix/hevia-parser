import {
  Token,
  Types as Type,
  TokenList as TT,
  Operators as OP
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseClosureExpression() {

  let node = new Node.ClosureExpression();

  this.expect(TT.LBRACE);

  node.signature = this.parseExpressionStatement();

  // unparenthised comma seperated signature arguments
  if (this.eat(TT.COMMA)) {
    let tmp = this.parseCommaSeperatedValues();
    tmp.unshift(node);
    node = tmp;
  }

  this.eat(TT.IN);

  node.body = this.parseBlock();

  this.expect(TT.RBRACE);

  return (node);

}

/**
 * @param {Node}
 * @return {Node}
 */
export function parseFunctionExpression(node) {

  let tmp = new Node.FunctionExpression();
  tmp.type = this.parseTypeExpression();

  if (!(tmp.type instanceof Array)) {
    tmp.type = [tmp.type];
  }

  // validate non-array argument
  tmp.arguments = node instanceof Array ? node : node === null ? [] : [node];

  return (tmp);

}