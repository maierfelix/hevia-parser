import {
  TOKEN
} from "../Tokenize/tokens";

import { Types } from "../Parse/nodes";

/**
 * Compiler
 * @class Compiler
 * @export
 */
export default class Compiler {

  /**
   * @constructor
   */
  constructor() {
    this.output = "";
    this.scope = null;
  }

  reset() {
    this.output = "";
  }

  write(str) {
    this.output += str;
  }

  /**
   * Enter new scope
   * @param {Scope} scope
   */
  pushScope(scope) {
    this.scope = scope;
  }

  /** Enter previous scope */
  popScope() {
    this.scope = this.scope.parent;
  }

  /**
   * Compile binexp
   * @param {Node} ast
   */
  compileBinaryExpression(ast) {

    if (ast.kind === Types.BinaryExpression) {
      this.write("(");
      this.compileStatement(ast.left);
      this.write(this.compileOperand(ast.operator));
      this.compileStatement(ast.right);
      this.write(")");
    } else {
      this.compileStatement(ast);
    }

  }

  /**
   * Compile operand
   * @param  {Number} op
   * @return {String}
   */
  compileOperand(op) {

    switch (op) {
      case TOKEN["*"]:
        return ("*");
      break;
      case TOKEN["/"]:
        return ("/");
      break;
      case TOKEN["+"]:
        return ("+");
      break;
      case TOKEN["-"]:
        return ("-");
      break;
      case TOKEN[">"]:
        return (">");
      break;
      case TOKEN["<"]:
        return ("<");
      break;
      case TOKEN["="]:
        return ("=");
      break;
      case TOKEN["%"]:
        return ("%");
      break;
      case TOKEN["=="]:
        return ("==");
      break;
      case TOKEN["."]:
        return (".");
      break;
      default:
        console.error("Unknown operand:", op);
    };

  }

}