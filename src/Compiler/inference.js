import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel,
  getLabelByNumber,
  getNumericType
} from "../utils";

export function inferenceBlock(node) {

  let type = null;

  for (let key of node.body) {
    if (key.kind === Type.ReturnStatement) {
      type = this.inferenceExpression(key.argument);
    }
    else {
      type = this.inferenceExpression(key);
    }
  };

  return (type);

}

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
      this.inferenceParameterExpression(node);
    break;
    case Type.Parameter:
      this.inferenceExpression(node.init);
    break;
  };

}

export function inferenceParameterExpression(node) {

  for (let key of node.arguments) {
    this.inferenceExpression(key);
  };

}

export function inferenceMemberExpression(node) {

  let left = this.inferenceExpression(node.object);
  let right = this.inferenceExpression(node.property);

  return (left || right);

}

export function inferenceCallExpression(node) {

  let type = this.inferenceExpression(node.callee);

  this.inferenceExpression(node.arguments);

  return (type);

}

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

export function inferenceLiteral(node) {

  let resolved = this.scope.get(node.value);

  if (node.isPointer) {
    if (resolved && resolved.kind === Type.VariableDeclarement) {
      resolved.isLaterPointer = true;
    } else {
      throw new Error(`Can't resolve ${node.value} declarement!`);
    }
  }

  if (resolved && resolved.type) {
    return (
      resolved.type.name || resolved.type.type
    );
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