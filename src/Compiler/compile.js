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

export function compileProgram(ast) {
  this.compileBlock(ast);
}

export function compileBlock(ast) {

  for (let node of ast.body) {
    this.compileStatement(node);
  };

}

export function compileStatement(ast) {

  switch (ast.kind) {
    /** Loop statement */
    case Type.ForStatement:
    case Type.WhileStatement:
    case Type.RepeatStatement:
      //console.log(ast);
    break;
    /** Branch statement */
    case Type.IfStatement:
    case Type.GuardStatement:
    case Type.SwitchStatement:
    case Type.PseudoProperty:
      //console.log(ast);
    break;
    /** Defer statement */
    case Type.DeferStatement:
      //console.log(ast);
    break;
    /** Return statement */
    case Type.ReturnStatement:
      //console.log(ast);
    break;
    /** Do statement */
    case Type.DoStatement:
      //console.log(ast);
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
      return this.compileDeclaration(ast);
    break;
    /** Expression statement */
    default:
      return this.compileExpressionStatement(ast);
    break;
  };

}

export function compileExpressionStatement(ast) {

  switch (ast.kind) {
    case Type.BinaryExpression:
      return this.inferenceExpression(ast);
    break;
    case Type.CallExpression:
      return this.compileCallExpression(ast);
    break;
  };

}

export function compileDeclaration(ast) {

  switch (ast.kind) {
    case Type.ExtensionDeclaration:
      return this.compileExtensionDeclaration(ast);
    break;
    case Type.OperatorDeclaration:
      return this.compileOperatorDeclaration(ast);
    break;
    case Type.FunctionDeclaration:
      return this.compileFunctionDeclaration(ast);
    break;
    case Type.VariableDeclaration:
      return this.compileVariableDeclaration(ast);
    break;
  }

}

export function compileExtensionDeclaration(ast) {

  let name = null;

  if (this.isPureType(ast.argument)) {
    name = getLabelByNumber(ast.argument.type);
  } else {
    name = ast.argument.value;
  }

  this.extensions[name] = ast.body;

  this.compileBlock(ast.body);

}

export function compileCallExpression(ast) {

  return this.inferenceExpression(ast);

}

export function compileVariableDeclaration(ast) {

  let index = 0;

  for (let key of ast.declarations) {
    let init = ast.init[index] || ast.init;
    if (key.type.type === -1) {
      key.type.type = this.compileStatement(init);
    }
    this.scope.register(key);
    index++;
  };

}

export function compileFunctionDeclaration(ast) {

  if (ast.name in this.operators) {
    /** Can be overridden */
    this.operators[ast.name].func = ast;
  } else {
    this.scope.register(ast);
  }

  this.pushScope(ast, this.scope);

  this.compileArguments(ast.arguments);
  this.compileBlock(ast.body);
  this.inferenceBlock(ast.body);

  this.popScope();

}

export function compileArguments(node) {

  for (let key of node.arguments) {
    this.scope.register(key.init);
  };

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