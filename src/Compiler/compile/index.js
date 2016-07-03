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
    /** Loop statement */
    case Type.ForStatement:
    case Type.WhileStatement:
    case Type.RepeatStatement:
      //console.log(node);
    break;
    /** Branch statement */
    case Type.IfStatement:
    case Type.GuardStatement:
    case Type.SwitchStatement:
    case Type.PseudoProperty:
      //console.log(node);
    break;
    /** Defer statement */
    case Type.DeferStatement:
      //console.log(node);
    break;
    /** Return statement */
    case Type.ReturnStatement:
      //console.log(node);
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
    /** Expression statement */
    default:
      //console.log(node);
    break;
  };

}