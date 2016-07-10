import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../labels";

import Node from "../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../utils";

/**
 * @param {Node} node
 */
export function compileProgram(node) {
  this.pushScope(node);
  this.compileBlock(node);
  this.popScope();
}

/**
 * @param {Node} node
 */
export function compileBlock(node) {

  for (let key of node.body) {
    this.compileStatement(key);
  };

}

/**
 * @param {Node} node
 */
export function compileStatement(node) {

  switch (node.kind) {
    /** Comment */
    case Type.Comment:
      this.compileComment(node);
    break;
    /** Loop statement */
    case Type.ForStatement:
    case Type.WhileStatement:
    case Type.RepeatStatement:
      //console.log(node);
    break;
    /** Branch statement */
    case Type.IfStatement:
      this.compileIfStatement(node);
    break;
    /** Defer statement */
    case Type.DeferStatement:
      //console.log(node);
    break;
    /** Return statement */
    case Type.ReturnStatement:
      this.compileStatement(node.argument);
    break;
    /** Do statement */
    case Type.DoStatement:
      //console.log(node);
    break;
    /** Declaration statement */
    case Type.ImportStatement:
    case Type.VariableDeclaration:
    case Type.FunctionDeclaration:
    case Type.EnumDeclaration:
    case Type.StructDeclaration:
    case Type.ClassDeclaration:
    case Type.ProtocolDeclaration:
    case Type.ExtensionDeclaration:
    case Type.OperatorDeclaration:
      this.compileDeclaration(node);
    break;
    case Type.CallExpression:
      this.compileExpression(node);
    break;
    case Type.MemberExpression:
      this.compileMemberExpression(node);
    break;
    /** Expression statement */
    default:
      //console.log(node);
    break;
  };

}

/**
 * @param {Node} node
 */
export function compileComment(node) {

  let arg = null;

  for (let key in node.arguments) {
    arg = node.arguments[key];
    if (arg in this.settings) {
      this.settings[arg] = true;
    }
  };

}