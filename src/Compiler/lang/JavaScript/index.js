import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../../labels";

import Node from "../../../nodes";

import {
  getNameByLabel,
  getLabelByNumber,
  getNumericType
} from "../../../utils";

/**
 * @param {Node} node
 */
export function emitProgram(node) {
  this.scope = node.context;
  this.write(`"use strict";\n`);
  for (let key of node.body) {
    this.emitStatement(key);
    this.write("\n");
  };
  this.write("\n");
}

/**
 * @param {Node} node
 */
export function emitBlock(node) {
  this.scope = node.context;
  this.write(" {");
  for (let key of node.body) {
    this.write("\n");
    this.emitStatement(key);
    this.write(";");
  };
  this.write("\n}\n");
}

/**
 * @param {Node} node
 */
export function emitStatement(node) {

  switch (node.kind) {
    /** Loop statement */
    case Type.ForStatement:
    case Type.WhileStatement:
    case Type.RepeatStatement:
      //console.log(node);
    break;
    /** Branch statement */
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
      this.emitReturn(node);
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
      this.emitDeclaration(node);
    break;
    case Type.CallExpression:
      this.emitCall(node);
    break;
    case Type.BinaryExpression:
      this.emitBinary(node);
    break;
    case Type.UnaryExpression:
      this.emitUnary(node);
    break;
    case Type.MemberExpression:
      this.emitMember(node);
    break;
    case Type.Parameter:
      this.emitParameter(node);
    break;
    case Type.ParameterExpression:
      this.write("(");
      this.emitArguments(node);
      this.write(")");
    break;
    case Type.TernaryExpression:
      this.emitTernary(node);
    break;
    case Type.IfStatement:
      this.emitIf(node);
    break;
    default:
      this.emitBinary(node);
    break;
  };

}

/**
 * @param {Node} node
 */
export function emitIf(node) {

  if (node.condition) {
    this.write("if (");
    this.emitStatement(node.condition);
    this.write(")");
  }
  this.emitBlock(node.consequent);
  if (node.alternate && node.alternate.kind === Type.IfStatement) {
    this.write(" else ");
    this.emitStatement(node.alternate);
  }

}