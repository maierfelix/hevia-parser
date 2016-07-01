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
export function parseAtom() {

  let node = this.parseLiteral();

  while (true) {
    if (this.peek(TT.CONDITIONAL)) {
      node = this.parseTernaryExpression(node);
    }
    /** Member expression */
    else if (
      this.peek(TT.LBRACK) ||
      this.peek(TT.PERIOD)
    ) {
      node = this.parseMemberExpression(node);
    }
    /** Type casting */
    else if (
      this.peek(TT.AS) ||
      this.peek(TT.IS)
    ) {
      node = this.parseCast(node);
    }
    else if (this.peek(TT.LPAREN)) {
      node = this.parseCallExpression(node);
    } else {
      break;
    }
  };

  return (node);

}

/**
 * @return {Node}
 */
export function parseMemberExpression(base) {

  let node = new Node.MemberExpression();

  node.isComputed = this.peek(TT.LBRACK);

  this.next();

  node.object = base;
  node.property = this.parseAtom();

  if (node.isComputed) {
    this.expect(TT.RBRACK);
  }

  return (node);

}

/**
 * @return {Node}
 */
export function parseCallExpression(base) {

  let node = new Node.CallExpression();

  node.callee = base;
  node.arguments = this.parseArguments();

  return (node);

}

/**
 * @return {Node}
 */
export function parseTernaryExpression(base) {

  let node  = new Node.TernaryExpression();

  this.inTernary = true;

  node.condition = base;

  this.expect(TT.CONDITIONAL);
  node.consequent = this.parseExpressionStatement();
  this.expect(TT.COLON);
  node.alternate = this.parseExpressionStatement();

  this.inTernary = false;

  return (node);

}