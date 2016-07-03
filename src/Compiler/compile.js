import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../utils";

export function compileProgram(node) {
  this.pushScope(node);
  this.compileBlock(node);
}

export function compileBlock(node) {

  for (let key of node.body) {
    this.compileStatement(key);
  };

}

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
      return this.compileVariableDeclaration(node);
    break;
    /** Expression statement */
    default:
      //console.log(node);
    break;
  };

}

export function compileVariableDeclaration(node) {

  let index = 0;

  let init = null;
  let label = null;

  for (let key of node.declarations) {
    label = key.kind === Type.Parameter ? key.init : key;
    init = node.init[index];
    this.scope.register(label);
    index++;
    if (key.kind !== Type.Parameter) {
      label.type = this.inferenceExpression(init);
    } else {
      label.type = key.argument.type;
    }
    //console.log(label, getNameByLabel(label.type));
  };

}