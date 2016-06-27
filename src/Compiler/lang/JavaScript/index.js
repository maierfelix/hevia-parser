import {
  Token,
  Types as Type,
  TokenList as TT
} from "../../../labels";

import Node from "../../../nodes";

import {
  getNameByLabel,
  getLabelByNumber
} from "../../../utils";

export function emitProgram(ast) {
  this.write(`"use strict";\n`);
  this.emitOperatorDefinitions();
  for (let node of ast.body) {
    this.emitStatement(node);
    this.write("\n");
  };
  this.write("\n");
}

export function emitStartHeader() {
  this.write("(function(__global) {\n");
}

export function emitEndHeader() {
  this.write("})(hevia.global)\n");
}

export function emitOperatorDefinitions() {

  if (!Object.keys(this.operators).length) return void 0;

  this.write("var __OP = {\n");

  for (let key in this.operators) {
    this.write(`"${key}"`);
    this.write(":");
    this.emitFunction(this.operators[key].func, true);
  };

  this.write("\n}");

}

export function emitBlock(ast) {
  this.write(" {");
  for (let node of ast.body) {
    this.write("\n");
    this.emitStatement(node);
    this.write(";");
  };
  this.write("\n}");
}

export function emitStatement(ast) {

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
      this.emitReturn(ast);
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
      this.emitDeclaration(ast);
    break;
    case Type.CallExpression:
      this.emitCall(ast);
    break;
    case Type.BinaryExpression:
      this.emitBinary(ast);
    break;
    case Type.MemberExpression:
      this.emitMember(ast);
    break;
    case Type.Parameter:
      this.emitParameter(ast);
    break;
    case Type.ParameterExpression:
      this.emitArguments(ast);
    break;
    default:
      this.emitBinary(ast);
    break;
  };

}

export function emitParameter(ast) {
  /** Labeled call parameter */
  if (ast.init.init !== void 0) {
    this.emitStatement(ast.init.init);
  } else {
    this.emitStatement(ast.init);
  }
}

export function emitMember(ast) {

  if (ast.object.kind === Type.Literal) {
    this.emitLiteral(ast.object);
  } else {
    this.emitStatement(ast.object);
  }

  this.write(".");

  if (ast.property.kind === Type.Literal) {
    this.emitLiteral(ast.property);
  }

}

export function emitDeclaration(ast) {

  switch (ast.kind) {
    case Type.FunctionDeclaration:
      this.emitFunction(ast, false);
    break;
    case Type.ExtensionDeclaration:
      //console.log(ast);
    break;
    case Type.VariableDeclaration:
      this.emitVariableDeclaration(ast);
    break;
  }

}

export function emitVariableDeclaration(ast) {

  this.write(getNameByLabel(ast.symbol).toLowerCase() + " ");

  let index = 0;
  for (let node of ast.declarations) {
    this.emitVariable(node, ast.init[index] || ast.init);
    index++;
  };

}

export function emitVariable(ast, init) {

  this.write(ast.name);
  this.write(" = ");

  this.emitStatement(init);

}

export function emitBinary(ast) {

  if (ast.kind === Type.BinaryExpression) {
    let op = getLabelByNumber(ast.operator);
    /** Custom operator call */
    if (op in this.operators) {
      this.write(`__OP["${op}"]`);
      this.write("(");
      this.emitStatement(ast.left);
      this.write(", ");
      this.emitStatement(ast.right);
      this.write(")");
    /** Default binary expr */
    } else {
      this.emitStatement(ast.left);
      op = op === "==" ? "===" : op === "!=" ? "!==" : op;
      this.write(` ${op} `);
      this.emitStatement(ast.right);
    }
  }
  else if (ast.kind === Type.Literal) {
    this.emitLiteral(ast);
  }

}

export function emitLiteral(ast) {

  if (ast.isGlobal) {
    this.write("__global.");
  }

  this.write(ast.value);

}

export function emitCall(ast) {

  this.emitStatement(ast.callee);

  this.emitArguments(ast.arguments);

}

export function emitFunction(ast, allowOP) {

  if (!allowOP && ast.name in this.operators) {
    return void 0;
  }

  this.write("function ");

  if (!allowOP) {
    this.write(ast.name);
  }

  this.emitArguments(ast.arguments);

  this.emitBlock(ast.body);

}

export function emitReturn(ast) {

  this.write("return ");

  this.emitStatement(ast.argument);

}

export function emitArguments(ast) {

  let param = ast.arguments;

  let ii = 0;
  let length = param.length;

  this.write("(");

  for (; ii < length; ++ii) {
    this.emitStatement(param[ii]);
    if (ii + 1 < length) this.write(", ");
  };

  this.write(")");

}