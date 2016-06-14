import { inherit, uHash } from "../utils";
import { TOKEN } from "../Tokenize/tokens";

import Node from "./nodes";
import { Types } from "./nodes";

import Scope from "./scope";

import * as expr from "./expression";

/**
 * Parser
 * @class Parser
 * @export
 */
export default class Parser {

  /** @constructor */
  constructor() {

    /**
     * Node index
     * @type {Number}
     */
    this.index = 0;

    /**
     * Tokens
     * @type {Array}
     */
    this.tokens = [];

    /**
     * Previous token
     * @type {Object}
     */
    this.previous = null;

    /**
     * Current token
     * @type {Object}
     */
    this.current = null;

    /**
     * Current scope
     * @type {Scope}
     */
    this.scope = null;

    /**
     * Scope list
     * @type {Object}
     */
    this.scopes = {};

    this.reset(this.tokens);

  }

  /**
   * Eat
   * @param  {Number} kind
   * @return {Boolean}
   */
  eat(kind) {
    if (this.peek(kind)) {
      this.next();
      return (true);
    }
    return (false);
  }

  /**
   * Peek
   * @param  {Number} kind
   * @return {Boolean}
   */
  peek(kind) {
    return (
      this.current !== void 0 &&
      this.current.kind === kind
    );
  }

  /**
   * Next token
   * @return {Boolean}
   */
  next() {
    if (this.index < this.tokens.length) {
      this.index++;
      this.previous = this.current;
      this.current = this.tokens[this.index];
      return (true);
    }
    return (false);
  }

  /**
   * Previous token
   * @return {Boolean}
   */
  back() {
    if (this.index < this.tokens.length) {
      this.index--;
      this.previous = this.current;
      this.current = this.tokens[this.index];
      return (true);
    }
    return (false);
  }

  /**
   * Expect token
   * @param  {Number} kind
   * @return {Boolean}
   */
  expect(kind) {
    if (!this.peek(kind)) {
      if (this.current !== void 0) {
        console.error(`Expected ${kind}`);
      }
      return (false);
    }
    this.next();
    return (true);
  }

  /**
   * Reset
   * @param {Array} tokens
   */
  reset(tokens) {
    this.index = 0;
    this.tokens = tokens;
    this.scopes = {};
    this.previous = this.current = this.tokens[this.index];
  }

  /**
   * Start parsing
   * @param  {Array} tokens
   * @return {Object}
   */
  parse(tokens) {

    let node = new Node.Program();

    this.reset(tokens);
    this.tokens = tokens;

    this.scope = void 0;
    this.pushScope(node);

    node.body = this.parseBlock();
    console.log(node);

    return (node);

  }

  /**
   * Enter new scope
   * @param {Node} node
   */
  pushScope(node) {
    node.context = new Scope(node, this.scope);
    this.scope = node.context;
    this.scopes[uHash()] = this.scope;
  }

  /** Enter previous scope */
  popScope() {
    this.scope = this.scope.parent;
  }

  parseBlock() {

    let node = new Node.Block();

    node.body = this.parseStatements();

    return (node);

  }

  parseIfStatement() {

    let node = new Node.IfStatement();

    if (!this.expect(TOKEN["if"]) && !this.expect(TOKEN["else"])) {
      return (null);
    }

    node.label = this.previous.value;

    this.eat(TOKEN["("]);
    node.test = this.parseExpression(0);
    this.eat(TOKEN[")"]);

    if (this.peek(TOKEN["{"])) {
      this.pushScope(node);
      node.consequent = this.parseBody();
      this.popScope();
    }
    if (this.eat(TOKEN["else"])) {
      if (this.peek(TOKEN["if"])) {
        node.alternate = this.parseIfStatement();
      }
      else if (this.peek(TOKEN["{"])) {
        this.pushScope(node);
        node.alternate = this.parseBody();
        this.popScope();
      }
    }

    return (node);

  }

  parseFunction() {

    let node = new Node.FunctionDeclaration();

    this.pushScope(node);

    if (!this.expect(TOKEN["func"])) {
      return (null);
    }
    if (this.expect(TOKEN["identifier"])) {
      node.name = this.previous.value;
    }
    if (this.expect(TOKEN["("])) {
      node.param = this.parseParameters(true);
      this.expect(TOKEN[")"]);
    }

    /** Function type */
    if (this.peek(TOKEN["->"])) {
      node.type = this.parseType("->");
      this.back();
      if (this.peek(TOKEN["("])) {
        this.next();
        node.returns = this.parseParameters(true);
        this.next();
      } else {
        /** Undo back turn */
        this.next();
      }
    } else {
      node.type = new Node.Type();
      node.type.type = "auto";
    }

    this.scope.parent.register(node);

    if (this.peek(TOKEN["{"])) {
      node.body = this.parseBody();
    }

    this.popScope();

    return (node);

  }

  /** Parse return statement */
  parseReturn() {

    let node = new Node.ReturnStatement();

    if (this.expect(TOKEN["return"])) {
      let scope = this.scope.getByType(Types.FunctionDeclaration);
      if (scope.returns.length) {
        if (this.peek(TOKEN["("])) {
          this.next();
          node.argument = this.parseExpressionParameters();
          this.eat(TOKEN[")"]);
        }
      } else {
        node.argument = this.parseExpression(0);
      }
    }

    this.eat(TOKEN[";"]);

    return (node);

  }

  /** Parse variable declaration */
  parseVariableDeclaration() {

    let node = null;
    let mutable = true;

    if (!this.peek(TOKEN["let"]) && !this.peek(TOKEN["var"])) {
      return (null);
    }

    mutable = this.peek(TOKEN["var"]);

    this.next();

    if (this.peek(TOKEN["identifier"])) {
      node = new Node.VariableDeclaration();
      node.id = this.current.value;
      node.isMutable = mutable;
      this.next();
      this.scope.register(node);
      if (this.peek(TOKEN["="])) {
        this.next();
        node.init = this.parseExpression(0);
        node.type = new Node.Type();
        node.type.type = "auto";
      } else {
        node.type = this.parseType(":");
        if (this.eat(TOKEN["="])) {
          node.init = this.parseExpression(0);
        }
      }
    }
    /** (id,) = (expr,) */
    else if (this.eat(TOKEN["("])) {
      node = new Node.MultipleVariableDeclaration();
      node.body = this.parseExpressionParameters();
      this.expect(TOKEN[")"]);
      this.expect(TOKEN["="]);
      this.expect(TOKEN["("]);
      let tmp = this.parseExpressionParameters();
      for (let ii = 0; ii < node.body.length; ++ii) {
        let key = new Node.VariableDeclaration();
        key.id = node.body[ii].name;
        key.isMutable = mutable;
        key.init = tmp[ii];
        key.type = new Node.Type();
        key.type.type = "auto";
        node.body[ii] = key;
        this.scope.register(key);
      };
      this.expect(TOKEN[")"]);
    }

    this.eat(TOKEN[";"]);

    return (node);

  }

  /** Parse a body */
  parseBody() {

    let node = null;

    if (!this.expect(TOKEN["{"])) {
      return (node);
    }

    node = this.parseBlock();

    if (!this.expect(TOKEN["}"])) {
      return (null);
    }

    return (node);

  }

  /** Parse statements */
  parseStatements() {

    let nodes = [];
    let node = null;

    for (;!this.peek(TOKEN["}"]);) {
      if (this.current === void 0) break;
      node = this.parseStatement();
      if (node.body !== null) {
        nodes.push(node);
      }
    };

    return (nodes);

  }

  /** Parse import */
  parseImport() {

    let node = new Node.ImportStatement();

    if (this.peek(TOKEN["identifier"])) {
      node.body = this.parseExpressionParameters();
    }

    return (node);

  }

  parseStatement() {

    let node = new Node.Statement();

    /** Import */
    if (this.eat(TOKEN["import"])) {
      node.body = this.parseImport();
      this.eat(TOKEN[";"]);
      return (node);
    }

    /** Export */
    if (this.eat(TOKEN["export"])) {
      if (
        this.peek(TOKEN["func"]) ||
        this.peek(TOKEN["let"]) ||
        this.peek(TOKEN["var"]) ||
        this.peek(TOKEN["enum"])
      ) {
        node.export = true;
      }
    }

    if (this.eat(TOKEN["extension"])) {
      node.body = this.parseExtension();
    }
    else if (this.peek(TOKEN["let"]) || this.peek(TOKEN["var"])) {
      node.body = this.parseVariableDeclaration();
    }
    else if (this.peek(TOKEN["if"])) {
      node.body = this.parseIfStatement();
    }
    else if (this.peek(TOKEN["func"])) {
      node.body = this.parseFunction();
    }
    else if (this.peek(TOKEN["return"])) {
      node.body = this.parseReturn();
    }
    else if (this.peek(TOKEN["enum"])) {
      node.body = this.parseEnum();
    }
    else {
      node.body = this.parseExpression(0);
    }

    return (node);

  }

  parseExtension() {

    let node = new Node.ExtensionExpression();

    node.type = this.parseType("*");

    this.pushScope(node);
    if (this.peek(TOKEN["{"])) {
      node.body = this.parseBody();
    }
    this.popScope(node);

    let registered = this.scope.registerExtension(node);

    let parentExtension = this.scope.getExtension(node.type.type);

    if (registered !== void 0) {
      for (let key of node.body.body) {
        parentExtension.context.register(key.body);
      };
      node = null;
    }

    return (node);

  }

  parseCallExpression(callee) {

    let node = new Node.CallExpression();

    node.callee = callee;

    this.expect(TOKEN["("]);

    node.arguments = this.parseExpressionParameters();

    this.expect(TOKEN[")"]);

    this.eat(TOKEN[";"]);

    return (node);

  }

  parseExpressionParameters() {

    let node = null;
    let args = [];

    for (;true;) {
      node = this.parseStatement();
      node = node.body;
      if (node !== null) {
        if (node.length) {
          args = node;
        } else {
          args.push(node);
        }
      }
      if (this.peek(TOKEN[","])) {
        this.next();
      } else break;
    };

    return (args);

  }

  parseEnum() {

    let node = new Node.Enumeration();

    this.eat("enum");

    if (!this.peek(TOKEN["enum"])) {
      return (node);
    }

    this.next();

    if (!this.peek(TOKEN["identifier"])) return (node);

    node.name = this.current.value;

    this.next();

    if (this.eat(TOKEN[":"])) {
      node.type = this.parseType("*");
    }

    this.expect(TOKEN["{"]);

    node.body = this.parseCases(node, true);

    this.expect(TOKEN["}"]);

    this.eat(TOKEN[";"]);

    this.scope.register(node);

    return (node);

  }

  parseCases(parent, allowExpr) {

    let node = null;
    let args = [];

    /** Empty arguments */
    if (this.peek(TOKEN["}"])) return (args);

    this.expect(TOKEN["case"]);

    for (;true;) {
      node = new Node.EnumParameter();
      node.name = this.current.kind;
      node.value = this.current.value;
      node.parent = parent;
      this.next();
      args.push(node);
      this.scope.register(node);
      if (this.peek(TOKEN["("])) {
        this.expect(TOKEN["("]);
        node.type = this.parseType("*");
        this.expect(TOKEN[")"]);
      }
      else if (this.eat(TOKEN["="])) {
        node.argument = this.parseExpression(0);
        if (node.argument.kind !== Types.Literal) {
          console.error("Raw value for enum case must be a literal!");
        }
      }
      if (this.peek(TOKEN[","])) {
        this.next();
      }
      else if (this.peek(TOKEN["case"])) {
        this.next();
      } else break;
    };

    return (args);

  }

  /**
   * @param {Boolean} typeStrict
   * @return {Array}
   */
  parseParameters(typeStrict) {

    let node = null;
    let args = [];

    /** Empty arguments */
    if (this.peek(TOKEN[")"])) return (args);

    for (;true;) {
      node = new Node.Parameter();
      node.name = this.current.kind;
      node.value = this.current.value;
      this.next();
      if (typeStrict) {
        node.type = this.parseType(":");
        if (node.type.isReference) {
          node.isReference = true;
        }
      }
      this.scope.register(node, this.scope);
      args.push(node);
      if (this.peek(TOKEN[","])) {
        this.next();
      } else break;
    };

    return (args);

  }

  parseType(type) {

    let node = new Node.Type();

    if (type !== "*" && !this.expect(TOKEN[type]) && !this.peek(TOKEN["inout"])) return (null);
/*
    switch (this.current.value) {
      case "Void":
        node.type = 0;
      break;
      case "Int":
        node.type = 1;
      break;
      case "Int8":
        node.type = 2;
      break;
      case "UInt8":
        node.type = 3;
      break;
      case "Int32":
        node.type = 4;
      break;
      case "UInt32":
        node.type = 5;
      break;
      case "Int64":
        node.type = 6;
      break;
      case "UInt64":
        node.type = 7;
      break;
      case "Double":
        node.type = 8;
      break;
      case "Float":
        node.type = 9;
      break;
      case "Bool":
        node.type = 10;
      break;
      case "String":
        node.type = 11;
      break;
      case "Character":
        node.type = 12;
      break;
      default:
        return (null);
      break;
    };
*/

    if (this.eat(TOKEN["inout"])) {
      node.isReference = true;
    }

    node.type = this.current.value;
    this.next();

    return (node);

  }

}

inherit(Parser, expr);