import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  isBoolean,
  getNameByLabel,
  getLabelByNumber,
  getNumericType
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

  let result = null;

  switch (node.kind) {
    case Type.Literal:
      result = this.inferenceLiteral(node);
    break;
    case Type.BinaryExpression:
      result = this.inferenceBinaryExpression(node);
    break;
    case Type.CallExpression:
      result = this.inferenceCallExpression(node);
    break;
    case Type.MemberExpression:
      result = this.inferenceMemberExpression(node);
    break;
    case Type.ParameterExpression:
      result = this.inferenceParameterExpression(node);
    break;
    case Type.TernaryExpression:
      result = this.inferenceTernaryExpression(node);
    break;
    case Type.Parameter:
      result = this.inferenceExpression(node.init);
    break;
    case Type.ReturnStatement:
      result = this.inferenceExpression(node.argument);
    break;
    default:
      // Tuple
      if (node instanceof Array) {
        result = Token.Tuple;
      }
    break;
  };

  this.last = node;

  return (result);

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

  return (consequent);

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

  return (right);

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceCallExpression(node) {

  let func = null;
  let type = null;

  // Resolve function type
  if (func = this.scope.getLocal(node.callee.raw)) {
    if (func.type.kind === Type.TypeAnnotation) {
      type = func.type.type;
    }
    // Returns tuple
    else if (func.type instanceof Array) {
      type = Token.Tuple;
    }
    else {
      throw new Error(`Function ${func.name} resolves invalid type!`);
    }
  } else {
    //console.error(node);
  }

  this.inferenceLiteral(node.callee);

  return (type);

}

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceBinaryExpression(node) {

  // Binary expression
  if (node.left && node.right) {
    let left = this.inferenceExpression(node.left);
    let right = this.inferenceExpression(node.right);
    return (left || right);
  }

  // Literal
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

/**
 * @param {Node} node
 * @return {Number}
 */
export function inferenceLiteral(node) {

  if (isBoolean(node)) {
    return (TT.BOOLEAN);
  }

  let resolved = this.scope.getLocal(node.value);

  if (node.isPointer) {
    if (resolved && resolved.kind === Type.VariableDeclaration) {
      resolved.isLaterPointer = true;
    } else {
      throw new Error(`Can't resolve ${node.value} declaration!`);
    }
  }

  if (resolved && resolved.type) {
    return (resolved.type);
  } else {
    return (TT[getNumericType(Number(node.raw))]);
  }

}