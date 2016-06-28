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
  this.write("\n}\n");
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
      this.write("(");
      this.emitArguments(ast);
      this.write(")");
    break;
    case Type.TernaryExpression:
      this.emitTernary(ast);
    break;
    case Type.IfStatement:
      this.emitIf(ast);
    break;
    default:
      this.emitBinary(ast);
    break;
  };

}

export function emitIf(ast) {

  if (ast.condition) {
    this.write("if (");
    this.emitStatement(ast.condition);
    this.write(")");
  }
  this.emitBlock(ast.consequent);
  if (ast.alternate && ast.alternate.kind === Type.IfStatement) {
    this.write(" else ");
    this.emitStatement(ast.alternate);
  }

}

export function emitTernary(ast) {

  this.emitStatement(ast.condition);
  this.write("?");
  this.emitStatement(ast.consequent);
  this.write(":");
  this.emitStatement(ast.alternate);

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
  } else {
    this.emitStatement(ast.property);
  }

}

export function emitCall(ast) {

  this.emitStatement(ast.callee);

  this.write("(");
  this.emitArguments(ast.arguments);
  this.write(")");

}

export function emitArguments(ast) {

  let param = ast.arguments;

  let ii = 0;
  let length = param.length;

  for (; ii < length; ++ii) {
    this.emitStatement(param[ii]);
    if (ii + 1 < length) this.write(", ");
  };

}

export function emitDeclaration(ast) {

  switch (ast.kind) {
    case Type.FunctionDeclaration:
      this.emitFunction(ast, false);
    break;
    case Type.ExtensionDeclaration:
      this.emitExtension(ast);
    break;
    case Type.VariableDeclaration:
      this.emitVariableDeclaration(ast);
    break;
  }

}

export function emitExtension(ast) {

  this.write("class ");

  this.write("__");

  this.emitLiteral(ast.argument);

  this.write(" {\n");

  for (let node of ast.body.body) {
    if (node.kind === Type.FunctionDeclaration) {
      node.isStatic = true;
      this.emitFunction(node, false, true);
    }
  };

  this.write("}");

}

export function emitVariableDeclaration(ast, noKeyword) {

  if (!noKeyword) {
    this.write(getNameByLabel(ast.symbol).toLowerCase() + " ");
  }

  let index = 0;
  for (let node of ast.declarations) {
    this.emitVariable(node, ast.init[index] || ast.init);
    index++;
  };

}

export function emitVariable(ast, init) {

  this.write(ast.name);
  this.write(" = ");

  this.type = getLabelByNumber(ast.type.type);

  if (ast.isLaterPointer) this.write("{\nvalue: ");

  this.emitStatement(init);

  if (ast.isLaterPointer) this.write("\n}");

}

export function emitBinary(ast) {

  if (ast.kind === Type.BinaryExpression) {
    let op = getLabelByNumber(ast.operator);
    /** Custom operator call */
    if (op in this.operators) {
      this.emitCustomOperator(ast, op);
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

export function emitCustomOperator(ast, op) {

  this.write(`__OP["${op}"]`);
  this.write("(");
  this.emitStatement(ast.left);
  this.write(", ");
  this.emitStatement(ast.right);
  this.write(")");

}

export function emitLiteral(ast) {

  if (ast.isGlobal) {
    this.write("__global.");
  }

  let name = this.isPureType(ast) ? getNameByLabel(ast.type) : ast.value || ast.name;

  let resolve = this.scope.get(ast.value);

  if (this.isPureType(ast)) {
    if (ast.type === TT.SELF) {
      this.write("this");
    } else {
      this.write(getLabelByNumber(TT[name]));
    }
  } else {
    this.write(ast.value || ast.name);
  }

  if (resolve && resolve.isLaterPointer) {
    if (ast.isPointer === void 0) {
      this.write(".value");
    }
  } else {
    resolve = this.scope.get(ast.value);
    if (!ast.isReference && resolve && resolve.isReference) {
      this.write(".value");
    }
  }

}

export function emitFunction(ast, allowOP, noKeyword) {

  if (!allowOP && ast.name in this.operators) {
    return void 0;
  }

  this.scope = ast.context;

  if (!noKeyword) {
    this.write("function ");
  }

  if (ast.isStatic) {
    this.write("static ");
  }

  if (!allowOP) {
    this.write(ast.name);
  }

  this.write("(");
  this.emitArguments(ast.arguments);
  this.write(")");

  this.emitBlock(ast.body);

  this.popScope();

}

export function emitReturn(ast) {

  this.write("return ");

  this.emitStatement(ast.argument);

}