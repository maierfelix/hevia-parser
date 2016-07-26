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
    /** Closure */
    case TT.LBRACE:
      node = this.parseBinaryExpression(0);
    break;
    default:
      if (
        this.isOperator(this.current.name) ||
        isLiteral(this.current.name)
      ) {
        node = this.parseBinaryExpression(0);
      }
    break;
  };

  if (this.eat(TT.ARROW)) {
    let tmp = new Node.FunctionExpression();
    tmp.type = this.parseTypeExpression();
    if (!(tmp.type instanceof Array)) {
      tmp.type = [tmp.type];
    }
    // validate non-array argument
    tmp.arguments = node instanceof Array ? node : [node];
    node = tmp;
  }

  /**
   * Trailing closure
   * Don't trail if inside
   * undparenthised condition
   */
  else if (!this.inCondition && this.peek(TT.LBRACE)) {
    // Only parse as trailing, if lbrace is inside same code line
    if (this.current.loc.start.line === this.previous.loc.start.line) {
      let tmp = this.parseClosureExpression();
      tmp.callee = node;
      node = tmp;
    }
  }

  /** Ternary or optional */
  else if (this.peek(TT.CONDITIONAL)) {
    if (this.current.isTernary) {
      node = this.parseTernaryExpression(node);
    }
  }

  return (node);

}