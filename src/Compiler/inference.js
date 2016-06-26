import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel,
  getNumericType
} from "../utils";

export function inferenceBlock(node) {

  let type = null;

  for (let key of node.body) {
    if (key.kind === Type.ReturnStatement) {
      type = this.inferenceExpression(key.argument);
    }
  };

  return (type);

}

export function inferenceExpression(node) {

  switch (node.kind) {
    case Type.BinaryExpression:
      return this.inferenceBinaryExpression(node);
    break;
    case Type.CallExpression:
      return this.inferenceCallExpression(node);
    break;
    case Type.MemberExpression:
      return this.inferenceMemberExpression(node);
    break;
  };

}

export function inferenceMemberExpression(node) {

  let left = this.inferenceExpression(node.object);
  let right = this.inferenceExpression(node.property);

  return (left || right);

}

export function inferenceCallExpression(node) {

  let type = this.inferenceIdentifier(node.callee);

  return (type);

}

export function inferenceBinaryExpression(node) {

  if (node.left && node.right) {
    let left = this.inferenceBinaryExpression(node.left);
    let right = this.inferenceBinaryExpression(node.right);
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

export function inferenceIdentifier(node) {

  let resolved = this.scope.get(node.value);

  if (resolved) {
    return (
      resolved.type.name || resolved.type.type
    );
  } else {
    this.globalCheck(node);
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