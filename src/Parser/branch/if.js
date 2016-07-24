import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

/**
 * @return {Node}
 */
export function parseIfStatement() {

  let node = new Node.IfStatement();

  if (this.eat(TT.IF)) {
    this.inIfCondition = true;
    this.eat(TT.LPAREN);
    node.condition = this.parseStatement();
    this.eat(TT.RPAREN);
    this.inIfCondition = false;
  }

  // Consequent
  this.expect(TT.LBRACE);
  node.consequent = this.parseBlock();
  this.expect(TT.RBRACE);

  // Alternate: else|else if
  if (this.eat(TT.ELSE)) {
    node.alternate = this.parseIfStatement();
  }

  return (node);

}