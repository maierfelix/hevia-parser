import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel
} from "../../utils";

import {
  FUNC_DEFAULT_TYPE
} from "../../const";

/**
 * @return {Node}
 */
export function parseFunction() {

  let node = new Node.FunctionDeclaration();

  // Optional, so dont expect
  this.eat(TT.FUNCTION);

  node.name = this.parseLiteralHead();

  if (this.peek(TT.LT)) {
    node.generic = this.parseGeneric();
  }

  node.arguments = this.parseArguments();

  if (this.peek(TT.ARROW)) {
    node.type = this.parseType().type;
  }
  else {
    node.type = this.parseFakeLiteral(FUNC_DEFAULT_TYPE);
  }

  if (this.eat(TT.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(TT.RBRACE);
  }

  return (node);

}