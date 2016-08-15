import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  isLiteral,
  getNameByLabel
} from "../../utils";

/**
 * @return {Node}
 */
export function parseExpressionStatement() {

  let node = null;

  switch (this.current.name) {
    /** Array */
    case TT.LBRACK:
      node = this.parseAtom(this.parseArrayExpression());
    break;
    default:
      /** Closure */
      if (!this.inCondition && this.peek(TT.LBRACE)) {
        node = this.parseBinaryExpression(0);
      }
      else if (
        this.isOperator(this.current.name) ||
        isLiteral(this.current.name)
      ) {
        node = this.parseBinaryExpression(0);
      }
    break;
  };

  if (this.eat(TT.ARROW)) {
    node = this.parseFunctionExpression(node);
  }

  /**
   * Trailing closure
   * Don't trail if inside
   * undparenthised condition
   */
  else if (!this.inCondition && this.peek(TT.LBRACE)) {
    // Only parse as trailing, if brace opens in same code line
    if (this.current.loc.start.line === this.previous.loc.start.line) {
      let tmp = this.parseClosureExpression();
      tmp.callee = node;
      node = tmp;
    }
  }

  if (this.peek(TT.CONDITIONAL) && this.current.isTernary) {
    node = this.parseTernaryExpression(node);
  }

  return (node);

}