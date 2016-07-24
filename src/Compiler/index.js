import {
  inherit
} from "../utils";

import Scope from "../scope";

import * as pack from "./lang";
import * as inference from "./inference";

import * as compile from "./compile";
import * as statement from "./compile/statement";
import * as expression from "./compile/expression";
import * as declaration from "./compile/declaration";

/**
 * @class Compiler
 * @export
 */
export default class Compiler {

  /** @constructor */
  constructor() {

    /**
     * Scope
     * @type {Scope}
     */
    this.scope = void 0;

    /**
     * Extensions
     * @type {Object}
     */
    this.extensions = {};

    /**
     * Operators
     * @type {Object}
     */
    this.operators = {};

    /**
     * Compiled output
     * @type {String}
     */
    this.output = "";

    /**
     * Last processed node
     * @type {Node}
     */
    this.last = null;

    /**
     * Compilation settings
     * @type {Object}
     */
    this.settings = {
      /**
       * Global ctx =^ window, so
       * things like Math.pow work
       * @type {Boolean}
       */
      BIND_JS_CTX: false
    };

  }

  reset() {
    this.output = "";
  }

  /** 
   * Write
   * @param {String} str
   */
  write(str) {
    this.output += str;
  }

  /**
   * Enter scope
   * @param {Node} node
   */
  pushScope(node) {
    node.context = new Scope(node, this.scope);
    this.scope = node.context;
  }

  /** Leave scope */
  popScope() {
    this.scope = this.scope.parent;
  }

  /**
   * Literal contains type only
   * @param  {Node}  ast
   * @return {Boolean}
   */
  isPureType(node) {
    return (
      node.value === void 0 &&
      node.raw === void 0 &&
      node.type >= 0 ||
      node.type <= 0
    );
  }

  /**
   * @param {Node} ast
   * @param {String} lang
   * @return {String}
   */
  compile(ast, lang) {
    // Save default settings
    let bckp = JSON.stringify(this.settings);
    this.reset();
    this.pushScope(ast.body);
    this.compileProgram(ast.body);
    this.initLanguage(lang);
    this.emitProgram(ast.body);
    // Restore default settings
    this.settings = JSON.parse(bckp);
    return (this.output);
  }

  /**
   * @param {String} lang
   */
  initLanguage(lang) {

    let lng = void 0;

    switch (lang) {
      case "JS":
        lng = "JavaScript";
        for (let key in pack.JavaScript) {
          inherit(Compiler, pack.JavaScript[key]);
        };
      break;
      case "JAVA":
        lng = "Java";
        inherit(Compiler, pack.Java);
      break;
      default:
        console.error(`Unknown target language.`);
      break;
    }

    //console.log(`Compiling to ${lng}`);

  }

  /**
   * Check if the passed in string
   * can be used as a variable head
   * @param {String} str
   * @return {Boolean}
   */
  validName(str) {
    if (typeof str !== "string") return (false);
    try {
      new Function("var " + str)();
    } catch (e) {
      return (false);
    }
    return (true);
  }

  /**
   * @param {String} str
   * @return {Boolean}
   */
  isJSOperator(str) {
    switch (type) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "%":
      case "=":
      case "+=":
      case "-=":
      case "*=":
      case "/=":
      case "%=":
      case "===":
      case "!==":
      case "==":
      case "!=":
      case ">":
      case "<":
      case ">=":
      case "<=":
        return (true);
      break;
    };
    return (false);
  }

}

inherit(Compiler, inference);

inherit(Compiler, compile);
inherit(Compiler, statement);
inherit(Compiler, expression);
inherit(Compiler, declaration);