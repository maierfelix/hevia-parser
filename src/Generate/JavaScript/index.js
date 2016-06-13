import { parseString } from "../../utils";

import Compiler from "../../Generate";

import {
  TOKEN
} from "../../Tokenize/tokens";

import { Types } from "../../Parse/nodes";

/**
 * JavaScript
 * @class JavaScript
 * @export
 */
export default class JavaScript extends Compiler {

  /**
   * @constructor
   */
  constructor() {

    super(null);

    this.export = "_export";
    this.global = "_global";
    this.runtime = "_runtime";

  }

  run(compiled) {

    let exports = {};
    let code = new Function("global", "exports", compiled);

    code({}, exports);

  }

  /**
   * Compile ast
   * @param  {Program} ast
   * @return {String}
   */
  compile(ast) {

    this.reset();

    this.emitStartHeader();

    this.pushScope(ast.context);

    this.compileBlock(ast.body.body);

    this.emitEndHeader();

    this.scope = ast.context;

    return (this.output);

  }

  emitStartHeader() {
    this.write("(() => {\n");
    this.write("let swift = new Swiftly();");
    this.write("((_global, _export, _runtime) => {\n");
  }

  emitEndHeader() {
    this.write("})(\n");
    this.write("swift.runtime.global,\n");
    this.write("typeof exports !== 'undefined' ? exports : this,\n");
    this.write("swift.runtime\n");
    this.write(");\n");
    this.write("})();\n");
  }

  compileBlock(ast) {

    for (let node of ast) {
      if (node.kind === Types.Statement) {
        this.compileStatement(node);
        this.write(";");
      }
    };

  }

  compileStatement(ast) {

    let body = ast.body || ast;

    switch (body.kind) {
      case Types.ImportStatement:
        this.compileImport(body);
      break;
      case Types.VariableDeclaration:
        this.compileVariableDeclaration(body);
      break;
      case Types.MultipleVariableDeclaration:
        this.compileMultipleVariableDeclaration(body);
      break;
      case Types.IfStatement:
        this.compileIfStatement(body);
      break;
      case Types.FunctionDeclaration:
        this.compileFunctionDeclaration(ast);
      break;
      case Types.ReturnStatement:
        this.compileReturnStatement(body);
      break;
      case Types.Enumeration:
        this.compileEnumeration(ast);
      break;
      case Types.CallExpression:
        this.compileCallExpression(body);
      break;
      case Types.MemberExpression:
        this.compileMemberExpression(body);
      break;
      case Types.Literal:
      case Types.Parameter:
      case Types.Identifier:
        this.write(this.compileIdentifier(body));
      break;
      default:
        this.compileBinaryExpression(body);
      break;
    };

  }

  /**
   * Compile identifier
   * @param  {Node} ast
   * @param  {Boolean} isMember
   * @return {String}
   */
  compileIdentifier(ast, isMember) {

    let parent = null;

    if (ast.isGlobal && !isMember) {
      this.write(this.global);
      this.write(".");
    }

    if (ast.kind === Types.Identifier) {
      if ((parent = this.scope.get(ast.name, this.scope))) {
        /** Declared as pointer */
        if (ast.isPointer) {
          return (ast.name);
        }
        /** Check if parent is a inout reference */
        if (parent.kind === Types.Parameter) {
          /** Parent is a reference */
          if (!ast.isPointer && parent.reference) {
            return (`${ast.name}.value`);
          }
        } else {
          if (parent.isReference) {
            if (isMember) {
              return (ast.name);
            }
            return (`${ast.name}.value`);
          }
        }
      }
    } else if (
      ast.kind === Types.Literal ||
      ast.kind === Types.Parameter
    ) {
      return (ast.value);
    }

    return (ast.name);

  }

  compileMemberExpression(ast) {

    this.compileStatement(ast.left);
    this.write(".");

    if (ast.right.kind === Types.MemberExpression) {
      this.compileMemberExpression(ast.right);
    } else {
      if (ast.right.kind === Types.Identifier) {
        this.write(this.compileIdentifier(ast.right, true));
      } else {
        this.compileStatement(ast.right);
      }
    }

  }

  compileCallExpression(ast) {

    let param = ast.arguments;

    let ii = 0;
    let length = param.length;

    let name = null;

    this.write(this.compileIdentifier(ast.callee, false));
    this.write("(");

    for (; ii < length; ++ii) {
      name = param[ii].value;
      this.compileStatement(param[ii]);
      if (ii + 1 < length) {
        this.write(",");
      }
    };

    this.write(")");

  }

  compileEnumeration(ast) {

    let body = ast.body;
    let extern = ast.export;

    this.write(`var ${body.name} = `);

    this.write(`new ${this.runtime}.Enumeration(`);
    this.compileEnumerationBody(body);
    this.write(")\n");

  }

  compileEnumerationBody(body) {

    let ii = 0;
    let length = body.body.length;

    let node = null;

    if (body.type !== void 0) {
      this.write(`"${body.type.type}",`);
    } else {
      this.write(`"auto",`);
    }

    this.write("[");
    for (; ii < length; ++ii) {
      node = body.body[ii];
      this.write("{");
      this.write(`name: "${node.value}"`);
      if (node.argument !== null) {
        this.write(`,value: ${node.argument.value}`);
      }
      this.write("}");
      if (ii + 1 < length) {
        this.write(",");
      }
    };
    this.write("]");

  }

  compileReturnStatement(ast) {

    if (ast.argument) {
      this.write("return ");
      let scope = this.scope.getByType(Types.FunctionDeclaration);
      if (scope.returns.length) {
        this.write("({");
        let returns = scope.returns;
        let ii = 0;
        let length = returns.length;
        for (; ii < length; ++ii) {
          this.write(returns[ii].value);
          this.write(":");
          this.compileBinaryExpression(ast.argument[ii]);
          if (ii + 1 < length) {
            this.write(",");
          }
        };
        this.write("})");
      } else {
        this.compileBinaryExpression(ast.argument);
      }
    }

  }

  compileIfStatement(ast) {

    this.write("if (");
    this.compileBinaryExpression(ast.test);
    this.write(")");

    if (ast.consequent !== null) {
      this.write("{\n");
      this.pushScope(ast.context);
      this.compileBlock(ast.consequent.body);
      this.popScope();
      this.write("\n}\n");
    }

    if (ast.alternate !== null) {
      /** Else if */
      if (ast.alternate.kind === Types.Block) {
        this.write("else {\n");
        this.pushScope(ast.context);
        this.compileBlock(ast.alternate.body);
        this.popScope();
        this.write("}\n");
      /** Standalone else */
      } else {
        this.write("else ");
        this.compileIfStatement(ast.alternate);
      }
    }

  }

  compileFunctionDeclaration(ast) {

    let body = ast.body;
    let extern = ast.export;
    let name = body.name;

    this.write(`var ${name} = `);

    if (extern) {
      this.write(this.export);
      this.write(".");
      this.write(name);
      this.write(" = ");
    }

    this.pushScope(ast.body.context);
    this.write("(");
    this.compileParameters(body.param);
    this.write(")");
    this.write(" => {\n");
    this.compileBlock(body.body.body);
    this.popScope();
    this.write("\n}\n");

  }

  compileParameters(param) {

    let ii = 0;
    let length = param.length;

    for (; ii < length; ++ii) {
      this.compileBinaryExpression(param[ii]);
      if (ii + 1 < length) {
        this.write(",");
      }
    };

  }

  compileImport(ast) {

    if (ast.body.length < 0) return void 0;

    for (let key of ast.body) {
      if (key.kind === Types.Literal) {
        console.log(key);
      }
    };

  }

  compileVariableDeclaration(ast) {

    this.write(ast.isMutable ? "var" : "const");
    this.write(" ");
    this.write(ast.id);

    this.write(" = ");

    if (ast.init) {
      if (ast.isReference) {
        this.write("{\n");
        this.write("value:");
        this.compileBinaryExpression(ast.init);
        this.write("}\n");
      } else {
        if (ast.init.kind === Types.ArrayDeclaration) {
          this.compileArrayConstruction(ast.init);
        } else {
          this.compileBinaryExpression(ast.init);
          this.write(";");
        }
      }
    }

  }

  compileMultipleVariableDeclaration(ast) {

    let ii = 0;
    let length = ast.body.length;

    for (; ii < length; ++ii) {
      this.compileVariableDeclaration(ast.body[ii]);
    };

  }

  compileArrayConstruction(ast) {

    this.write(`new ${this.runtime}.ArrayConstructor(`);
    this.compileTupleExpression(ast.param);
    this.write(")\n");

  }

  compileTupleExpression(param) {

    let ii = 0;
    let length = param.length;

    let key = null;

    this.write("{");

    for (; ii < length; ++ii) {
      key = param[ii];
      this.write(key.name);
      this.write(":")
      this.compileBinaryExpression(key.init);
      if (ii + 1 < length) {
        this.write(",");
      }
    };

    this.write("}");

  }

}