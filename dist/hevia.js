(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HEVIA = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileProgram = compileProgram;
exports.compileBlock = compileBlock;
exports.compileStatement = compileStatement;
exports.compileExpressionStatement = compileExpressionStatement;
exports.compileDeclaration = compileDeclaration;
exports.compileExtensionDeclaration = compileExtensionDeclaration;
exports.compileCallExpression = compileCallExpression;
exports.compileVariableDeclaration = compileVariableDeclaration;
exports.compileMultipleVariableDeclarations = compileMultipleVariableDeclarations;
exports.compileFunctionDeclaration = compileFunctionDeclaration;
exports.compileArguments = compileArguments;
exports.compileOperatorDeclaration = compileOperatorDeclaration;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compileProgram(ast) {
  this.compileBlock(ast);
}

function compileBlock(ast) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {

    for (var _iterator = ast.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      this.compileStatement(node);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ;
}

function compileStatement(ast) {

  switch (ast.kind) {
    /** Loop statement */
    case _labels.Types.ForStatement:
    case _labels.Types.WhileStatement:
    case _labels.Types.RepeatStatement:
      //console.log(ast);
      break;
    /** Branch statement */
    case _labels.Types.IfStatement:
    case _labels.Types.GuardStatement:
    case _labels.Types.SwitchStatement:
    case _labels.Types.PseudoProperty:
      //console.log(ast);
      break;
    /** Defer statement */
    case _labels.Types.DeferStatement:
      //console.log(ast);
      break;
    /** Return statement */
    case _labels.Types.ReturnStatement:
      //console.log(ast);
      break;
    /** Do statement */
    case _labels.Types.DoStatement:
      //console.log(ast);
      break;
    /** Declaration statement */
    case _labels.Types.ImportStatement:
    case _labels.Types.VariableDeclaration:
    case _labels.Types.FunctionDeclaration:
    case _labels.Types.EnumDeclaration:
    case _labels.Types.StructDeclaration:
    case _labels.Types.ClassDeclaration:
    case _labels.Types.ProtocolDeclaration:
    case _labels.Types.ExtensionDeclaration:
    case _labels.Types.OperatorDeclaration:
      return this.compileDeclaration(ast);
      break;
    /** Expression statement */
    default:
      return this.compileExpressionStatement(ast);
      break;
  };
}

function compileExpressionStatement(ast) {

  switch (ast.kind) {
    case _labels.Types.BinaryExpression:
      return this.inferenceExpression(ast);
      break;
    case _labels.Types.CallExpression:
      return this.compileCallExpression(ast);
      break;
  };
}

function compileDeclaration(ast) {

  switch (ast.kind) {
    case _labels.Types.ExtensionDeclaration:
      return this.compileExtensionDeclaration(ast);
      break;
    case _labels.Types.OperatorDeclaration:
      return this.compileOperatorDeclaration(ast);
      break;
    case _labels.Types.FunctionDeclaration:
      return this.compileFunctionDeclaration(ast);
      break;
    case _labels.Types.VariableDeclaration:
      return this.compileVariableDeclaration(ast);
      break;
  }
}

function compileExtensionDeclaration(ast) {

  var name = null;

  if (this.isPureType(ast.argument)) {
    name = (0, _utils.getLabelByNumber)(ast.argument.type);
  } else {
    name = ast.argument.value;
  }

  this.extensions[name] = ast.body;

  this.compileBlock(ast.body);
}

function compileCallExpression(ast) {

  return this.inferenceExpression(ast);
}

function compileVariableDeclaration(ast) {

  var index = 0;

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = ast.declarations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      var init = ast.init[index] || ast.init;
      /** Multiple declarations */
      if (key.kind === _labels.Types.ParameterExpression) {
        this.compileMultipleVariableDeclarations(ast.declarations[0], init);
      } else {
        if (key.type.type === -1) {
          key.type.type = this.compileStatement(init);
        }
        this.scope.register(key);
      }
      index++;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  ;
}

function compileMultipleVariableDeclarations(ast, init) {

  var index = 0;

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = ast.arguments[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      this.scope.register(key);
      ++index;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  ;
}

function compileFunctionDeclaration(ast) {

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

function compileArguments(node) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {

    for (var _iterator4 = node.arguments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var key = _step4.value;

      this.scope.register(key.init);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  ;
}

function compileOperatorDeclaration(ast) {

  var op = ast.operator.raw;
  var lvl = -1;
  var assoc = null;

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = ast.body.body[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var node = _step5.value;

      if (node.kind === _labels.Types.AssociativityExpression) {
        assoc = node.associativity.raw;
      }
      if (node.kind === _labels.Types.PrecedenceExpression) {
        lvl = Number(node.level.raw);
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  ;

  this.operators[op] = {
    name: ast.name,
    level: lvl,
    associativity: assoc,
    func: null
  };
}

},{"../labels":38,"../nodes":39,"../utils":42}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require("../utils");

var _scope = require("../scope");

var _scope2 = _interopRequireDefault(_scope);

var _lang = require("./lang");

var pack = _interopRequireWildcard(_lang);

var _compile = require("./compile");

var compile = _interopRequireWildcard(_compile);

var _inference = require("./inference");

var inference = _interopRequireWildcard(_inference);

var _global = require("../Environment/global");

var globals = _interopRequireWildcard(_global);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Compiler
 * @export
 */

var Compiler = function () {

  /** @constructor */

  function Compiler() {
    _classCallCheck(this, Compiler);

    /**
     * Scope
     * @type {Scope}
     */
    this.scope = null;

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
     * Global objects
     * @type {Object}
     */
    this.global = globals;

    /**
     * Compiled output
     * @type {String}
     */
    this.output = "";
  }

  _createClass(Compiler, [{
    key: "reset",
    value: function reset() {
      this.scope = void 0;
      this.output = "";
      this.operators = {};
      this.extensions = {};
    }

    /** 
     * Write
     * @param {String} str
     */

  }, {
    key: "write",
    value: function write(str) {
      this.output += str;
    }

    /**
     * Enter scope
     * @param {Node} node
     */

  }, {
    key: "pushScope",
    value: function pushScope(node) {
      node.context = new _scope2.default(node, this.scope);
      this.scope = node.context;
    }

    /** Leave scope */

  }, {
    key: "popScope",
    value: function popScope() {
      this.scope = this.scope.parent;
    }

    /**
     * Literal contains type only
     * @param  {Node}  ast
     * @return {Boolean}
     */

  }, {
    key: "isPureType",
    value: function isPureType(node) {
      return node.value === void 0 && node.raw === void 0 && node.type >= 0 || node.type <= 0;
    }

    /**
     * @param {Node} ast
     * @param {String} lang
     * @return {String}
     */

  }, {
    key: "compile",
    value: function compile(ast, lang) {
      this.reset();
      this.scope = void 0;
      this.pushScope(ast.body);
      this.compileProgram(ast.body);
      this.initLanguage(lang);
      this.emitProgram(ast.body);
      return this.output;
    }

    /**
     * @param {String} lang
     */

  }, {
    key: "initLanguage",
    value: function initLanguage(lang) {

      switch (lang) {
        case "JS":
          lang = "JavaScript";
          (0, _utils.inherit)(Compiler, pack.JavaScript);
          break;
        case "JAVA":
          lang = "Java";
          (0, _utils.inherit)(Compiler, pack.Java);
          break;
        default:
          console.error("Unknown target language.");
          break;
      }

      //console.log(`Compiling to ${lang}`);
    }
  }]);

  return Compiler;
}();

exports.default = Compiler;


(0, _utils.inherit)(Compiler, compile);
(0, _utils.inherit)(Compiler, inference);

},{"../Environment/global":7,"../scope":41,"../utils":42,"./compile":1,"./inference":3,"./lang":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inferenceBlock = inferenceBlock;
exports.inferenceExpression = inferenceExpression;
exports.inferenceParameterExpression = inferenceParameterExpression;
exports.inferenceMemberExpression = inferenceMemberExpression;
exports.inferenceCallExpression = inferenceCallExpression;
exports.inferenceBinaryExpression = inferenceBinaryExpression;
exports.inferenceLiteral = inferenceLiteral;
exports.globalCheck = globalCheck;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inferenceBlock(node) {

  var type = null;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = node.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (key.kind === _labels.Types.ReturnStatement) {
        type = this.inferenceExpression(key.argument);
      } else {
        type = this.inferenceExpression(key);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ;

  return type;
}

function inferenceExpression(node) {

  switch (node.kind) {
    case _labels.Types.Literal:
      return this.inferenceLiteral(node);
      break;
    case _labels.Types.BinaryExpression:
      return this.inferenceBinaryExpression(node);
      break;
    case _labels.Types.CallExpression:
      return this.inferenceCallExpression(node);
      break;
    case _labels.Types.MemberExpression:
      return this.inferenceMemberExpression(node);
      break;
    case _labels.Types.ParameterExpression:
      this.inferenceParameterExpression(node);
      break;
    case _labels.Types.Parameter:
      this.inferenceExpression(node.init);
      break;
  };
}

function inferenceParameterExpression(node) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {

    for (var _iterator2 = node.arguments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      this.inferenceExpression(key);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  ;
}

function inferenceMemberExpression(node) {

  var left = this.inferenceExpression(node.object);
  var right = this.inferenceExpression(node.property);

  return left || right;
}

function inferenceCallExpression(node) {

  var type = this.inferenceExpression(node.callee);

  this.inferenceExpression(node.arguments);

  return type;
}

function inferenceBinaryExpression(node) {

  if (node.left && node.right) {
    var left = this.inferenceExpression(node.left);
    var right = this.inferenceExpression(node.right);
    return left || right;
  } else {
    if (node.kind === _labels.Types.Literal) {
      if (node.type === _labels.Token.NumericLiteral) {
        return _labels.TokenList[(0, _utils.getNumericType)(Number(node.raw))];
      }
      if (node.type === _labels.Token.Identifier) {
        return this.inferenceExpression(node);
      }
    }
    return node;
  }
}

function inferenceLiteral(node) {

  var resolved = this.scope.get(node.value);

  if (node.isPointer) {
    if (resolved && resolved.kind === _labels.Types.VariableDeclarement) {
      resolved.isLaterPointer = true;
    } else {
      throw new Error("Can't resolve " + node.value + " declarement!");
    }
  }

  if (resolved && resolved.type) {
    return resolved.type.name || resolved.type.type;
  } else {
    this.globalCheck(node);
    return _labels.TokenList[(0, _utils.getNumericType)(Number(node.raw))];
  }
}

function globalCheck(node) {

  if (node.kind === _labels.Types.MemberExpression) {
    if (this.global.hasOwnProperty(node.object.value)) {
      node.object.isGlobal = true;
    }
  } else if (node.kind === _labels.Types.Literal) {
    if (this.global.hasOwnProperty(node.value)) {
      node.isGlobal = true;
    }
  }
}

},{"../labels":38,"../nodes":39,"../utils":42}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitProgram = emitProgram;
exports.emitStartHeader = emitStartHeader;
exports.emitEndHeader = emitEndHeader;
exports.emitOperatorDefinitions = emitOperatorDefinitions;
exports.emitBlock = emitBlock;
exports.emitStatement = emitStatement;
exports.emitIf = emitIf;
exports.emitTernary = emitTernary;
exports.emitParameter = emitParameter;
exports.emitMember = emitMember;
exports.emitCall = emitCall;
exports.emitArguments = emitArguments;
exports.emitDeclaration = emitDeclaration;
exports.emitExtension = emitExtension;
exports.emitVariableDeclaration = emitVariableDeclaration;
exports.emitVariable = emitVariable;
exports.emitMultipleVariable = emitMultipleVariable;
exports.emitBinary = emitBinary;
exports.emitCustomOperator = emitCustomOperator;
exports.emitLiteral = emitLiteral;
exports.emitFunction = emitFunction;
exports.emitReturn = emitReturn;

var _labels = require("../../../labels");

var _nodes = require("../../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emitProgram(ast) {
  this.write("\"use strict\";\n");
  this.emitOperatorDefinitions();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ast.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      this.emitStatement(node);
      this.write("\n");
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ;
  this.write("\n");
}

function emitStartHeader() {
  this.write("(function(__global) {\n");
}

function emitEndHeader() {
  this.write("})(hevia.global)\n");
}

function emitOperatorDefinitions() {

  if (!Object.keys(this.operators).length) return void 0;

  this.write("var __OP = {\n");

  for (var key in this.operators) {
    this.write("\"" + key + "\"");
    this.write(":");
    this.emitFunction(this.operators[key].func, true);
  };

  this.write("\n}");
}

function emitBlock(ast) {
  this.write(" {");
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = ast.body[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var node = _step2.value;

      this.write("\n");
      this.emitStatement(node);
      this.write(";");
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  ;
  this.write("\n}\n");
}

function emitStatement(ast) {

  switch (ast.kind) {
    /** Loop statement */
    case _labels.Types.ForStatement:
    case _labels.Types.WhileStatement:
    case _labels.Types.RepeatStatement:
      //console.log(ast);
      break;
    /** Branch statement */
    case _labels.Types.GuardStatement:
    case _labels.Types.SwitchStatement:
    case _labels.Types.PseudoProperty:
      //console.log(ast);
      break;
    /** Defer statement */
    case _labels.Types.DeferStatement:
      //console.log(ast);
      break;
    /** Return statement */
    case _labels.Types.ReturnStatement:
      this.emitReturn(ast);
      break;
    /** Do statement */
    case _labels.Types.DoStatement:
      //console.log(ast);
      break;
    /** Declaration statement */
    case _labels.Types.ImportStatement:
    case _labels.Types.VariableDeclaration:
    case _labels.Types.FunctionDeclaration:
    case _labels.Types.EnumDeclaration:
    case _labels.Types.StructDeclaration:
    case _labels.Types.ClassDeclaration:
    case _labels.Types.ProtocolDeclaration:
    case _labels.Types.ExtensionDeclaration:
    case _labels.Types.OperatorDeclaration:
      this.emitDeclaration(ast);
      break;
    case _labels.Types.CallExpression:
      this.emitCall(ast);
      break;
    case _labels.Types.BinaryExpression:
      this.emitBinary(ast);
      break;
    case _labels.Types.MemberExpression:
      this.emitMember(ast);
      break;
    case _labels.Types.Parameter:
      this.emitParameter(ast);
      break;
    case _labels.Types.ParameterExpression:
      this.write("(");
      this.emitArguments(ast);
      this.write(")");
      break;
    case _labels.Types.TernaryExpression:
      this.emitTernary(ast);
      break;
    case _labels.Types.IfStatement:
      this.emitIf(ast);
      break;
    default:
      this.emitBinary(ast);
      break;
  };
}

function emitIf(ast) {

  if (ast.condition) {
    this.write("if (");
    this.emitStatement(ast.condition);
    this.write(")");
  }
  this.emitBlock(ast.consequent);
  if (ast.alternate && ast.alternate.kind === _labels.Types.IfStatement) {
    this.write(" else ");
    this.emitStatement(ast.alternate);
  }
}

function emitTernary(ast) {

  this.emitStatement(ast.condition);
  this.write("?");
  this.emitStatement(ast.consequent);
  this.write(":");
  this.emitStatement(ast.alternate);
}

function emitParameter(ast) {
  /** Labeled call parameter */
  if (ast.init.init !== void 0) {
    this.emitStatement(ast.init.init);
  } else {
    this.emitStatement(ast.init);
  }
}

function emitMember(ast) {

  if (ast.object.kind === _labels.Types.Literal) {
    this.emitLiteral(ast.object);
  } else {
    this.emitStatement(ast.object);
  }

  this.write(".");

  if (ast.property.kind === _labels.Types.Literal) {
    this.emitLiteral(ast.property);
  } else {
    this.emitStatement(ast.property);
  }
}

function emitCall(ast) {

  this.emitStatement(ast.callee);

  this.write("(");
  this.emitArguments(ast.arguments);
  this.write(")");
}

function emitArguments(ast) {

  var param = ast.arguments;

  var ii = 0;
  var length = param.length;

  for (; ii < length; ++ii) {
    this.emitStatement(param[ii]);
    if (ii + 1 < length) this.write(", ");
  };
}

function emitDeclaration(ast) {

  switch (ast.kind) {
    case _labels.Types.FunctionDeclaration:
      this.emitFunction(ast, false);
      break;
    case _labels.Types.ExtensionDeclaration:
      this.emitExtension(ast);
      break;
    case _labels.Types.VariableDeclaration:
      this.emitVariableDeclaration(ast);
      break;
  }
}

function emitExtension(ast) {

  this.write("class ");

  this.write("__");

  this.emitLiteral(ast.argument);

  this.write(" {\n");

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = ast.body.body[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var node = _step3.value;

      if (node.kind === _labels.Types.FunctionDeclaration) {
        node.isStatic = true;
        this.emitFunction(node, false, true);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  ;

  this.write("}");
}

function emitVariableDeclaration(ast) {

  var index = 0;
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = ast.declarations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var node = _step4.value;

      var init = ast.init[index] || ast.init;
      var symbol = (0, _utils.getNameByLabel)(ast.symbol).toLowerCase() + " ";
      if (node.kind === _labels.Types.ParameterExpression) {
        this.emitMultipleVariable(node, init, symbol);
      } else {
        this.write(symbol);
        this.emitVariable(node, init);
      }
      index++;
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  ;
}

function emitVariable(ast, init) {

  this.write(ast.name || ast.value);
  this.write(" = ");

  if (ast.isLaterPointer) this.write("{\nvalue: ");

  this.emitStatement(init);

  if (ast.isLaterPointer) this.write("\n}");

  this.write(";\n");
}

function emitMultipleVariable(ast, init, symbol) {

  var index = 0;
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = ast.arguments[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var node = _step5.value;

      this.write(symbol);
      this.emitVariable(node.init, init.arguments[index]);
      index++;
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  ;
}

function emitBinary(ast) {

  if (ast.kind === _labels.Types.BinaryExpression) {
    var op = (0, _utils.getLabelByNumber)(ast.operator);
    /** Custom operator call */
    if (op in this.operators) {
      this.emitCustomOperator(ast, op);
      /** Default binary expr */
    } else {
        if (ast.isParenthised) this.write("(");
        this.emitStatement(ast.left);
        op = op === "==" ? "===" : op === "!=" ? "!==" : op;
        this.write(" " + op + " ");
        this.emitStatement(ast.right);
        if (ast.isParenthised) this.write(")");
      }
  } else if (ast.kind === _labels.Types.Literal) {
    this.emitLiteral(ast);
  }
}

function emitCustomOperator(ast, op) {

  this.write("__OP[\"" + op + "\"]");
  this.write("(");
  this.emitStatement(ast.left);
  this.write(", ");
  this.emitStatement(ast.right);
  this.write(")");
}

function emitLiteral(ast) {

  if (ast.init) ast = ast.init;

  if (ast.isGlobal) {
    this.write("__global.");
  }

  var name = this.isPureType(ast) ? (0, _utils.getNameByLabel)(ast.type) : ast.value || ast.name;

  var resolve = this.scope.get(ast.value);

  if (this.isPureType(ast)) {
    if (ast.type === _labels.TokenList.SELF) {
      this.write("this");
    } else {
      this.write((0, _utils.getLabelByNumber)(_labels.TokenList[name]));
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

function emitFunction(ast, allowOP, noKeyword) {

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

function emitReturn(ast) {

  this.write("return ");

  this.emitStatement(ast.argument);
}

},{"../../../labels":38,"../../../nodes":39,"../../../utils":42}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitProgram = emitProgram;

var _labels = require("../../../labels");

var _nodes = require("../../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function emitProgram(ast) {
  //this.emitBlock(ast);
}

},{"../../../labels":38,"../../../nodes":39,"../../../utils":42}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JavaScript = exports.Java = undefined;

var _Java2 = require("./Java");

var _Java = _interopRequireWildcard(_Java2);

var _JavaScript2 = require("./JavaScript");

var _JavaScript = _interopRequireWildcard(_JavaScript2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.Java = _Java;
exports.JavaScript = _JavaScript;

},{"./Java":5,"./JavaScript":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.print = print;
exports.pow = pow;
exports.expect = expect;
function print() {
  console.log.apply(console, arguments);
}

function pow(rx, pow) {
  return Math.pow(rx, pow);
}

function expect(truth) {
  if (!truth) {
    throw new Error("Expection error!");
  }
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseGuardStatement = parseGuardStatement;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseGuardStatement() {
  return null;
}

},{"../../labels":38,"../../nodes":39}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseIfStatement = parseIfStatement;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseIfStatement() {

  var node = new _nodes2.default.IfStatement();

  if (this.eat(_labels.TokenList.IF)) {
    this.eat(_labels.TokenList.LPAREN);
    node.condition = this.parseExpressionStatement();
    this.eat(_labels.TokenList.RPAREN);
  }

  /** Consequent */
  this.expect(_labels.TokenList.LBRACE);
  node.consequent = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  /** Alternate: else|else if */
  if (this.eat(_labels.TokenList.ELSE)) {
    node.alternate = this.parseIfStatement();
  }

  return node;
}

},{"../../labels":38,"../../nodes":39}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBranchStatement = parseBranchStatement;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  [ ] if
  [ ] guard
  [ ] switch
  @return {Node}
*/
function parseBranchStatement() {

  switch (this.current.name) {
    case _labels.TokenList.IF:
      return this.parseIfStatement();
      break;
    case _labels.TokenList.GUARD:
      return this.parseGuardStatement();
      break;
    case _labels.TokenList.SWITCH:
      return this.parseSwitch;
      break;
    case _labels.TokenList.GET:
    case _labels.TokenList.SET:
    case _labels.TokenList.WILLSET:
    case _labels.TokenList.DIDSET:
      return this.parsePseudoProperty();
      break;
  };

  return null;
}

},{"../../labels":38,"../../nodes":39}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePseudoProperty = parsePseudoProperty;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parsePseudoProperty() {

  /** willSet, didSet, set can have parameters */
  var allowParameters = this.peek(_labels.TokenList.SET) || this.peek(_labels.TokenList.WILLSET) || this.peek(_labels.TokenList.DIDSET);

  var node = new _nodes2.default.PseudoProperty();

  node.name = this.current.name;

  this.next();

  if (this.peek(_labels.TokenList.LPAREN) && allowParameters) {
    node.arguments = this.parseArguments();
  }

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

},{"../../labels":38,"../../nodes":39}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSwitch = parseSwitch;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseSwitch() {
  return null;
}

},{"../../labels":38,"../../nodes":39}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseClass = parseClass;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseClass() {

  var node = new _nodes2.default.ClassDeclaration();

  this.expect(_labels.TokenList.CLASS);

  node.name = this.extract(_labels.Token.Identifier).value;

  if (this.eat(_labels.TokenList.COLON)) {
    node.extend = this.parseCommaSeperatedValues() || [];
  }

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

},{"../../labels":38,"../../nodes":39}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseExtension = parseExtension;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseExtension() {

  var node = new _nodes2.default.ExtensionDeclaration();

  this.expect(_labels.TokenList.EXTENSION);

  node.argument = this.parseExpressionStatement();

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

},{"../../labels":38,"../../nodes":39}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFunction = parseFunction;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseFunction() {

  var node = new _nodes2.default.FunctionDeclaration();

  /** Optional, so dont expect */
  this.eat(_labels.TokenList.FUNCTION);

  node.name = this.extract(_labels.Token.Identifier).value;
  node.arguments = this.parseArguments();

  if (this.peek(_labels.TokenList.ARROW)) {
    node.type = this.parseStrictType();
  }

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":42}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseImport = parseImport;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseImport() {
  return null;
}

},{"../../labels":38,"../../nodes":39}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDeclarationStatement = parseDeclarationStatement;
exports.parseInitializerDeclaration = parseInitializerDeclaration;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  [ ] import
  [x] constant
  [x] variable
  [ ] typealias
  [ ] function
  [ ] enum
  [ ] struct
  [ ] class
  [ ] protocol
  [ ] initializer
  [ ] deinitializer
  [ ] extension
  [ ] subscript
  [ ] operator
  @return {Node}
*/
function parseDeclarationStatement() {

  var node = null;

  switch (this.current.name) {
    case _labels.TokenList.IMPORT:
      node = this.parseImport();
      break;
    case _labels.TokenList.VAR:
    case _labels.TokenList.CONST:
      node = this.parseVariableDeclaration();
      break;
    case _labels.TokenList.TYPEALIAS:
      //
      break;
    case _labels.TokenList.FUNCTION:
      node = this.parseFunction();
      break;
    case _labels.TokenList.ENUM:
      node = this.parseEnum();
      break;
    case _labels.TokenList.STRUCT:
      node = this.parseStruct();
      break;
    case _labels.TokenList.CLASS:
      node = this.parseClass();
      break;
    case _labels.TokenList.PROTOCOL:
      node = this.parseProtocol();
      break;
    case _labels.TokenList.EXTENSION:
      node = this.parseExtension();
      break;
    case _labels.TokenList.POSTFIX:
    case _labels.TokenList.PREFIX:
    case _labels.TokenList.INFIX:
      node = this.parseOperatorDeclaration();
      break;
    case _labels.TokenList.INIT:
      node = this.parseInitializerDeclaration();
      break;
  };

  this.eat(_labels.TokenList.SEMICOLON);

  return node;
}

/*
 * @return {Node}
 */
function parseInitializerDeclaration() {

  var node = new _nodes2.default.InitializerDeclaration();

  this.expect(_labels.TokenList.INIT);

  node.arguments = this.parseArguments();

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":42}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOperatorDeclaration = parseOperatorDeclaration;
exports.parsePrecedenceExpression = parsePrecedenceExpression;
exports.parseAssociativityExpression = parseAssociativityExpression;
exports.getOperatorAssociativity = getOperatorAssociativity;
exports.getOperatorPrecedence = getOperatorPrecedence;

var _labels = require("../../labels");

var _utils = require("../../utils");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _precedence = require("../../precedence");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseOperatorDeclaration() {

  var node = new _nodes2.default.OperatorDeclaration();

  node.name = this.current.name;

  this.next();
  this.expect(_labels.TokenList.OPERATOR);

  node.operator = this.parseLiteral();

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  var associativity = this.getOperatorAssociativity(node.body.body);
  var precedence = this.getOperatorPrecedence(node.body.body);

  var symbol = (node.name === _labels.TokenList.INFIX ? "IFX" : node.name === _labels.TokenList.PREFIX ? "PEX" : node.name === _labels.TokenList.POSTFIX ? "POX" : "") + ("::" + node.operator.raw);

  (0, _precedence.registerOperator)(node.operator.raw, precedence, associativity, symbol);

  return node;
}

/**
 * @return {Node}
 */
function parsePrecedenceExpression() {

  var node = new _nodes2.default.PrecedenceExpression();

  this.expect(_labels.TokenList.PRECEDENCE);

  node.level = this.parseLiteral();

  return node;
}

/**
 * @return {Node}
 */
function parseAssociativityExpression() {

  var node = new _nodes2.default.AssociativityExpression();

  this.expect(_labels.TokenList.ASSOCIATIVITY);

  node.associativity = this.parseLiteral();

  return node;
}

/**
 * @param {Node}
 * @return {String}
 */
function getOperatorAssociativity(body) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {

    for (var _iterator = body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      if (node.kind === _labels.Types.AssociativityExpression) {
        return node.associativity.raw;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  ;

  return "none";
}

/**
 * @param {Node}
 * @return {Number}
 */
function getOperatorPrecedence(body) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {

    for (var _iterator2 = body[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var node = _step2.value;

      if (node.kind === _labels.Types.PrecedenceExpression) {
        return Number(node.level.raw);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  ;

  return -1;
}

},{"../../labels":38,"../../nodes":39,"../../precedence":40,"../../utils":42}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseProtocol = parseProtocol;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseProtocol() {
  return null;
}

},{"../../labels":38,"../../nodes":39}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseStruct = parseStruct;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseStruct() {
  return null;
}

},{"../../labels":38,"../../nodes":39}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseVariableDeclaration = parseVariableDeclaration;
exports.parseVariable = parseVariable;
exports.parseVariableDeclarement = parseVariableDeclarement;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  [x] name
  [x] pattern
  [x] block
  [x] getter-setter
  [x] willset-didset
  [x] expression
  [x] type annotation (opt)
  @return {Node}
 */
function parseVariableDeclaration() {

  var declaration = null;
  var node = new _nodes2.default.VariableDeclaration();

  node.symbol = this.current.name;
  this.next();

  this.parseVariable(node);

  return node;
}

function parseVariable(node) {

  node.declarations = this.parseVariableDeclarement();

  /** block */
  if (this.eat(_labels.TokenList.LBRACE)) {
    node.init = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
    /** expression */
  } else {
      if (this.eat(_labels.TokenList.ASSIGN)) {
        node.init = this.parseStatement();
      }
    }

  if (this.eat(_labels.TokenList.COMMA)) {
    var loc = this.current.loc;
    throw new Error("Comma seperated variable declarations - not supported yet (" + loc.start.line + ":" + (loc.start.column - 1) + ")");
  }
}

function parseVariableDeclarement() {

  var args = null;

  if (this.peek(_labels.Token.Identifier)) {
    args = [this.parseLiteral()];
  } else if (this.peek(_labels.TokenList.LPAREN)) {
    args = this.parseParenthese(_labels.TokenList.LPAREN, _labels.TokenList.RPAREN);
  }

  return args;
}

},{"../../labels":38,"../../nodes":39,"../../utils":42}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseParenthese = parseParenthese;
exports.parseCommaSeperatedValues = parseCommaSeperatedValues;
exports.parseArguments = parseArguments;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _precedence = require("../../precedence");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  [x] parenthesed bin expr
  [x] parameter
  [x] tuple
  @return {Node}
 */
function parseParenthese(left, right) {

  var node = null;
  var base = null;

  /** Empty parenthese */
  this.expect(left);
  if (this.eat(right)) return null;

  base = this.parseExpressionStatement();

  if (this.eat(_labels.TokenList.COMMA)) {
    node = this.parseCommaSeperatedValues();
    node.unshift(base);
  } else {
    node = base;
  }

  this.expect(right);

  return node;
}

/**
 * @return {Array}
 */
function parseCommaSeperatedValues() {

  var args = [];

  while (true) {
    args.push(this.parseExpressionStatement());
    if (!this.eat(_labels.TokenList.COMMA)) break;
  };

  return args;
}

/**
 * @return {Array}
 */
function parseArguments(args) {

  var argz = args === void 0 ? this.parseExpressionStatement() : args;

  /** Handle empty arguments */
  if (argz === null) {
    argz = [];
  } else if (!argz.length) {
    argz = [argz];
  }

  return argz;
}

},{"../../labels":38,"../../nodes":39,"../../precedence":40,"../../utils":42}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAtomicExpression = parseAtomicExpression;
exports.parseMemberExpression = parseMemberExpression;
exports.parseCallExpression = parseCallExpression;
exports.parseTernaryExpression = parseTernaryExpression;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Handles deep:
 * - CallExpr   ()
 * - MemberExpr []
 * - MemberExpr .
 * - TernaryExpr ?:
 * @return {Node}
 */
function parseAtomicExpression() {

  var base = this.parseBinaryExpression(0);

  while (true) {
    if (this.peek(_labels.TokenList.CONDITIONAL)) {
      base = this.parseTernaryExpression(base);
    }
    /** Member expression */
    else if (this.peek(_labels.TokenList.LBRACK) || this.peek(_labels.TokenList.PERIOD)) {
        base = this.parseMemberExpression(base);
        /** Type casting */
      } else if (this.peek(_labels.TokenList.AS) || this.peek(_labels.TokenList.IS)) {
          base = this.parseCast(base);
        } else break;
  };

  return base;
}

/**
 * @return {Node}
 */
function parseMemberExpression(base) {

  var node = new _nodes2.default.MemberExpression();

  node.isComputed = this.peek(_labels.TokenList.LBRACK);

  this.next();

  node.object = base;
  node.property = this.parseBinaryExpression(0);

  if (node.isComputed) {
    this.expect(_labels.TokenList.RBRACK);
  }

  return node;
}

/**
 * @return {Node}
 */
function parseCallExpression(callee) {

  var node = new _nodes2.default.CallExpression();

  node.callee = callee;
  node.arguments = this.parseArguments();

  return node;
}

/**
 * @return {Node}
 */
function parseTernaryExpression(condition) {

  var node = new _nodes2.default.TernaryExpression();

  this.inTernary = true;

  node.condition = condition;

  this.expect(_labels.TokenList.CONDITIONAL);
  node.consequent = this.parseExpressionStatement();
  this.expect(_labels.TokenList.COLON);
  node.alternate = this.parseExpressionStatement();

  this.inTernary = false;

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":42}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBinaryExpression = parseBinaryExpression;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _precedence = require("../../precedence");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param  {Number} index Precedence
 * @return {Node}
 */
function parseBinaryExpression(index) {

  var tmp = null;
  var ast = null;
  var node = null;

  var state = _precedence.Precedence[index];

  ast = state ? this.parseBinaryExpression(index + 1) : this.parseLiteral();

  while (this.acceptPrecedence(state)) {
    node = new _nodes2.default.BinaryExpression();
    node.operator = _labels.TokenList[state.op];
    this.next();
    node.left = ast;
    tmp = state ? this.parseBinaryExpression(index + 1) : this.parseLiteral();
    node.right = tmp;
    ast = node;
    node.isParenthised = this.peek(_labels.TokenList.RPAREN);
  };

  return ast;
}

},{"../../labels":38,"../../nodes":39,"../../precedence":40,"../../utils":42}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCast = parseCast;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Parse a type cast expression
 * @param  {Node} base
 * @return {Node}
 */
function parseCast(base) {

  var node = new _nodes2.default.TypeCast();

  node.operator = this.current.name;
  this.next();
  /** Conditional cast */
  if (this.peek(_labels.TokenList.CONDITIONAL)) {
    node.isConditional = true;
    this.next();
  } else if (this.peek(_labels.TokenList.NOT)) {
    node.isForced = true;
    this.next();
  }
  node.expression = base;
  node.type = this.parseLiteral();

  return node;
}

},{"../../labels":38,"../../nodes":39}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseExpressionStatement = parseExpressionStatement;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseExpressionStatement() {

  switch (this.current.name) {
    case _labels.TokenList.LBRACK:
    case _labels.TokenList.LPAREN:
    case _labels.TokenList.SELF:
    case _labels.TokenList.BIT_AND:
    case _labels.TokenList.UL:
    case _labels.TokenList.TRUE:
    case _labels.TokenList.FALSE:
    case _labels.Token.Identifier:
    case _labels.Token.NullLiteral:
    case _labels.Token.StringLiteral:
    case _labels.Token.NumericLiteral:
    case _labels.Token.BooleanLiteral:
      return this.parseAtomicExpression();
      break;
    /** Operator things */
    case _labels.TokenList.ASSOCIATIVITY:
      return this.parseAssociativityExpression();
      break;
    case _labels.TokenList.PRECEDENCE:
      return this.parsePrecedenceExpression();
      break;
  };

  if (this.isNativeType(this.current.name)) {
    return this.parseLiteral();
  }

  return null;
}

},{"../../labels":38,"../../nodes":39,"../../utils":42}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLiteral = parseLiteral;
exports.parseArrayDeclaration = parseArrayDeclaration;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseLiteral() {

  if (this.peek(_labels.TokenList.LBRACK)) {
    return this.parseArrayDeclaration();
  } else if (this.peek(_labels.TokenList.LPAREN)) {
    return this.parseParenthese(_labels.TokenList.LPAREN, _labels.TokenList.RPAREN);
  }

  var node = new _nodes2.default.Literal();

  if (this.eat(_labels.TokenList.UL)) {
    node.isExplicit = true;
  }

  if (this.current.value === "&") {
    node.isPointer = true;
    this.next();
  }

  node.type = this.current.name;
  node.value = this.current.value;
  node.raw = this.current.value;
  this.next();

  /** Labeled literal */
  if (this.peek(_labels.Token.Identifier)) {
    if (!this.isOperator(_labels.TokenList[this.current.value])) {
      var tmp = this.parseLiteral();
      tmp.label = node;
      node = tmp;
    }
  }

  if (!this.inTernary) {
    if (this.eat(_labels.TokenList.COLON)) {
      if (this.eat(_labels.TokenList.INOUT)) {
        node.isReference = true;
        this.back();
      }
      this.back();
      node = this.parseStrictType(node);
    }
  }

  /** Call expression */
  if (this.peek(_labels.TokenList.LPAREN)) {
    node = this.parseCallExpression(node);
  }

  return node;
}

/**
 * @return {Node}
 */
function parseArrayDeclaration() {

  var node = new _nodes2.default.ArrayDeclaration();

  var args = this.parseParenthese(_labels.TokenList.LBRACK, _labels.TokenList.RBRACK);

  node.argument = this.parseArguments(args);

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":42}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("../utils");

var _parse = require("./parse");

var parse = _interopRequireWildcard(_parse);

var _args = require("./expression/args");

var args = _interopRequireWildcard(_args);

var _atom = require("./expression/atom");

var atoms = _interopRequireWildcard(_atom);

var _cast = require("./expression/cast");

var casts = _interopRequireWildcard(_cast);

var _binary = require("./expression/binary");

var binaries = _interopRequireWildcard(_binary);

var _literal = require("./expression/literal");

var literals = _interopRequireWildcard(_literal);

var _expression = require("./expression");

var expressions = _interopRequireWildcard(_expression);

var _branch = require("./branch");

var branches = _interopRequireWildcard(_branch);

var _guard = require("./branch/guard");

var guards = _interopRequireWildcard(_guard);

var _if = require("./branch/if");

var ifelse = _interopRequireWildcard(_if);

var _pseudo = require("./branch/pseudo");

var pseudos = _interopRequireWildcard(_pseudo);

var _switch = require("./branch/switch");

var switches = _interopRequireWildcard(_switch);

var _loop = require("./loop");

var loops = _interopRequireWildcard(_loop);

var _type = require("./type");

var types = _interopRequireWildcard(_type);

var _statement = require("./statement");

var statements = _interopRequireWildcard(_statement);

var _struct = require("./declare/struct");

var structs = _interopRequireWildcard(_struct);

var _class = require("./declare/class");

var classes = _interopRequireWildcard(_class);

var _import = require("./declare/import");

var imports = _interopRequireWildcard(_import);

var _function = require("./declare/function");

var functions = _interopRequireWildcard(_function);

var _protocol = require("./declare/protocol");

var protocols = _interopRequireWildcard(_protocol);

var _variable = require("./declare/variable");

var variables = _interopRequireWildcard(_variable);

var _operator = require("./declare/operator");

var operators = _interopRequireWildcard(_operator);

var _extension = require("./declare/extension");

var extensions = _interopRequireWildcard(_extension);

var _declare = require("./declare");

var declarations = _interopRequireWildcard(_declare);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Parser methods */


/** Expressions */


/** Branches */


/** Globals */


/** Declarations */


/**
 * @class Parser
 * @export
 */

var Parser =

/** @constructor */
function Parser() {
  _classCallCheck(this, Parser);

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
   * Inside ternary expr
   * @type {Boolean}
   */
  this.inTernary = false;
};

exports.default = Parser;


(0, _utils.inherit)(Parser, parse);

(0, _utils.inherit)(Parser, args);
(0, _utils.inherit)(Parser, casts);
(0, _utils.inherit)(Parser, atoms);
(0, _utils.inherit)(Parser, binaries);
(0, _utils.inherit)(Parser, literals);
(0, _utils.inherit)(Parser, expressions);

(0, _utils.inherit)(Parser, guards);
(0, _utils.inherit)(Parser, ifelse);
(0, _utils.inherit)(Parser, pseudos);
(0, _utils.inherit)(Parser, switches);
(0, _utils.inherit)(Parser, branches);

(0, _utils.inherit)(Parser, loops);
(0, _utils.inherit)(Parser, types);
(0, _utils.inherit)(Parser, branches);
(0, _utils.inherit)(Parser, statements);

(0, _utils.inherit)(Parser, imports);
(0, _utils.inherit)(Parser, classes);
(0, _utils.inherit)(Parser, structs);
(0, _utils.inherit)(Parser, protocols);
(0, _utils.inherit)(Parser, functions);
(0, _utils.inherit)(Parser, variables);
(0, _utils.inherit)(Parser, operators);
(0, _utils.inherit)(Parser, extensions);
(0, _utils.inherit)(Parser, declarations);

},{"../utils":42,"./branch":10,"./branch/guard":8,"./branch/if":9,"./branch/pseudo":11,"./branch/switch":12,"./declare":17,"./declare/class":13,"./declare/extension":14,"./declare/function":15,"./declare/import":16,"./declare/operator":18,"./declare/protocol":19,"./declare/struct":20,"./declare/variable":21,"./expression":26,"./expression/args":22,"./expression/atom":23,"./expression/binary":24,"./expression/cast":25,"./expression/literal":27,"./loop":29,"./parse":30,"./statement":31,"./type":32}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLoopStatement = parseLoopStatement;
exports.parseFor = parseFor;
exports.parseForInLoop = parseForInLoop;
exports.parseDefaultForLoop = parseDefaultForLoop;
exports.parseWhile = parseWhile;
exports.parseRepeat = parseRepeat;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  [ ] for
  [ ] while
  [ ] repeat
  @return {Node}
*/
function parseLoopStatement() {

  switch (this.current.name) {
    case _labels.TokenList.FOR:
      return this.parseFor();
      break;
    case _labels.TokenList.WHILE:
      return this.parseWhile();
      break;
    case _labels.TokenList.REPEAT:
      return this.parseRepeat();
      break;
  };

  return null;
}

/**
 * @return {Node}
 */
function parseFor() {

  var node = new _nodes2.default.ForStatement();

  var init = null;

  this.expect(_labels.TokenList.FOR);

  this.eat(_labels.TokenList.LPAREN);

  if (!this.eat(_labels.TokenList.SEMICOLON)) {
    init = this.parseExpressionStatement();
  }

  /** for ex in ex */
  if (this.eat(_labels.TokenList.IN)) {
    node = new _nodes2.default.ForInStatement();
    this.parseForInLoop(node);
    /** for ex;ex;ex */
  } else {
      this.parseDefaultForLoop(node);
    }

  node.init = init;

  this.eat(_labels.TokenList.RPAREN);

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

function parseForInLoop(node) {

  node.expression = this.parseExpressionStatement();
}

function parseDefaultForLoop(node) {

  node.test = this.parseExpressionStatement();
  this.expect(_labels.TokenList.SEMICOLON);
  node.update = this.parseExpressionStatement();
}

/**
 * @return {Node}
 */
function parseWhile() {

  var node = new _nodes2.default.WhileStatement();

  this.expect(_labels.TokenList.WHILE);

  this.eat(_labels.TokenList.LPAREN);
  node.test = this.parseExpressionStatement();
  this.eat(_labels.TokenList.RPAREN);

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

/**
 * @return {Node}
 */
function parseRepeat() {

  var node = new _nodes2.default.RepeatStatement();

  this.expect(_labels.TokenList.REPEAT);

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  this.expect(_labels.TokenList.WHILE);

  this.eat(_labels.TokenList.LPAREN);
  node.test = this.parseExpressionStatement();
  this.eat(_labels.TokenList.RPAREN);

  return node;
}

},{"../labels":38,"../nodes":39,"../utils":42}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = extract;
exports.eat = eat;
exports.peek = peek;
exports.next = next;
exports.back = back;
exports.expect = expect;
exports.reset = reset;
exports.parseProgram = parseProgram;
exports.parseBlock = parseBlock;
exports.parse = parse;
exports.acceptPrecedence = acceptPrecedence;
exports.isOperator = isOperator;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extract
 * @param  {Number} kind
 * @return {Boolean}
 */
function extract(kind) {
  var tmp = null;
  if (this.peek(kind)) {
    tmp = this.current;
    this.expect(kind);
    return tmp;
  }
  return tmp;
}

/**
 * Eat
 * @param  {Number} kind
 * @return {Boolean}
 */
function eat(kind) {
  if (this.peek(kind)) {
    this.next();
    return true;
  }
  return false;
}

/**
 * Peek
 * @param  {Number} name
 * @return {Boolean}
 */
function peek(name) {
  return this.current !== void 0 && this.current.name === name;
}

/**
 * Next token
 * @return {Boolean}
 */
function next() {
  if (this.index < this.tokens.length) {
    this.index++;
    this.previous = this.current;
    this.current = this.tokens[this.index];
    return true;
  }
  return false;
}

/**
 * Previous token
 * @return {Boolean}
 */
function back() {
  if (this.index < this.tokens.length) {
    this.index--;
    this.previous = this.current;
    this.current = this.tokens[this.index];
    return true;
  }
  return false;
}

/**
 * Expect token
 * @param  {Number} kind
 * @return {Boolean}
 */
function expect(kind) {
  if (!this.peek(kind)) {
    if (this.current !== void 0) {
      var loc = this.current.loc;
      throw new Error("Expected " + (0, _utils.getNameByLabel)(kind) + " but got " + (0, _utils.getNameByLabel)(this.current.name) + " in " + loc.start.line + ":" + loc.end.column);
    }
    return false;
  }
  this.next();
  return true;
}

/**
 * Reset
 * @param {Array} tokens
 */
function reset(tokens) {
  this.index = 0;
  this.tokens = tokens;
  this.previous = this.current = this.tokens[this.index];
}

/**
 * @return {Node}
 */
function parseProgram() {

  var node = new _nodes2.default.Program();

  if (this.current === void 0) return node;

  node.body = this.parseBlock();

  return node;
}

/**
 * @return {Node}
 */
function parseBlock() {

  var node = new _nodes2.default.BlockStatement();
  var statement = null;

  while ((statement = this.parseStatement()) !== null) {
    node.body.push(statement);
    if (this.current === void 0) break;
  };

  return node;
}

/**
 * @return {Node}
 */
function parse(tokens) {
  this.reset(tokens);
  return this.parseProgram();
}

/**
 * Accept precedence
 * @param  {Object}  token
 * @param  {Number}  state
 * @return {Boolean}
 */
function acceptPrecedence(state) {
  if (state !== void 0 && this.current) {
    /** Custom operator */
    if ((0, _utils.getNameByLabel)(this.current.name) === "Identifier") {
      return _labels.TokenList[state.op] === _labels.TokenList[this.current.value];
    }
    return _labels.TokenList[state.op] === this.current.name;
  }
  return false;
}

/**
 * @param  {Number}  name
 * @return {Boolean}
 */
function isOperator(name) {
  return (0, _utils.getNameByLabel)(name) in _labels.Operators;
}

},{"../labels":38,"../nodes":39,"../utils":42}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseStatement = parseStatement;
exports.parseReturnStatement = parseReturnStatement;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseStatement() {

  var node = null;

  switch (this.current.name) {
    /** Loop statement */
    case _labels.TokenList.FOR:
    case _labels.TokenList.WHILE:
    case _labels.TokenList.REPEAT:
      node = this.parseLoopStatement();
      break;
    /** Branch statement */
    case _labels.TokenList.IF:
    case _labels.TokenList.GUARD:
    case _labels.TokenList.SWITCH:
    case _labels.TokenList.GET:
    case _labels.TokenList.SET:
    case _labels.TokenList.WILLSET:
    case _labels.TokenList.DIDSET:
      node = this.parseBranchStatement();
      break;
    /** Defer statement */
    case _labels.TokenList.DEFER:
      node = this.parseDeferStatement();
      break;
    /** Return statement */
    case _labels.TokenList.RETURN:
      node = this.parseReturnStatement();
      break;
    /** Do statement */
    case _labels.TokenList.DO:
      node = this.parseDoStatement();
      break;
    /** Declaration statement */
    case _labels.TokenList.IMPORT:
    case _labels.TokenList.CONST:
    case _labels.TokenList.VAR:
    case _labels.TokenList.TYPEALIAS:
    case _labels.TokenList.FUNCTION:
    case _labels.TokenList.ENUM:
    case _labels.TokenList.STRUCT:
    case _labels.TokenList.CLASS:
    case _labels.TokenList.INIT:
    case _labels.TokenList.PROTOCOL:
    case _labels.TokenList.EXTENSION:
    case _labels.TokenList.OPERATOR:
    case _labels.TokenList.POSTFIX:
    case _labels.TokenList.PREFIX:
    case _labels.TokenList.INFIX:
      node = this.parseDeclarationStatement();
      break;
    /** Expression statement */
    default:
      node = this.parseExpressionStatement();
      break;
  };

  this.eat(_labels.TokenList.SEMICOLON);

  return node;
}

/**
 * @return {Node}
 */
function parseReturnStatement() {

  var node = new _nodes2.default.ReturnStatement();

  this.expect(_labels.TokenList.RETURN);

  node.argument = this.parseExpressionStatement();

  return node;
}

},{"../labels":38,"../nodes":39}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseStrictType = parseStrictType;
exports.parseType = parseType;
exports.isNativeType = isNativeType;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  [x] tuple
  [x] type
*/
function parseStrictType(base) {

  var node = new _nodes2.default.Parameter();

  if (this.eat(_labels.TokenList.COLON)) {
    this.eat(_labels.TokenList.INOUT);
    node.init = base;
    if (this.isNativeType(this.current.name)) {
      node.argument = this.parseType();
    } else {
      node.argument = this.parseExpressionStatement();
    }
  } else if (this.eat(_labels.TokenList.ARROW)) {
    if (this.peek(_labels.TokenList.LPAREN)) {
      node = this.parseExpressionStatement();
    } else {
      node = this.parseType();
    }
  }

  return node;
}

function parseType() {

  var node = new _nodes2.default.TypeAnnotation();

  node.type = this.current.name;

  this.next();

  return node;
}

/**
 * @param  {Number}  type
 * @return {Boolean}
 */
function isNativeType(type) {
  switch (type) {
    case _labels.TokenList.VOID:
    case _labels.TokenList.INT:
    case _labels.TokenList.INT8:
    case _labels.TokenList.UINT8:
    case _labels.TokenList.INT32:
    case _labels.TokenList.INT64:
    case _labels.TokenList.UINT64:
    case _labels.TokenList.DOUBLE:
    case _labels.TokenList.FLOAT:
    case _labels.TokenList.BOOLEAN:
    case _labels.TokenList.STRING:
    case _labels.TokenList.CHARACTER:
      return true;
      break;
    default:
      return false;
      break;
  };
}

},{"../labels":38,"../nodes":39,"../utils":42}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Character = exports.Character = {
  fromCodePoint: function fromCodePoint(cp) {
    return cp < 0x10000 ? String.fromCharCode(cp) : String.fromCharCode(0xD800 + (cp - 0x10000 >> 10)) + String.fromCharCode(0xDC00 + (cp - 0x10000 & 1023));
  },
  isWhiteSpace: function isWhiteSpace(cp) {
    return cp === 0x20 || cp === 0x09 || cp === 0x0B || cp === 0x0C || cp === 0xA0 || cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0;
  },
  isLineTerminator: function isLineTerminator(cp) {
    return cp === 0x0A || cp === 0x0D || cp === 0x2028 || cp === 0x2029;
  },
  isIdentifierStart: function isIdentifierStart(cp) {
    return cp === 0x24 || cp === 0x5F || // $ (dollar) and _ (underscore)
    cp >= 0x41 && cp <= 0x5A || // A..Z
    cp >= 0x61 && cp <= 0x7A || // a..z
    cp === 0x5C;
  },
  isIdentifierPart: function isIdentifierPart(cp) {
    return cp === 0x24 || cp === 0x5F || // $ (dollar) and _ (underscore)
    cp >= 0x41 && cp <= 0x5A || // A..Z
    cp >= 0x61 && cp <= 0x7A || // a..z
    cp >= 0x30 && cp <= 0x39 || // 0..9
    cp === 0x5C;
  },
  isDecimalDigit: function isDecimalDigit(cp) {
    return cp >= 0x30 && cp <= 0x39; // 0..9
  },
  isHexDigit: function isHexDigit(cp) {
    return cp >= 0x30 && cp <= 0x39 || // 0..9
    cp >= 0x41 && cp <= 0x48 || // A..H
    cp >= 0x61 && cp <= 0x68; // a..h
  },
  isOctalDigit: function isOctalDigit(cp) {
    return cp >= 0x30 && cp <= 0x37; // 0..7
  }
};

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _scanner = require("./scanner");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tokenizer = function () {

  /** @constructor */

  function Tokenizer() {
    _classCallCheck(this, Tokenizer);
  }

  _createClass(Tokenizer, [{
    key: "scan",
    value: function scan(code, opts) {
      return (0, _scanner.tokenize)(code, { loc: true });
    }
  }]);

  return Tokenizer;
}();

exports.default = Tokenizer;

},{"./scanner":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenize = exports.Scanner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _char = require('./char');

var _labels = require('../labels');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scanner = exports.Scanner = function () {

  /** @constructor */

  function Scanner(code, config) {
    _classCallCheck(this, Scanner);
  }

  _createClass(Scanner, [{
    key: 'assert',
    value: function assert(condition, message) {
      if (!condition) {
        throw new Error('ASSERT: ' + message);
      }
    }
  }, {
    key: 'isDecimalDigit',
    value: function isDecimalDigit(ch) {
      return ch >= 0x30 && ch <= 0x39 || ch === 0x5f; // 0._.9
    }
  }, {
    key: 'isHexDigit',
    value: function isHexDigit(ch) {
      return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }
  }, {
    key: 'isOctalDigit',
    value: function isOctalDigit(ch) {
      return '01234567'.indexOf(ch) >= 0;
    }
  }, {
    key: 'octalToDecimal',
    value: function octalToDecimal(ch) {

      var octal = ch !== '0',
          code = '01234567'.indexOf(ch);

      if (index < length && this.isOctalDigit(source[index])) {
        octal = true;
        code = code * 8 + '01234567'.indexOf(source[index++]);

        if ('0123'.indexOf(ch) >= 0 && index < length && this.isOctalDigit(source[index])) {
          code = code * 8 + '01234567'.indexOf(source[index++]);
        }
      }

      return {
        code: code,
        octal: octal
      };
    }
  }, {
    key: 'isWhiteSpace',
    value: function isWhiteSpace(ch) {
      return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 || ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0;
    }
  }, {
    key: 'isLineTerminator',
    value: function isLineTerminator(ch) {
      return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }
  }, {
    key: 'fromCodePoint',
    value: function fromCodePoint(cp) {
      return cp < 0x10000 ? String.fromCharCode(cp) : String.fromCharCode(0xD800 + (cp - 0x10000 >> 10)) + String.fromCharCode(0xDC00 + (cp - 0x10000 & 1023));
    }
  }, {
    key: 'isIdentifierStart',
    value: function isIdentifierStart(ch) {
      return ch === 0x24 || ch === 0x5F || // $ (dollar) and _ (underscore)
      ch >= 0x41 && ch <= 0x5A || // A..Z
      ch >= 0x61 && ch <= 0x7A || // a..z
      ch === 0x5C;
    }
  }, {
    key: 'isIdentifierPart',
    value: function isIdentifierPart(ch) {
      return ch === 0x24 || ch === 0x5F || // $ (dollar) and _ (underscore)
      ch >= 0x41 && ch <= 0x5A || // A..Z
      ch >= 0x61 && ch <= 0x7A || // a..z
      ch >= 0x30 && ch <= 0x39 || // 0..9
      ch === 0x5C;
    }
  }, {
    key: 'isKeyword',
    value: function isKeyword(id) {
      return _labels.TokenList[id] !== void 0;
    }
  }]);

  return Scanner;
}();

var PlaceHolders, Messages, Regex, source, strict, index, lineNumber, lineStart, hasLineTerminator, lastIndex, lastLineNumber, lastLineStart, startIndex, startLineNumber, startLineStart, scanning, length, lookahead, state, extra, isBindingElement, isAssignmentTarget, firstCoverInitializedNameError;

PlaceHolders = {
  ArrowParameterPlaceHolder: 'ArrowParameterPlaceHolder'
};

// Ensure the condition is true, otherwise throw an error.
// This is only to have a better contract semantic, i.e. another safety net
// to catch a logic error. The condition shall be fulfilled in normal case.
// Do NOT use this to enforce a certain condition on any user input.

function assert(condition, message) {
  /* istanbul ignore if */
  if (!condition) {
    throw new Error('ASSERT: ' + message);
  }
}

function isDecimalDigit(ch) {
  return ch >= 0x30 && ch <= 0x39 || ch === 0x5f; // 0._.9
}

function isHexDigit(ch) {
  return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
}

function isOctalDigit(ch) {
  return '01234567'.indexOf(ch) >= 0;
}

function octalToDecimal(ch) {
  // \0 is not octal escape sequence
  var octal = ch !== '0',
      code = '01234567'.indexOf(ch);

  if (index < length && isOctalDigit(source[index])) {
    octal = true;
    code = code * 8 + '01234567'.indexOf(source[index++]);

    // 3 digits are only allowed when string starts
    // with 0, 1, 2, 3
    if ('0123'.indexOf(ch) >= 0 && index < length && isOctalDigit(source[index])) {
      code = code * 8 + '01234567'.indexOf(source[index++]);
    }
  }

  return {
    code: code,
    octal: octal
  };
}

// ECMA-262 11.2 White Space

function isWhiteSpace(ch) {
  return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 || ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0;
}

// ECMA-262 11.3 Line Terminators

function isLineTerminator(ch) {
  return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
}

// ECMA-262 11.6 Identifier Names and Identifiers

function fromCodePoint(cp) {
  return cp < 0x10000 ? String.fromCharCode(cp) : String.fromCharCode(0xD800 + (cp - 0x10000 >> 10)) + String.fromCharCode(0xDC00 + (cp - 0x10000 & 1023));
}

function isIdentifierStart(ch) {
  return ch === 0x24 || ch === 0x5F || // $ (dollar) and _ (underscore)
  ch >= 0x41 && ch <= 0x5A || // A..Z
  ch >= 0x61 && ch <= 0x7A || // a..z
  ch === 0x5C;
}

function isIdentifierPart(ch) {
  return ch === 0x24 || ch === 0x5F || // $ (dollar) and _ (underscore)
  ch >= 0x41 && ch <= 0x5A || // A..Z
  ch >= 0x61 && ch <= 0x7A || // a..z
  ch >= 0x30 && ch <= 0x39 || // 0..9
  ch === 0x5C;
}

// ECMA-262 11.6.2.1 Keywords

function isKeyword(id) {
  return _labels.TokenList[id] !== void 0;
}

// ECMA-262 11.4 Comments

function addComment(type, value, start, end, loc) {
  var comment;

  assert(typeof start === 'number', 'Comment must have valid position');

  state.lastCommentStart = start;

  comment = {
    type: type,
    value: value
  };
  if (extra.range) {
    comment.range = [start, end];
  }
  if (extra.loc) {
    comment.loc = loc;
  }
  extra.comments.push(comment);
  if (extra.attachComment) {
    extra.leadingComments.push(comment);
    extra.trailingComments.push(comment);
  }
  if (extra.tokenize) {
    comment.type = comment.type + 'Comment';
    if (extra.delegate) {
      comment = extra.delegate(comment);
    }
    extra.tokens.push(comment);
  }
}

function skipSingleLineComment(offset) {
  var start, loc, ch, comment;

  start = index - offset;
  loc = {
    start: {
      line: lineNumber,
      column: index - lineStart - offset
    }
  };

  while (index < length) {
    ch = source.charCodeAt(index);
    ++index;
    if (isLineTerminator(ch)) {
      hasLineTerminator = true;
      if (extra.comments) {
        comment = source.slice(start + offset, index - 1);
        loc.end = {
          line: lineNumber,
          column: index - lineStart - 1
        };
        addComment('Line', comment, start, index - 1, loc);
      }
      if (ch === 13 && source.charCodeAt(index) === 10) {
        ++index;
      }
      ++lineNumber;
      lineStart = index;
      return;
    }
  }

  if (extra.comments) {
    comment = source.slice(start + offset, index);
    loc.end = {
      line: lineNumber,
      column: index - lineStart
    };
    addComment('Line', comment, start, index, loc);
  }
}

function skipMultiLineComment() {
  var start, loc, ch, comment;

  if (extra.comments) {
    start = index - 2;
    loc = {
      start: {
        line: lineNumber,
        column: index - lineStart - 2
      }
    };
  }

  while (index < length) {
    ch = source.charCodeAt(index);
    if (isLineTerminator(ch)) {
      if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
        ++index;
      }
      hasLineTerminator = true;
      ++lineNumber;
      ++index;
      lineStart = index;
    } else if (ch === 0x2A) {
      // Block comment ends with '*/'.
      if (source.charCodeAt(index + 1) === 0x2F) {
        ++index;
        ++index;
        if (extra.comments) {
          comment = source.slice(start + 2, index - 2);
          loc.end = {
            line: lineNumber,
            column: index - lineStart
          };
          addComment('Block', comment, start, index, loc);
        }
        return;
      }
      ++index;
    } else {
      ++index;
    }
  }

  // Ran off the end of the file - the whole thing is a comment
  if (extra.comments) {
    loc.end = {
      line: lineNumber,
      column: index - lineStart
    };
    comment = source.slice(start + 2, index);
    addComment('Block', comment, start, index, loc);
  }
  tolerateUnexpectedToken();
}

function skipComment() {
  var ch, start;
  hasLineTerminator = false;

  start = index === 0;
  while (index < length) {
    ch = source.charCodeAt(index);

    if (isWhiteSpace(ch)) {
      ++index;
    } else if (isLineTerminator(ch)) {
      hasLineTerminator = true;
      ++index;
      if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
        ++index;
      }
      ++lineNumber;
      lineStart = index;
      start = true;
    } else if (ch === 0x2F) {
      // U+002F is '/'
      ch = source.charCodeAt(index + 1);
      if (ch === 0x2F) {
        ++index;
        ++index;
        skipSingleLineComment(2);
        start = true;
      } else if (ch === 0x2A) {
        // U+002A is '*'
        ++index;
        ++index;
        skipMultiLineComment();
      } else {
        break;
      }
    } else if (start && ch === 0x2D) {
      // U+002D is '-'
      // U+003E is '>'
      if (source.charCodeAt(index + 1) === 0x2D && source.charCodeAt(index + 2) === 0x3E) {
        // '-->' is a single-line comment
        index += 3;
        skipSingleLineComment(3);
      } else {
        break;
      }
    } else if (ch === 0x3C) {
      // U+003C is '<'
      if (source.slice(index + 1, index + 4) === '!--') {
        ++index; // `<`
        ++index; // `!`
        ++index; // `-`
        ++index; // `-`
        skipSingleLineComment(4);
      } else {
        break;
      }
    } else {
      break;
    }
  }
}

function scanHexEscape(prefix) {
  var i,
      len,
      ch,
      code = 0;

  len = prefix === 'u' ? 4 : 2;
  for (i = 0; i < len; ++i) {
    if (index < length && isHexDigit(source[index])) {
      ch = source[index++];
      code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
    } else {
      return '';
    }
  }
  return String.fromCharCode(code);
}

function scanUnicodeCodePointEscape() {
  var ch, code;

  ch = source[index];
  code = 0;

  // At least, one hex digit is required.
  if (ch === '}') {
    throwUnexpectedToken();
  }

  while (index < length) {
    ch = source[index++];
    if (!isHexDigit(ch)) {
      break;
    }
    code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
  }

  if (code > 0x10FFFF || ch !== '}') {
    throwUnexpectedToken();
  }

  return fromCodePoint(code);
}

function codePointAt(i) {
  var cp, first, second;

  cp = source.charCodeAt(i);
  if (cp >= 0xD800 && cp <= 0xDBFF) {
    second = source.charCodeAt(i + 1);
    if (second >= 0xDC00 && second <= 0xDFFF) {
      first = cp;
      cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
    }
  }

  return cp;
}

function getComplexIdentifier() {
  var cp, ch, id;

  cp = codePointAt(index);
  id = fromCodePoint(cp);
  index += id.length;

  // '\u' (U+005C, U+0075) denotes an escaped character.
  if (cp === 0x5C) {
    if (source.charCodeAt(index) !== 0x75) {
      throwUnexpectedToken();
    }
    ++index;
    if (source[index] === '{') {
      ++index;
      ch = scanUnicodeCodePointEscape();
    } else {
      ch = scanHexEscape('u');
      cp = ch.charCodeAt(0);
      if (!ch || ch === '\\' || !isIdentifierStart(cp)) {
        throwUnexpectedToken();
      }
    }
    id = ch;
  }

  while (index < length) {
    cp = codePointAt(index);
    if (!isIdentifierPart(cp)) {
      break;
    }
    ch = fromCodePoint(cp);
    id += ch;
    index += ch.length;

    // '\u' (U+005C, U+0075) denotes an escaped character.
    if (cp === 0x5C) {
      id = id.substr(0, id.length - 1);
      if (source.charCodeAt(index) !== 0x75) {
        throwUnexpectedToken();
      }
      ++index;
      if (source[index] === '{') {
        ++index;
        ch = scanUnicodeCodePointEscape();
      } else {
        ch = scanHexEscape('u');
        cp = ch.charCodeAt(0);
        if (!ch || ch === '\\' || !isIdentifierPart(cp)) {
          throwUnexpectedToken();
        }
      }
      id += ch;
    }
  }

  return id;
}

function getIdentifier() {
  var start, ch;

  start = index++;
  while (index < length) {
    ch = source.charCodeAt(index);
    if (ch === 0x5C) {
      // Blackslash (U+005C) marks Unicode escape sequence.
      index = start;
      return getComplexIdentifier();
    } else if (ch >= 0xD800 && ch < 0xDFFF) {
      // Need to handle surrogate pairs.
      index = start;
      return getComplexIdentifier();
    }
    if (isIdentifierPart(ch)) {
      ++index;
    } else {
      break;
    }
  }

  return source.slice(start, index);
}

function scanIdentifier() {
  var start, id, type;

  start = index;

  // Backslash (U+005C) starts an escaped character.
  id = source.charCodeAt(index) === 0x5C ? getComplexIdentifier() : getIdentifier();

  // There is no keyword or literal with only one character.
  // Thus, it must be an identifier.
  if (id.length === 1) {
    type = _labels.Token.Identifier;
  } else if (isKeyword(id)) {
    type = _labels.Token.Keyword;
  } else if (id === 'null') {
    type = _labels.Token.NullLiteral;
  } else if (id === 'true' || id === 'false') {
    type = _labels.Token.BooleanLiteral;
  } else {
    type = _labels.Token.Identifier;
  }

  return {
    type: type,
    value: id,
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

// ECMA-262 11.7 Punctuators

function scanPunctuator() {
  var token, str;

  token = {
    type: _labels.Token.Punctuator,
    value: '',
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: index,
    end: index
  };

  // Check for most common single-character punctuators.
  str = source[index];
  switch (str) {

    case '(':
      if (extra.tokenize) {
        extra.openParenToken = extra.tokenValues.length;
      }
      ++index;
      break;

    case '{':
      if (extra.tokenize) {
        extra.openCurlyToken = extra.tokenValues.length;
      }
      state.curlyStack.push('{');
      ++index;
      break;

    case '.':
      ++index;
      if (source[index] === '.' && source[index + 1] === '.') {
        // Spread operator: ...
        index += 2;
        str = '...';
      }
      break;

    case '}':
      ++index;
      state.curlyStack.pop();
      break;
    case ')':
    case ';':
    case ',':
    case '[':
    case ']':
    case ':':
    case '?':
    case '~':
      ++index;
      break;

    default:
      // 4-character punctuator.
      str = source.substr(index, 4);
      if (str === '>>>=') {
        index += 4;
      } else {
        // 3-character punctuators.
        str = str.substr(0, 3);
        if (str === '===' || str === '!==' || str === '>>>' || str === '<<=' || str === '>>=') {
          index += 3;
        } else {
          var org = str;
          // 2-character punctuators.
          str = str.substr(0, 2);
          if (_labels.TokenList[str] !== void 0 && Number.isInteger(_labels.TokenList[str])) {
            index += 2;
          } else {
            // 1-character punctuators.
            var tmp = source[index];
            if ('<>=!+-*%&|^/'.indexOf(tmp) >= 0) {
              ++index;
            }
            if (_labels.TokenList[str.trim()] === void 0) {
              token.type = _labels.Token.Identifier;
              str = org;
            } else {
              str = tmp;
            }
          }
        }
      }
      break;

  };

  if (index === token.start) {
    throwUnexpectedToken();
  }

  token.end = index;
  token.value = str;
  return token;
}

// ECMA-262 11.8.3 Numeric Literals

function scanHexLiteral(start) {
  var number = '';

  while (index < length) {
    if (!isHexDigit(source[index])) {
      break;
    }
    number += source[index++];
  }

  if (number.length === 0) {
    throwUnexpectedToken();
  }

  if (isIdentifierStart(source.charCodeAt(index))) {
    throwUnexpectedToken();
  }

  return {
    type: _labels.Token.NumericLiteral,
    value: parseInt('0x' + number, 16),
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

function scanBinaryLiteral(start) {
  var ch, number;

  number = '';

  while (index < length) {
    ch = source[index];
    if (ch !== '0' && ch !== '1') {
      break;
    }
    number += source[index++];
  }

  if (number.length === 0) {
    // only 0b or 0B
    throwUnexpectedToken();
  }

  if (index < length) {
    ch = source.charCodeAt(index);
    /* istanbul ignore else */
    if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
      throwUnexpectedToken();
    }
  }

  return {
    type: _labels.Token.NumericLiteral,
    value: parseInt(number, 2),
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

function scanOctalLiteral(prefix, start) {
  var number, octal;

  if (isOctalDigit(prefix)) {
    octal = true;
    number = '0' + source[index++];
  } else {
    octal = false;
    ++index;
    number = '';
  }

  while (index < length) {
    if (!isOctalDigit(source[index])) {
      break;
    }
    number += source[index++];
  }

  if (!octal && number.length === 0) {
    // only 0o or 0O
    throwUnexpectedToken();
  }

  if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
    throwUnexpectedToken();
  }

  return {
    type: _labels.Token.NumericLiteral,
    value: parseInt(number, 8),
    octal: octal,
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

function isImplicitOctalLiteral() {
  var i, ch;

  // Implicit octal, unless there is a non-octal digit.
  // (Annex B.1.1 on Numeric Literals)
  for (i = index + 1; i < length; ++i) {
    ch = source[i];
    if (ch === '8' || ch === '9') {
      return false;
    }
    if (!isOctalDigit(ch)) {
      return true;
    }
  }

  return true;
}

function scanNumericLiteral() {
  var number, start, ch;

  ch = source[index];
  assert(isDecimalDigit(ch.charCodeAt(0)) || ch === '.', 'Numeric literal must start with a decimal digit or a decimal point');

  start = index;
  number = '';
  if (ch !== '.') {
    number = source[index++];
    ch = source[index];

    // Hex number starts with '0x'.
    // Octal number starts with '0'.
    // Octal number in ES6 starts with '0o'.
    // Binary number in ES6 starts with '0b'.
    if (number === '0') {
      if (ch === 'x' || ch === 'X') {
        ++index;
        return scanHexLiteral(start);
      }
      if (ch === 'b' || ch === 'B') {
        ++index;
        return scanBinaryLiteral(start);
      }
      if (ch === 'o' || ch === 'O') {
        return scanOctalLiteral(ch, start);
      }

      if (isOctalDigit(ch)) {
        if (isImplicitOctalLiteral()) {
          return scanOctalLiteral(ch, start);
        }
      }
    }

    while (isDecimalDigit(source.charCodeAt(index))) {
      number += source[index++];
    }
    ch = source[index];
  }

  if (ch === '.' && !isIdentifierStart(source.charCodeAt(index + 1))) {
    number += source[index++];
    while (isDecimalDigit(source.charCodeAt(index))) {
      number += source[index++];
    }
    ch = source[index];
  }

  if (ch === 'e' || ch === 'E') {
    number += source[index++];

    ch = source[index];
    if (ch === '+' || ch === '-') {
      number += source[index++];
    }
    if (isDecimalDigit(source.charCodeAt(index))) {
      while (isDecimalDigit(source.charCodeAt(index))) {
        number += source[index++];
      }
    } else {
      throwUnexpectedToken();
    }
  }

  return {
    type: _labels.Token.NumericLiteral,
    value: parseFloat(number),
    lineNumber: lineNumber,
    lineStart: lineStart,
    start: start,
    end: index
  };
}

// ECMA-262 11.8.4 String Literals

function scanStringLiteral() {
  var str = '',
      quote,
      start,
      ch,
      unescaped,
      octToDec,
      octal = false;

  quote = source[index];
  assert(quote === '\'' || quote === '"', 'String literal must starts with a quote');

  start = index;
  ++index;

  while (index < length) {
    ch = source[index++];

    if (ch === quote) {
      quote = '';
      break;
    } else if (ch === '\\') {
      ch = source[index++];
      if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
        switch (ch) {
          case 'u':
          case 'x':
            if (source[index] === '{') {
              ++index;
              str += scanUnicodeCodePointEscape();
            } else {
              unescaped = scanHexEscape(ch);
              if (!unescaped) {
                throw throwUnexpectedToken();
              }
              str += unescaped;
            }
            break;
          case 'n':
            str += '\n';
            break;
          case 'r':
            str += '\r';
            break;
          case 't':
            str += '\t';
            break;
          case 'b':
            str += '\b';
            break;
          case 'f':
            str += '\f';
            break;
          case 'v':
            str += '\x0B';
            break;
          case '8':
          case '9':
            str += ch;
            tolerateUnexpectedToken();
            break;

          default:
            if (isOctalDigit(ch)) {
              octToDec = octalToDecimal(ch);

              octal = octToDec.octal || octal;
              str += String.fromCharCode(octToDec.code);
            } else {
              str += ch;
            }
            break;
        }
      } else {
        ++lineNumber;
        if (ch === '\r' && source[index] === '\n') {
          ++index;
        }
        lineStart = index;
      }
    } else if (isLineTerminator(ch.charCodeAt(0))) {
      break;
    } else {
      str += ch;
    }
  }

  if (quote !== '') {
    index = start;
    throwUnexpectedToken();
  }

  return {
    type: _labels.Token.StringLiteral,
    value: str,
    octal: octal,
    lineNumber: startLineNumber,
    lineStart: startLineStart,
    start: start,
    end: index
  };
}

function isIdentifierName(token) {
  return token.type === _labels.Token.Identifier || token.type === _labels.Token.Keyword || token.type === _labels.Token.BooleanLiteral || token.type === _labels.Token.NullLiteral;
}

function advance() {
  var cp, token;

  if (index >= length) {
    return {
      type: _labels.Token.EOF,
      lineNumber: lineNumber,
      lineStart: lineStart,
      start: index,
      end: index
    };
  }

  cp = source.charCodeAt(index);

  if (isIdentifierStart(cp)) {
    token = scanIdentifier();
    return token;
  }

  // Very common: ( and ) and ;
  if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
    return scanPunctuator();
  }

  // String literal starts with single quote (U+0027) or double quote (U+0022).
  if (cp === 0x27 || cp === 0x22) {
    return scanStringLiteral();
  }

  // Dot (.) U+002E can also start a floating-point number, hence the need
  // to check the next character.
  if (cp === 0x2E) {
    if (isDecimalDigit(source.charCodeAt(index + 1))) {
      return scanNumericLiteral();
    }
    return scanPunctuator();
  }

  if (isDecimalDigit(cp)) {
    return scanNumericLiteral();
  }

  // Possible identifier start in a surrogate pair.
  if (cp >= 0xD800 && cp < 0xDFFF) {
    cp = codePointAt(index);
    if (isIdentifierStart(cp)) {
      return scanIdentifier();
    }
  }

  return scanPunctuator();
}

function collectToken() {
  var loc, token, value, entry;

  loc = {
    start: {
      line: lineNumber,
      column: index - lineStart
    }
  };

  token = advance();
  loc.end = {
    line: lineNumber,
    column: index - lineStart
  };

  if (token.type !== _labels.Token.EOF) {
    value = source.slice(token.start, token.end);
    if (_labels.TokenList[token.value] !== void 0 && Number.isInteger(_labels.TokenList[token.value])) {
      entry = {
        name: _labels.TokenList[token.value],
        range: [token.start, token.end],
        loc: loc
      };
    } else {
      entry = {
        name: token.type,
        value: value,
        range: [token.start, token.end],
        loc: loc
      };
    }
    if (extra.tokenValues) {
      extra.tokenValues.push(entry.type === 'Punctuator' || entry.type === 'Keyword' ? entry.value : null);
    }
    if (extra.tokenize) {
      if (!extra.range) {
        delete entry.range;
      }
      if (!extra.loc) {
        delete entry.loc;
      }
      if (extra.delegate) {
        entry = extra.delegate(entry);
      }
    }
    extra.tokens.push(entry);
  }
  return token;
}

function lex() {
  var token;
  scanning = true;

  lastIndex = index;
  lastLineNumber = lineNumber;
  lastLineStart = lineStart;

  skipComment();

  token = lookahead;

  startIndex = index;
  startLineNumber = lineNumber;
  startLineStart = lineStart;

  lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
  scanning = false;
  return token;
}

function tokenize(code, options, delegate) {
  var toString, tokens;

  toString = String;
  if (typeof code !== 'string' && !(code instanceof String)) {
    code = toString(code);
  }

  source = code;
  index = 0;
  lineNumber = source.length > 0 ? 1 : 0;
  lineStart = 0;
  startIndex = index;
  startLineNumber = lineNumber;
  startLineStart = lineStart;
  length = source.length;
  lookahead = null;
  state = {
    allowIn: true,
    allowYield: true,
    labelSet: {},
    inFunctionBody: false,
    inIteration: false,
    inSwitch: false,
    lastCommentStart: -1,
    curlyStack: []
  };

  extra = {};

  // Options matching.
  options = options || {};

  // Of course we collect tokens here.
  options.tokens = true;
  extra.tokens = [];
  extra.tokenValues = [];
  extra.tokenize = true;
  extra.delegate = delegate;

  // The following two fields are necessary to compute the Regex tokens.
  extra.openParenToken = -1;
  extra.openCurlyToken = -1;

  extra.range = typeof options.range === 'boolean' && options.range;
  extra.loc = typeof options.loc === 'boolean' && options.loc;

  if (typeof options.comment === 'boolean' && options.comment) {
    extra.comments = [];
  }
  if (typeof options.tolerant === 'boolean' && options.tolerant) {
    extra.errors = [];
  }

  try {
    peek();
    if (lookahead.type === _labels.Token.EOF) {
      return extra.tokens;
    }

    lex();
    while (lookahead.type !== _labels.Token.EOF) {
      try {
        lex();
      } catch (lexError) {
        if (extra.errors) {
          recordError(lexError);
          // We have to break on the first error
          // to avoid infinite loops.
          break;
        } else {
          throw lexError;
        }
      }
    }

    tokens = extra.tokens;
    if (typeof extra.errors !== 'undefined') {
      tokens.errors = extra.errors;
    }
  } catch (e) {
    throw e;
  } finally {
    extra = {};
  }
  return tokens;
}

function peek() {
  scanning = true;

  skipComment();

  lastIndex = index;
  lastLineNumber = lineNumber;
  lastLineStart = lineStart;

  startIndex = index;
  startLineNumber = lineNumber;
  startLineStart = lineStart;

  lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
  scanning = false;
}

exports.tokenize = tokenize;

},{"../labels":38,"./char":33}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var VERSION = exports.VERSION = "0.0.1";

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.global = exports.compile = exports.evaluate = exports.generate = exports.tokenize = exports.parse = undefined;

var _Parser = require("./Parser");

var _Parser2 = _interopRequireDefault(_Parser);

var _Compiler = require("./Compiler");

var _Compiler2 = _interopRequireDefault(_Compiler);

var _Tokenizer = require("./Tokenizer");

var _Tokenizer2 = _interopRequireDefault(_Tokenizer);

var _global = require("./Environment/global");

var globals = _interopRequireWildcard(_global);

var _const = require("./const");

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parse = function parse(tokens) {
  var parser = new _Parser2.default();
  return parser.parse(tokens);
};

var tokenize = function tokenize(code, opts) {
  var tokenizer = new _Tokenizer2.default();
  return tokenizer.scan(code, opts);
};

var generate = function generate(ast, opts) {
  var compiler = new _Compiler2.default();
  return compiler.compile(ast, opts);
};

var global = {};
for (var key in globals) {
  if (globals.hasOwnProperty(key)) {
    global[key] = globals[key];
  }
}

var compile = function compile(src) {

  var tokens = null;
  var ast = null;
  var code = null;

  console.time("Generated in");

  tokens = tokenize(src);
  ast = parse(tokens);
  code = generate(ast, "JS");

  console.timeEnd("Generated in");

  return code;
};

var evaluate = function evaluate(code) {
  new Function("__global", code)(global);
};

(0, _utils.greet)();

exports.parse = parse;
exports.tokenize = tokenize;
exports.generate = generate;
exports.evaluate = evaluate;
exports.compile = compile;
exports.global = global;
exports.VERSION = _const.VERSION;


if (typeof window !== "undefined") {
  window.hevia = {
    parse: parse,
    tokenize: tokenize,
    generate: generate,
    global: global,
    evaluate: evaluate,
    compile: compile,
    VERSION: _const.VERSION
  };
}

},{"./Compiler":2,"./Environment/global":7,"./Parser":28,"./Tokenizer":34,"./const":36,"./utils":42}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Operators = exports.TokenList = exports.Token = exports.Types = undefined;
exports.registerTT = registerTT;

var _precedence = require("./precedence");

var Types = exports.Types = {}; /**
                                 * This file contains all shit, to
                                 * provide a clean & fast way, to compare
                                 * nodes and tokens in later steps
                                 */

var Token = exports.Token = {};
var TokenList = exports.TokenList = {};
var Operators = exports.Operators = {};

var ii = 0;

/** Types */
(function (Label) {

  Label[Label["Program"] = ++ii] = "Program";

  Label[Label["UnaryExpression"] = ++ii] = "UnaryExpression";
  Label[Label["MemberExpression"] = ++ii] = "MemberExpression";
  Label[Label["TernaryExpression"] = ++ii] = "TernaryExpression";
  Label[Label["BinaryExpression"] = ++ii] = "BinaryExpression";
  Label[Label["CallExpression"] = ++ii] = "CallExpression";
  Label[Label["ParameterExpression"] = ++ii] = "ParameterExpression";

  Label[Label["BlockStatement"] = ++ii] = "BlockStatement";
  Label[Label["ReturnStatement"] = ++ii] = "ReturnStatement";
  Label[Label["IfStatement"] = ++ii] = "IfStatement";
  Label[Label["ForStatement"] = ++ii] = "ForStatement";
  Label[Label["ForInStatement"] = ++ii] = "ForInStatement";
  Label[Label["WhileStatement"] = ++ii] = "WhileStatement";
  Label[Label["RepeatStatement"] = ++ii] = "RepeatStatement";
  Label[Label["ExpressionStatement"] = ++ii] = "ExpressionStatement";

  Label[Label["ExtensionDeclaration"] = ++ii] = "ExtensionDeclaration";
  Label[Label["ClassDeclaration"] = ++ii] = "ClassDeclaration";
  Label[Label["FunctionDeclaration"] = ++ii] = "FunctionDeclaration";
  Label[Label["VariableDeclaration"] = ++ii] = "VariableDeclaration";
  Label[Label["OperatorDeclaration"] = ++ii] = "OperatorDeclaration";
  Label[Label["InitializerDeclaration"] = ++ii] = "InitializerDeclaration";
  Label[Label["ArrayDeclaration"] = ++ii] = "ArrayDeclaration";

  Label[Label["PseudoProperty"] = ++ii] = "PseudoProperty";
  Label[Label["TypeAnnotation"] = ++ii] = "TypeAnnotation";
  Label[Label["Parameter"] = ++ii] = "Parameter";
  Label[Label["TypeCast"] = ++ii] = "TypeCast";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["Literal"] = ++ii] = "Literal";

  Label[Label["AssociativityExpression"] = ++ii] = "AssociativityExpression";
  Label[Label["PrecedenceExpression"] = ++ii] = "PrecedenceExpression";

  Label[Label["Tuple"] = ++ii] = "Tuple";
  Label[Label["TupleType"] = ++ii] = "TupleType";
})(Types);

/** Data types */
(function (Label) {

  Label[Label["EOF"] = ++ii] = "EOF";
  Label[Label["Keyword"] = ++ii] = "Keyword";
  Label[Label["Punctuator"] = ++ii] = "Punctuator";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["BooleanLiteral"] = ++ii] = "BooleanLiteral";
  Label[Label["NullLiteral"] = ++ii] = "NullLiteral";
  Label[Label["StringLiteral"] = ++ii] = "StringLiteral";
  Label[Label["NumericLiteral"] = ++ii] = "NumericLiteral";
})(Token);

/** Tokens */
(function (Label) {

  /** Punctuators */
  Label[Label["("] = ++ii] = "LPAREN";
  Label[Label[")"] = ++ii] = "RPAREN";
  Label[Label["["] = ++ii] = "LBRACK";
  Label[Label["]"] = ++ii] = "RBRACK";
  Label[Label["{"] = ++ii] = "LBRACE";
  Label[Label["}"] = ++ii] = "RBRACE";
  Label[Label[":"] = ++ii] = "COLON";
  Label[Label[","] = ++ii] = "COMMA";
  Label[Label[";"] = ++ii] = "SEMICOLON";
  Label[Label["."] = ++ii] = "PERIOD";
  Label[Label["?"] = ++ii] = "CONDITIONAL";
  Label[Label["$"] = ++ii] = "DOLLAR";
  Label[Label["@"] = ++ii] = "ATSIGN";
  Label[Label["_"] = ++ii] = "UL";
  Label[Label["#"] = ++ii] = "HASH";
  Label[Label["->"] = ++ii] = "ARROW";
  /** Literals */
  Label[Label["nil"] = ++ii] = "NULL";
  Label[Label["true"] = ++ii] = "TRUE";
  Label[Label["false"] = ++ii] = "FALSE";
  /** Declaration keywords */
  Label[Label["func"] = ++ii] = "FUNCTION";
  Label[Label["var"] = ++ii] = "VAR";
  Label[Label["let"] = ++ii] = "CONST";
  Label[Label["class"] = ++ii] = "CLASS";
  Label[Label["init"] = ++ii] = "INIT";
  Label[Label["enum"] = ++ii] = "ENUM";
  Label[Label["extension"] = ++ii] = "EXTENSION";
  Label[Label["import"] = ++ii] = "IMPORT";
  Label[Label["inout"] = ++ii] = "INOUT";
  Label[Label["internal"] = ++ii] = "INTERNAL";
  Label[Label["operator"] = ++ii] = "OPERATOR";
  Label[Label["private"] = ++ii] = "PRIVATE";
  Label[Label["public"] = ++ii] = "PUBLIC";
  Label[Label["protocol"] = ++ii] = "PROTOCOL";
  Label[Label["static"] = ++ii] = "STATIC";
  Label[Label["struct"] = ++ii] = "STRUCT";
  Label[Label["typealias"] = ++ii] = "TYPEALIAS";
  /** Statement keywords */
  Label[Label["break"] = ++ii] = "BREAK";
  Label[Label["case"] = ++ii] = "CASE";
  Label[Label["continue"] = ++ii] = "CONTINUE";
  Label[Label["do"] = ++ii] = "DO";
  Label[Label["else"] = ++ii] = "ELSE";
  Label[Label["for"] = ++ii] = "FOR";
  Label[Label["guard"] = ++ii] = "GUARD";
  Label[Label["if"] = ++ii] = "IF";
  Label[Label["in"] = ++ii] = "IN";
  Label[Label["repeat"] = ++ii] = "REPEAT";
  Label[Label["return"] = ++ii] = "RETURN";
  Label[Label["switch"] = ++ii] = "SWITCH";
  Label[Label["where"] = ++ii] = "WHERE";
  Label[Label["while"] = ++ii] = "WHILE";
  /** Expression keywords */
  Label[Label["as"] = ++ii] = "AS";
  Label[Label["is"] = ++ii] = "IS";
  Label[Label["catch"] = ++ii] = "CATCH";
  Label[Label["super"] = ++ii] = "SUPER";
  Label[Label["self"] = ++ii] = "SELF";
  Label[Label["throw"] = ++ii] = "THROW";
  Label[Label["throws"] = ++ii] = "THROWS";
  Label[Label["try"] = ++ii] = "TRY";
  Label[Label["get"] = ++ii] = "GET";
  Label[Label["set"] = ++ii] = "SET";
  Label[Label["willSet"] = ++ii] = "WILLSET";
  Label[Label["didSet"] = ++ii] = "DIDSET";
  /** Operator declaration */
  Label[Label["prefix"] = ++ii] = "PREFIX";
  Label[Label["postfix"] = ++ii] = "POSTFIX";
  Label[Label["infix"] = ++ii] = "INFIX";
  /** Associative */
  Label[Label["associativity"] = ++ii] = "ASSOCIATIVITY";
  /** Precedence clause */
  Label[Label["precedence"] = ++ii] = "PRECEDENCE";
  /** Types */
  Label[Label["Void"] = ++ii] = "VOID";
  Label[Label["Int"] = ++ii] = "INT";
  Label[Label["Int8"] = ++ii] = "INT8";
  Label[Label["UInt8"] = ++ii] = "UINT8";
  Label[Label["Int32"] = ++ii] = "INT32";
  Label[Label["Int64"] = ++ii] = "INT64";
  Label[Label["UInt64"] = ++ii] = "UINT64";
  Label[Label["Double"] = ++ii] = "DOUBLE";
  Label[Label["Float"] = ++ii] = "FLOAT";
  Label[Label["Bool"] = ++ii] = "BOOLEAN";
  Label[Label["String"] = ++ii] = "STRING";
  Label[Label["Character"] = ++ii] = "CHARACTER";
})(TokenList);

/** 
 * Auto generate
 * str access key
 * for token list
 */
(function () {
  var index = 0;
  var length = Object.keys(TokenList).length;
  while (index < length) {
    if (TokenList[index] !== void 0) {
      TokenList[TokenList[index]] = index;
    }
    ++index;
  };
})();

/**
 * Register TokenList entry
 * @param {String} name
 * @param {String} value
 */
function registerTT(name, value) {
  TokenList[TokenList[value] = ++ii] = name;
  TokenList[TokenList[ii]] = ii;
}

(0, _precedence.registerOperator)("=", 80, "right", "ASSIGN");

(0, _precedence.registerOperator)("!=", 130, "none", "NEQ");
(0, _precedence.registerOperator)("==", 130, "none", "EQ");
(0, _precedence.registerOperator)(">=", 130, "none", "GE");
(0, _precedence.registerOperator)("<=", 130, "none", "LE");
(0, _precedence.registerOperator)(">", 130, "none", "GT");
(0, _precedence.registerOperator)("<", 130, "none", "LT");

(0, _precedence.registerOperator)("&&", 120, "left", "AND");
(0, _precedence.registerOperator)("||", 110, "left", "OR");

(0, _precedence.registerOperator)("+=", 90, "right", "CMP_ADD");
(0, _precedence.registerOperator)("-=", 90, "right", "CMP_SUB");
(0, _precedence.registerOperator)("/=", 90, "right", "CMP_DIV");
(0, _precedence.registerOperator)("*=", 90, "right", "CMP_MUL");
(0, _precedence.registerOperator)("%=", 90, "right", "CMP_MOD");

(0, _precedence.registerOperator)("/", 150, "left", "DIV");
(0, _precedence.registerOperator)("*", 150, "left", "MUL");
(0, _precedence.registerOperator)("%", 150, "left", "MOD");

(0, _precedence.registerOperator)("-", 140, "left", "SUB");
(0, _precedence.registerOperator)("+", 140, "left", "ADD");

(0, _precedence.registerOperator)("&", 150, "left", "BIT_AND");

},{"./precedence":40}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _labels = require("./labels");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Node
 * @export
 */

var Node = function () {
  function Node() {
    _classCallCheck(this, Node);
  }

  _createClass(Node, null, [{
    key: "Program",
    get: function get() {
      return function Program() {
        _classCallCheck(this, Program);

        this.kind = _labels.Types.Program;
        this.body = [];
      };
    }
  }, {
    key: "AssociativityExpression",
    get: function get() {
      return function AssociativityExpression() {
        _classCallCheck(this, AssociativityExpression);

        this.kind = _labels.Types.AssociativityExpression;
        this.associativity = null;
      };
    }
  }, {
    key: "PrecedenceExpression",
    get: function get() {
      return function PrecedenceExpression() {
        _classCallCheck(this, PrecedenceExpression);

        this.kind = _labels.Types.PrecedenceExpression;
        this.level = -1;
      };
    }
  }, {
    key: "InitializerDeclaration",
    get: function get() {
      return function InitializerDeclaration() {
        _classCallCheck(this, InitializerDeclaration);

        this.kind = _labels.Types.InitializerDeclaration;
        this.arguments = [];
        this.body = [];
      };
    }
  }, {
    key: "OperatorDeclaration",
    get: function get() {
      return function OperatorDeclaration() {
        _classCallCheck(this, OperatorDeclaration);

        this.kind = _labels.Types.OperatorDeclaration;
        this.name = null;
        this.body = [];
      };
    }
  }, {
    key: "ClassDeclaration",
    get: function get() {
      return function ClassDeclaration() {
        _classCallCheck(this, ClassDeclaration);

        this.kind = _labels.Types.ClassDeclaration;
        this.name = null;
        this.extend = [];
        this.body = [];
      };
    }
  }, {
    key: "ExtensionDeclaration",
    get: function get() {
      return function ExtensionDeclaration() {
        _classCallCheck(this, ExtensionDeclaration);

        this.kind = _labels.Types.ExtensionDeclaration;
        this.argument = null;
        this.body = [];
      };
    }
  }, {
    key: "RepeatStatement",
    get: function get() {
      return function RepeatStatement() {
        _classCallCheck(this, RepeatStatement);

        this.kind = _labels.Types.RepeatStatement;
        this.test = null;
        this.body = [];
      };
    }
  }, {
    key: "WhileStatement",
    get: function get() {
      return function WhileStatement() {
        _classCallCheck(this, WhileStatement);

        this.kind = _labels.Types.WhileStatement;
        this.test = null;
        this.body = [];
      };
    }
  }, {
    key: "ForInStatement",
    get: function get() {
      return function ForInStatement() {
        _classCallCheck(this, ForInStatement);

        this.kind = _labels.Types.ForInStatement;
        this.init = null;
        this.expression = null;
        this.body = [];
      };
    }
  }, {
    key: "ForStatement",
    get: function get() {
      return function ForStatement() {
        _classCallCheck(this, ForStatement);

        this.kind = _labels.Types.ForStatement;
        this.init = null;
        this.test = null;
        this.update = null;
        this.body = [];
      };
    }
  }, {
    key: "ParameterExpression",
    get: function get() {
      return function ParameterExpression() {
        _classCallCheck(this, ParameterExpression);

        this.kind = _labels.Types.ParameterExpression;
        this.arguments = [];
      };
    }
  }, {
    key: "Parameter",
    get: function get() {
      return function Parameter() {
        _classCallCheck(this, Parameter);

        this.kind = _labels.Types.Parameter;
        this.label = null;
        this.argument = null;
        this.init = null;
      };
    }
  }, {
    key: "IfStatement",
    get: function get() {
      return function IfStatement() {
        _classCallCheck(this, IfStatement);

        this.kind = _labels.Types.IfStatement;
        this.condition = null;
        this.consequent = null;
        this.alternate = null;
      };
    }
  }, {
    key: "ReturnStatement",
    get: function get() {
      return function ReturnStatement() {
        _classCallCheck(this, ReturnStatement);

        this.kind = _labels.Types.ReturnStatement;
        this.argument = null;
      };
    }
  }, {
    key: "PseudoProperty",
    get: function get() {
      return function PseudoProperty() {
        _classCallCheck(this, PseudoProperty);

        this.kind = _labels.Types.PseudoProperty;
        this.name = null;
        this.arguments = [];
        this.body = [];
      };
    }
  }, {
    key: "BlockStatement",
    get: function get() {
      return function BlockStatement() {
        _classCallCheck(this, BlockStatement);

        this.kind = _labels.Types.BlockStatement;
        this.body = [];
      };
    }
  }, {
    key: "FunctionDeclaration",
    get: function get() {
      return function FunctionDeclaration() {
        _classCallCheck(this, FunctionDeclaration);

        this.kind = _labels.Types.FunctionDeclaration;
        this.name = null;
        this.type = null;
        this.arguments = [];
        this.body = [];
        this.isStatic = false;
      };
    }
  }, {
    key: "TypeCast",
    get: function get() {
      return function TypeCast() {
        _classCallCheck(this, TypeCast);

        this.kind = _labels.Types.TypeCast;
        this.expression = null;
        this.type = null;
        this.operator = null;
        this.isForced = false;
        this.isConditional = false;
      };
    }
  }, {
    key: "TernaryExpression",
    get: function get() {
      return function TernaryExpression() {
        _classCallCheck(this, TernaryExpression);

        this.kind = _labels.Types.TernaryExpression;
        this.condition = null;
        this.consequent = null;
        this.alternate = null;
      };
    }
  }, {
    key: "CallExpression",
    get: function get() {
      return function CallExpression() {
        _classCallCheck(this, CallExpression);

        this.kind = _labels.Types.CallExpression;
        this.callee = null;
        this.arguments = [];
      };
    }
  }, {
    key: "MemberExpression",
    get: function get() {
      return function MemberExpression() {
        _classCallCheck(this, MemberExpression);

        this.kind = _labels.Types.MemberExpression;
        this.object = null;
        this.property = null;
        this.isComputed = false;
      };
    }
  }, {
    key: "Tuple",
    get: function get() {
      return function Tuple() {
        _classCallCheck(this, Tuple);

        this.kind = _labels.Types.Tuple;
        this.arguments = [];
      };
    }
  }, {
    key: "TupleType",
    get: function get() {
      return function TupleType() {
        _classCallCheck(this, TupleType);

        this.kind = _labels.Types.TupleType;
        this.arguments = [];
      };
    }
  }, {
    key: "TypeAnnotation",
    get: function get() {
      return function TypeAnnotation() {
        _classCallCheck(this, TypeAnnotation);

        this.kind = _labels.Types.TypeAnnotation;
        this.type = null;
      };
    }
  }, {
    key: "ArrayDeclaration",
    get: function get() {
      return function ArrayDeclaration() {
        _classCallCheck(this, ArrayDeclaration);

        this.kind = _labels.Types.ArrayDeclaration;
        this.argument = [];
      };
    }
  }, {
    key: "VariableDeclaration",
    get: function get() {
      return function VariableDeclaration() {
        _classCallCheck(this, VariableDeclaration);

        this.kind = _labels.Types.VariableDeclaration;
        this.symbol = null;
        this.declarations = [];
        this.init = null;
      };
    }
  }, {
    key: "AssignmentExpression",
    get: function get() {
      return function AssignmentExpression() {
        _classCallCheck(this, AssignmentExpression);

        this.kind = _labels.Types.AssignmentExpression;
        this.operator = null;
        this.left = null;
        this.right = null;
      };
    }
  }, {
    key: "BinaryExpression",
    get: function get() {
      return function BinaryExpression() {
        _classCallCheck(this, BinaryExpression);

        this.kind = _labels.Types.BinaryExpression;
        this.operator = null;
        this.left = null;
        this.right = null;
        this.isParenthised = false;
      };
    }
  }, {
    key: "ExpressionStatement",
    get: function get() {
      return function ExpressionStatement() {
        _classCallCheck(this, ExpressionStatement);

        this.kind = _labels.Types.ExpressionStatement;
        this.expression = null;
      };
    }
  }, {
    key: "Identifier",
    get: function get() {
      return function Identifier() {
        _classCallCheck(this, Identifier);

        this.kind = _labels.Types.Identifier;
        this.name = null;
      };
    }
  }, {
    key: "Literal",
    get: function get() {
      return function Literal() {
        _classCallCheck(this, Literal);

        this.kind = _labels.Types.Literal;
        this.value = null;
        this.raw = null;
      };
    }
  }]);

  return Node;
}();

exports.default = Node;

},{"./labels":38}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Precedence = undefined;
exports.registerOperator = registerOperator;

var _labels = require("./labels");

var Precedence = exports.Precedence = []; /**
                                           * Operator precedence
                                           */

function registerOperator(op, lvl, assoc, name) {
  var obj = {
    op: op,
    level: lvl,
    associativity: assoc
  };
  Precedence.push(obj);
  Precedence.sort(function (a, b) {
    if (a.level > b.level) return 1;
    if (a.level < b.level) return -1;
    return 0;
  });
  (0, _labels.registerTT)(name, op);
  _labels.Operators[name] = obj;
}

},{"./labels":38}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _labels = require("./labels");

var _nodes = require("./nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Scope
 * @export
 */

var Scope = function () {

  /**
   * @param {Node} scope
   * @param {Node} parent
   * @constructor
   */

  function Scope(scope, parent) {
    _classCallCheck(this, Scope);

    /**
     * Scope
     * @type {Node}
     */
    this.scope = scope;

    /**
     * Parent
     * @type {Node}
     */
    this.parent = parent;

    /**
     * Symbol table
     * @type {Object}
     */
    this.table = {};
  }

  /**
   * Get sth from table
   * @param  {String} name
   * @return {Node}
   */


  _createClass(Scope, [{
    key: "get",
    value: function get(name) {
      if (this.table[name] !== void 0) {
        return this.table[name];
      } else {
        if (this.parent !== void 0) {
          return this.parent.get(name);
        }
      }
    }

    /**
     * Get sth from scope by type
     * @param  {Number} type
     * @return {Node}
     */

  }, {
    key: "getByType",
    value: function getByType(type) {
      if (this.scope && this.scope.kind === type) {
        return this.scope;
      } else {
        if (this.parent !== void 0) {
          return this.parent.getByType(type);
        }
      }
    }

    /**
     * Get name of node
     * @param {Node} node
     * @return {String}
     */

  }, {
    key: "getName",
    value: function getName(node) {
      return node.value || node.name || node.id || (node.init ? node.init.value : void 0);
    }

    /**
     * Set sth into table
     * @param {Node} node
     */

  }, {
    key: "register",
    value: function register(node) {
      var name = this.getName(node);
      if (name !== void 0 && name !== null) {
        if (this.parent !== void 0) {
          //console.log(`Registered ${name}->${this.getName(this.scope)}:${getNameByLabel(this.scope.kind)}`);
        }
        this.table[name] = node;
      }
    }
  }]);

  return Scope;
}();

exports.default = Scope;

},{"./labels":38,"./nodes":39,"./utils":42}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inherit = inherit;
exports.uHash = uHash;
exports.getNameByLabel = getNameByLabel;
exports.getLabelByNumber = getLabelByNumber;
exports.isNumericType = isNumericType;
exports.getNumericType = getNumericType;
exports.greet = greet;

var _labels = require("./labels");

var _nodes = require("./nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _const = require("./const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Object} cls
 * @param {Object} prot
 * @export
 */
function inherit(cls, prot) {

  var key = null;

  for (key in prot) {
    if (prot[key] instanceof Function) {
      cls.prototype[key] = prot[key];
    }
  };
}

var hashIndex = -1;
var hashes = [];

/**
 * Generate a unique hash
 * @return {Number}
 * @export
 */
function uHash() {

  var index = ++hashIndex;

  if (hashes.indexOf(index) > -1) return this.uHash();

  hashes.push(index);

  return index;
}

/**
 * Debug helper
 */
function getNameByLabel(name) {
  if (_labels.Token[name] !== void 0) {
    return _labels.Token[name];
  } else if (_labels.TokenList[name] !== void 0) {
    return _labels.TokenList[name];
  } else if (_labels.Types[name] !== void 0) {
    return _labels.Types[name];
  }
  return null;
}

function getLabelByNumber(n) {

  for (var key in _labels.TokenList) {
    if (_labels.TokenList[key] === n) {
      return key;
    }
  };

  return null;
}

/**
 * Numeric type check
 * @param  {Type}  type
 * @return {Boolean}
 */
function isNumericType(type) {
  return type === "Int" || type === "Int8" || type === "UInt8" || type === "Int32" || type === "UInt32" || type === "Int64" || type === "UInt64" || type === "Double" || type === "Float";
}

/**
 * @param  {Number} n
 * @return {String}
 */
function getNumericType(n) {
  if (+n === n && !(n % 1)) {
    return "Int";
  }
  if (+n === n && !(n % 1) && n < 0x80 && n >= -0x80) {
    return "Int8";
  }
  if (+n === n && !(n % 1) && n < 0x8000 && n >= -0x8000) {
    return "Int16";
  }
  if (+n === n && !(n % 1) && n < 0x80000000 && n >= -0x80000000) {
    return "Int32";
  }
  if (+n === n && !(n % 1) && n >= 0) {
    return "Uint";
  }
  if (+n === n && !(n % 1) && n < 0x100 && n >= 0) {
    return "Uint8";
  }
  if (+n === n && !(n % 1) && n < 0x10000 && n >= 0) {
    return "Uint16";
  }
  if (+n === n && !(n % 1) && n < 0x100000000 && n >= 0) {
    return "Uint32";
  }
  if (+n === n && !(n % 1) && n < 0x100000000 && n >= 0) {
    return "Uint32";
  }
  if (+n === n) {
    return "Float";
  }
  if (+n === n && Math.abs(n) <= 3.4028234e+38) {
    return "Float32";
  }
  if (+n === n && Math.abs(n) <= 1.7976931348623157e+308) {
    return "Float64";
  }
}

function greet() {

  if (typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
    var args = ["\n%c Hevia.js " + _const.VERSION + " %c %chttp://www.heviajs.com/ %c\n\n", "color: #fff; background: #030307; padding:5px 0;", "color: #9598b9; background: #2d316b; padding:5px 0;", "color: #9598b9; background: #2d316b; padding:5px 0;", "color: #9598b9; background: #2d316b; padding:5px 0;"];
    console.log.apply(console, args);
  } else {
    console.log("Hevia.js - " + _const.VERSION + " - http://www.heviajs.com/\n");
  }
}

},{"./const":36,"./labels":38,"./nodes":39}]},{},[37])(37)
});