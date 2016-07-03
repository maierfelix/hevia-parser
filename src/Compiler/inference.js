import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel,
  getLabelByNumber,
  getNumericType,
  isBoolean
} from "../utils";

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceBlock(node) {

  let type = null;

  for (let key of node.body) {
    type = this.inferenceExpression(key);
  };

  return (type);

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceExpression(node) {

  switch (node.kind) {
    case Type.Literal:
      return this.inferenceLiteral(node);
    break;
    case Type.BinaryExpression:
      return this.inferenceBinaryExpression(node);
    break;
    case Type.CallExpression:
      return this.inferenceCallExpression(node);
    break;
    case Type.MemberExpression:
      return this.inferenceMemberExpression(node);
    break;
    case Type.ParameterExpression:
      return this.inferenceParameterExpression(node);
    break;
    case Type.TernaryExpression:
      return this.inferenceTernaryExpression(node);
    break;
    case Type.Parameter:
      return this.inferenceExpression(node.init);
    break;
    case Type.ReturnStatement:
      return this.inferenceExpression(node.argument);
    break;
  };

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceTernaryExpression(node) {

  let consequent = this.inferenceExpression(node.consequent);
  let alternate = this.inferenceExpression(node.alternate);

  if (consequent !== alternate) {
    let a = getNameByLabel(consequent);
    let b = getNameByLabel(alternate);
    throw new Error(`Ternary expression has mismatching types ${a} and ${b}`);
  }

  return (consequent || alternate);

}

/**
 * @param {Node} node
 */
export function inferenceParameterExpression(node) {

  for (let key of node.arguments) {
    this.inferenceExpression(key);
  };

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceMemberExpression(node) {

  let left = this.inferenceExpression(node.object);
  let right = this.inferenceExpression(node.property);

  return (left || right);

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceCallExpression(node) {

  let type = this.inferenceExpression(node.callee);

  this.inferenceExpression(node.arguments);

  return (type);

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceBinaryExpression(node) {

  if (node.left && node.right) {
    let left = this.inferenceExpression(node.left);
    let right = this.inferenceExpression(node.right);
    return (left || right);
  } else {
    if (node.kind === Type.Literal) {
      if (node.type === Token.NumericLiteral) {
        return (
          TT[getNumericType(Number(node.raw))]
        );
      }
      if (node.type === Token.Identifier) {
        return (
          this.inferenceExpression(node)
        );
      }
    }
    return (node);
  }

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceLiteral(node) {

  if (isBoolean(node)) {
    return (TT.BOOLEAN);
  }

  let resolved = this.scope.get(node.value);

  if (node.isPointer) {
    if (resolved && resolved.kind === Type.VariableDeclarement) {
      resolved.isLaterPointer = true;
    } else {
      throw new Error(`Can't resolve ${node.value} declarement!`);
    }
  }

  if (resolved && resolved.type) {
    return (resolved.type);
  } else {
    this.globalCheck(node);
    return (TT[getNumericType(Number(node.raw))]);
  }

}

export function globalCheck(node) {

  if (node.kind === Type.MemberExpression) {
    if (this.global.hasOwnProperty(node.object.value)) {
      node.object.isGlobal = true;
    }
  }
  else if (node.kind === Type.Literal) {
    if (this.global.hasOwnProperty(node.value)) {
      node.isGlobal = true;
    }
  }

}