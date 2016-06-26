import {
  Token,
  Types as Type,
  TokenList as TT
} from "../labels";

import Node from "../nodes";

import {
  getNameByLabel
} from "../utils";

export function compileProgram(ast) {
  this.compileBlock(ast);
}

export function compileBlock(ast) {

  this.pushScope(ast);

  for (let node of ast.body) {
    this.compileStatement(node);
  };

  this.popScope();

}

export function compileStatement(ast) {

  switch (ast.kind) {
    /** Loop statement */
    case Type.ForStatement:
    case Type.WhileStatement:
    case Type.RepeatStatement:
      console.log(ast);
    break;
    /** Branch statement */
    case Type.IfStatement:
    case Type.GuardStatement:
    case Type.SwitchStatement:
    case Type.PseudoProperty:
      console.log(ast);
    break;
    /** Defer statement */
    case Type.DeferStatement:
      console.log(ast);
    break;
    /** Return statement */
    case Type.ReturnStatement:
      console.log(ast);
    break;
    /** Do statement */
    case Type.DoStatement:
      console.log(ast);
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
      this.compileDeclaration(ast);
    break;
    /** Expression statement */
    default:
      this.compileExpressionStatement(ast);
    break;
  };

}

export function compileExpressionStatement(ast) {

  switch (ast.kind) {
    case Type.BinaryExpression:
      return this.inferenceExpression(ast);
    break;
    case Type.CallExpression:
      this.compileCallExpression(ast);
    break;
  };

}

export function compileDeclaration(ast) {

  switch (ast.kind) {
    case Type.ExtensionDeclaration:
      //console.log(ast);
    break;
    case Type.OperatorDeclaration:
      this.compileOperatorDeclaration(ast);
    break;
    case Type.FunctionDeclaration:
      this.compileFunctionDeclaration(ast);
    break;
    case Type.VariableDeclaration:
      this.compileVariableDeclaration(ast);
    break;
  }

}

export function compileCallExpression(ast) {

  this.inferenceIdentifier(ast.callee);

}

export function compileVariableDeclaration(ast) {

  let index = 0;
  for (let key of ast.declarations) {
    let init = ast.init[index] || ast.init;
    if (key.type.type === -1) {
      key.type.type = this.inferenceExpression(init);
    } else {
      this.inferenceExpression(init);
    }
    this.scope.register(key);
    index++;
  };

}

export function compileFunctionDeclaration(ast) {

  if (ast.name in this.operators) {
    /** Can be overridden */
    this.operators[ast.name].func = ast;
    this.inferenceBlock(ast.body);
  } else {
    this.scope.register(ast);
  }

}

export function compileOperatorDeclaration(ast) {

  let op = ast.operator.raw;
  let lvl = -1;
  let assoc = null;

  for (let node of ast.body.body) {
    if (node.kind === Type.AssociativityExpression) {
      assoc = node.associativity.raw;
    }
    if (node.kind === Type.PrecedenceExpression) {
      lvl = Number(node.level.raw);
    }
  };

  this.operators[op] = {
    name: ast.name,
    level: lvl,
    associativity: assoc,
    func: null
  };

}