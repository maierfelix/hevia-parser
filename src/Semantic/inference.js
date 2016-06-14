import {
  TOKEN
} from "../Tokenize/tokens";

import Node from "../Parse/nodes";
import { Types } from "../Parse/nodes";

export function inferenceType(ast) {

  if (ast.init.kind === Types.Literal) {
    ast.type.type = ast.init.type.type;
    return void 0;
  } else {
    ast.type.type = this.inference(ast.init);
  }

}

export function inference(ast) {

  switch (ast.kind) {
    case Types.IfStatement:
      return "Bool";
    break;
    case Types.CallExpression:
      return this.inferenceCallExpression(ast);
    break;
    case Types.MemberExpression:
      return this.inferenceLRExpression(ast);
    break;
    case Types.Literal:
    case Types.Parameter:
    case Types.Identifier:
      return ast.type.type;
    break;
    case Types.BinaryExpression:
      this.inferenceLRExpression(ast);
    break;
  };

}

export function inferenceCallExpression(ast) {
  return (this.scope.get(ast.callee.name).type.type);
}

export function inferenceLRExpression(ast) {

  if (ast.left) {
    return (this.inference(ast.left));
  }
  if (ast.right) {
    return (this.inference(ast.right));
  }

}