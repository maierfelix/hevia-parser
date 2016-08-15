(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HEVIA = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "name": "Hevia",
  "version": "0.0.7",
  "description": "Hevia Parser",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/maierfelix/hevia.git"
  },
  "keywords": [
    "Hevia",
    "HeviaJS",
    "Hevia.js",
    "Swift",
    "ast",
    "ecmascript",
    "javascript",
    "parser",
    "syntax"
  ],
  "author": "Felix Maier <maier.felix96@gmail.com>",
  "bugs": {
    "url": "https://github.com/maierfelix/hevia/issues"
  },
  "homepage": "https://github.com/maierfelix/hevia#readme",
  "scripts": {
    "live": "budo --dir static/ ./src/index.js:dist/hevia.js --live -- -t babelify",
    "dist": "npm run dist-release && npm run dist-uglify",
    "dist-release": "browserify ./src/index.js -t babelify -s HEVIA -o dist/hevia.js",
    "dist-uglify": "uglifyjs dist/hevia.js --compress --mangle > dist/hevia.min.js",
    "dist-test": "npm run dist-release && npm run test",
    "test": "node ./tests/index.js",
    "travis": "npm dist-test"
  },
  "engines": {
    "node": ">= 5.x"
  },
  "devDependencies": {
    "babel-core": "^6.0.20",
    "babel-cli": "^6.1.2",
    "babel-preset-es2015": "^6.1.2",
    "browserify": "^12.0.1",
    "babelify": "^7.2.0",
    "uglify-js": "^2.6.1",
    "babel-loader": "^6.0.1",
    "babel-runtime": "^6.9.1",
    "babel-plugin-transform-runtime": "^6.4.3",
    "babel-preset-stage-0": "^6.3.13",
    "babel-preset-es2015": "^6.9.0",
    "node-libs-browser": "^0.5.3",
    "budo": "^8.3.0"
  },
  "browserify": {
    "extension": [ 
      "cjsx", 
      "coffee", 
      "js", 
      "json",
      "swift"
    ]
  }
}
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAccessControl = parseAccessControl;
exports.parseFinal = parseFinal;
exports.parseOverride = parseOverride;
exports.parseStatic = parseStatic;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseAccessControl() {

  var name = this.current.name;

  this.next();

  var node = this.parseStatement();

  switch (name) {
    case _labels.TokenList.PUBLIC:
      node.isPublic = true;
      break;
    case _labels.TokenList.PRIVATE:
      node.isPrivate = true;
      break;
    case _labels.TokenList.INTERNAL:
      node.isInternal = true;
      break;
  };

  return node;
}

/**
 * @return {Node}
 */
function parseFinal() {

  this.expect(_labels.TokenList.FINAL);

  var node = this.parseStatement();

  node.isFinal = true;

  return node;
}

/**
 * @return {Node}
 */
function parseOverride() {

  this.expect(_labels.TokenList.OVERRIDE);

  var node = this.parseStatement();

  node.isOverride = true;

  return node;
}

/**
 * @return {Node}
 */
function parseStatic() {

  this.expect(_labels.TokenList.STATIC);

  var node = this.parseStatement();

  node.isStatic = true;

  return node;
}

},{"../labels":38,"../nodes":39,"../utils":41}],3:[function(require,module,exports){
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

},{"../../labels":38,"../../nodes":39}],4:[function(require,module,exports){
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
    node.test = this.parseCondition();
  }

  // Consequent
  this.expect(_labels.TokenList.LBRACE);
  node.consequent = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  // Alternate: else|else if
  if (this.eat(_labels.TokenList.ELSE)) {
    node.alternate = this.parseIfStatement();
  }

  return node;
}

},{"../../labels":38,"../../nodes":39}],5:[function(require,module,exports){
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

},{"../../labels":38,"../../nodes":39}],6:[function(require,module,exports){
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

  // WillSet, didSet, set can have parameters
  var allowParameters = this.peek(_labels.TokenList.SET) || this.peek(_labels.TokenList.WILLSET) || this.peek(_labels.TokenList.DIDSET);

  var node = new _nodes2.default.PseudoProperty();

  node.name = this.current.name;

  this.next();

  if (this.peek(_labels.TokenList.LPAREN) && allowParameters) {
    node.arguments = this.parseArguments();
  }

  // Pseudos dont explicit need a body
  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

},{"../../labels":38,"../../nodes":39}],7:[function(require,module,exports){
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

},{"../../labels":38,"../../nodes":39}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseComment = parseComment;
exports.parseBlockComment = parseBlockComment;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

var _scanner = require("../Tokenizer/scanner");

var scan = _interopRequireWildcard(_scanner);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseComment() {

  var node = new _nodes2.default.Comment();
  var type = this.current.type;

  node.arguments = this.parseBlockComment(this.current.value);

  this.next();

  return node;
}

/**
 * @return {Array}
 */
function parseBlockComment(str) {

  var args = [];

  var ch = null;
  var cp = -1;
  var record = false;

  var index = 0;
  var length = str.length;

  var out = "";

  while (index < length) {
    ch = str[index];
    cp = ch.charCodeAt(0);
    if (record) {
      if (!scan.isWhiteSpace(cp) && !scan.isLineTerminator(cp)) {
        // Dont allow commas
        if (cp !== 44) {
          out += ch;
        }
        if (index + 1 >= length) {
          args.push(out);
          record = false;
        }
      } else {
        args.push(out);
        record = false;
      }
    }
    if (ch === "#") {
      out = "";
      record = true;
    }
    index++;
  };

  return args;
}

},{"../Tokenizer/scanner":34,"../labels":38,"../nodes":39,"../utils":41}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseClass = parseClass;
exports.parseSpecialClass = parseSpecialClass;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseClass() {

  var node = new _nodes2.default.ClassDeclaration();

  this.expect(_labels.TokenList.CLASS);

  if (this.peek(_labels.Token.Identifier)) {
    node.name = this.extract(_labels.Token.Identifier).value;
    // Fake class for a func or var
  } else {
    if (!this.peek(_labels.TokenList.LBRACE)) {
      return this.parseSpecialClass(node);
    }
  }

  if (this.peek(_labels.TokenList.LT)) {
    node.generic = this.parseGeneric();
  }

  if (this.peek(_labels.TokenList.COLON)) {
    node.extend = this.parseTypeInheritance();
  }

  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

/**
 * @param  {Node} base
 * @return {Node}
 */
function parseSpecialClass(base) {

  var node = this.parseStatement();

  node.isClassed = true;

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],10:[function(require,module,exports){
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

  node.argument = this.parseLiteral();

  if (this.eat(_labels.TokenList.COLON)) {
    node.extend = this.parseTypeInheritance();
  }

  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

},{"../../labels":38,"../../nodes":39}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFunction = parseFunction;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

var _const = require("../../const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseFunction() {

  var node = new _nodes2.default.FunctionDeclaration();

  // Optional, so dont expect
  this.eat(_labels.TokenList.FUNCTION);

  node.name = this.parseLiteralHead();

  if (this.peek(_labels.TokenList.LT)) {
    node.generic = this.parseGeneric();
  }

  node.arguments = this.parseArguments();

  if (this.peek(_labels.TokenList.ARROW)) {
    node.type = this.parseType().type;
  } else {
    node.type = this.parseFakeLiteral(_const.FUNC_DEFAULT_TYPE);
  }

  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

},{"../../const":36,"../../labels":38,"../../nodes":39,"../../utils":41}],12:[function(require,module,exports){
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

  var node = new _nodes2.default.ImportDeclaration();

  this.expect(_labels.TokenList.IMPORT);

  node.specifiers = this.parseCommaSeperatedValues();

  return node;
}

},{"../../labels":38,"../../nodes":39}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDeclarationStatement = parseDeclarationStatement;
exports.parseInitializer = parseInitializer;

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
      node = this.parseTypeAlias();
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
    case _labels.TokenList.INFIX:
    case _labels.TokenList.POSTFIX:
    case _labels.TokenList.PREFIX:
      node = this.parseOperator();
      break;
    case _labels.TokenList.INIT:
      node = this.parseInitializer();
      break;
  };

  this.eat(_labels.TokenList.SEMICOLON);

  return node;
}

/*
 * @return {Node}
 */
function parseInitializer() {

  var node = new _nodes2.default.InitializerDeclaration();

  this.expect(_labels.TokenList.INIT);

  node.arguments = this.parseArguments();

  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOperator = parseOperator;
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
function parseOperator() {

  var node = null;

  var type = _labels.TokenList[this.parseLiteralHead()];

  // Operator declaration followed by function
  if (this.peek(_labels.TokenList.FUNCTION)) {
    node = this.parseFunction();
    if (type === _labels.TokenList.PREFIX) {
      node.isPrefix = true;
    } else if (type === _labels.TokenList.POSTFIX) {
      node.isPostfix = true;
    } else {
      throw new Error("Operator parse error");
    }
    (0, _precedence.registerOperator)(node.name, -1, "none", node.name, type);
    // Standard operator declaration
  } else {
    node = this.parseOperatorDeclaration(type);
  }

  return node;
}

/**
 * @return {Node}
 */
function parseOperatorDeclaration(type) {

  var node = new _nodes2.default.OperatorDeclaration();

  this.expect(_labels.TokenList.OPERATOR);

  node.name = type;
  node.operator = this.parseLiteralHead();

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  var associativity = this.getOperatorAssociativity(node.body.body);
  var precedence = this.getOperatorPrecedence(node.body.body);

  if (node.operator) {
    (0, _precedence.registerOperator)(node.operator, precedence, associativity, node.operator, node.name);
  } else {
    // Seems already registered
  }

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

},{"../../labels":38,"../../nodes":39,"../../precedence":40,"../../utils":41}],15:[function(require,module,exports){
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

  var node = new _nodes2.default.ProtocolDeclaration();

  this.expect(_labels.TokenList.PROTOCOL);

  if (this.peek(_labels.Token.Identifier)) {
    node.name = this.extract(_labels.Token.Identifier).value;
  }

  if (this.peek(_labels.TokenList.COLON)) {
    node.extend = this.parseTypeInheritance();
  }

  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

},{"../../labels":38,"../../nodes":39}],16:[function(require,module,exports){
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

  var node = new _nodes2.default.StructureDeclaration();

  this.expect(_labels.TokenList.STRUCT);

  if (this.peek(_labels.Token.Identifier)) {
    node.name = this.extract(_labels.Token.Identifier).value;
  }

  if (this.peek(_labels.TokenList.COLON)) {
    node.extend = this.parseTypeInheritance();
  }

  if (this.eat(_labels.TokenList.LBRACE)) {
    node.body = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
  }

  return node;
}

},{"../../labels":38,"../../nodes":39}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTypeAlias = parseTypeAlias;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseTypeAlias() {

  var node = new _nodes2.default.TypeAliasDeclaration();

  this.expect(_labels.TokenList.TYPEALIAS);

  if (this.peek(_labels.Token.Identifier)) {
    node.name = this.parseLiteral().value;
  }

  this.expect(_labels.TokenList.ASSIGN);

  node.argument = this.parseStatement();

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],18:[function(require,module,exports){
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
 * @return {Node}
 */
function parseVariableDeclaration() {

  var declaration = null;
  var node = new _nodes2.default.VariableDeclaration();

  if (this.peek(_labels.TokenList.VAR) || this.peek(_labels.TokenList.CONST)) {
    node.symbol = this.current.name;
    this.next();
  }

  this.parseVariable(node);

  return node;
}

/**
 * @return {Node}
 */
function parseVariable(node) {

  node.declarations = this.parseVariableDeclarement();

  // Block
  if (this.eat(_labels.TokenList.LBRACE)) {
    node.init = this.parseBlock();
    this.expect(_labels.TokenList.RBRACE);
    // Expression
  } else if (this.eat(_labels.TokenList.ASSIGN)) {
    node.init = this.parseStatement();
  }

  // Unify, if variable is block expr
  if (node.init && !node.init.length) {
    node.init = [node.init];
  }

  if (this.eat(_labels.TokenList.COMMA)) {
    while (true) {
      var tmp = this.parseVariableDeclaration();
      tmp.symbol = node.symbol;
      node.declarations = node.declarations.concat(tmp.declarations);
      // Dont join if no assignment found
      if (node.init !== null && tmp.init !== null) {
        node.init = node.init.concat(tmp.init);
      }
      if (!this.peek(_labels.TokenList.COMMA)) break;
    };
  }
}

/**
 * @return {Array}
 */
function parseVariableDeclarement() {

  var args = null;

  if (this.peek(_labels.Token.Identifier)) {
    args = [this.parseLiteral()];
  } else if (this.peek(_labels.TokenList.LPAREN)) {
    args = this.parseArguments();
  }

  return args;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseParenthese = parseParenthese;
exports.parseCommaSeperatedValues = parseCommaSeperatedValues;
exports.parseArguments = parseArguments;
exports.parseMaybeArguments = parseMaybeArguments;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  [x] parenthesed bin expr
  [x] parameter
  [x] argument
  [x] tuple
  @return {Node}
 */
function parseParenthese(left, right) {

  var node = null;
  var base = null;

  // Empty parenthese
  this.expect(left);
  if (this.eat(right)) return null;

  node = this.parseCommaSeperatedValues();

  this.expect(right);

  return node;
}

/**
 * @return {Array}
 */
function parseCommaSeperatedValues() {

  var args = [];
  var stmt = null;

  while (true) {
    stmt = this.parseStatement();
    // Labeled literal
    if (this.peek(_labels.Token.Identifier)) {
      if (!this.isOperator(_labels.TokenList[this.current.value])) {
        var tmp = this.parseLiteral();
        tmp.label = stmt;
        stmt = tmp;
      }
    }
    args.push(stmt);
    if (!this.eat(_labels.TokenList.COMMA)) break;
  };

  return args;
}

/**
 * @return {Array}
 */
function parseArguments(args) {

  var argz = args === void 0 ? this.parseParenthese(_labels.TokenList.LPAREN, _labels.TokenList.RPAREN) : args;

  /** Handle empty arguments */
  if (argz === null) {
    argz = [];
  } else if (!argz.length) {
    argz = [argz];
  }

  return argz;
}

/**
 * @return {Array}
 */
function parseMaybeArguments() {

  var args = this.parseExpressionStatement();

  // Turn non-parenthised args into array
  if (!(args instanceof Array)) {
    if (args !== null) {
      args = [args];
    } else {
      args = [];
    }
  }

  return args;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseArrayExpression = parseArrayExpression;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseArrayExpression() {

  var node = new _nodes2.default.ArrayExpression();

  var args = [];

  this.expect(_labels.TokenList.LBRACK);

  while (true) {
    if (!this.peek(_labels.TokenList.RBRACK)) {
      args.push(this.parseBinaryExpression(0));
    }
    if (!this.eat(_labels.TokenList.COMMA)) break;
  };

  this.expect(_labels.TokenList.RBRACK);

  node.argument = args;

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseAtom = parseAtom;
exports.parseChaining = parseChaining;
exports.parseMemberExpression = parseMemberExpression;
exports.parseCallExpression = parseCallExpression;
exports.parseTernaryExpression = parseTernaryExpression;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Node} node
 * @return {Node}
 */
function parseAtom(node) {

  while (true) {
    /** Un/computed member expression */
    if (this.peek(_labels.TokenList.LBRACK) || this.peek(_labels.TokenList.PERIOD)) {
      node = this.parseMemberExpression(node);
    }
    /** Call expression */
    else if (this.peek(_labels.TokenList.LPAREN)) {
        node = this.parseCallExpression(node);
      } else {
        break;
      }
  };

  this.parseChaining(node);

  return node;
}

/**
 * @param {Node}
 */
function parseChaining(node) {

  if (this.eat(_labels.TokenList.NOT)) {
    node.isUnwrapped = true;
  } else if (this.peek(_labels.TokenList.CONDITIONAL)) {
    if (!this.current.isTernary) {
      this.next();
      node.isOptional = true;
    }
  }
}

/**
 * @return {Node}
 */
function parseMemberExpression(base) {

  var node = new _nodes2.default.MemberExpression();

  node.isComputed = this.peek(_labels.TokenList.LBRACK);

  this.next();

  node.object = base;
  node.property = node.isComputed ? this.parseExpressionStatement() : this.parseLiteral();

  // Be careful with []
  if (node.isComputed && this.eat(_labels.TokenList.COMMA)) {
    var args = this.parseCommaSeperatedValues();
    args.unshift(node.property);
    var tmp = new _nodes2.default.ArrayExpression();
    tmp.argument = args;
    node.property = tmp;
  }

  if (node.isComputed) {
    this.expect(_labels.TokenList.RBRACK);
  }

  this.parseChaining(node);

  return node;
}

/**
 * @return {Node}
 */
function parseCallExpression(base) {

  var node = new _nodes2.default.CallExpression();

  node.callee = base;
  node.arguments = this.parseArguments();

  return node;
}

/**
 * @return {Node}
 */
function parseTernaryExpression(base) {

  var node = new _nodes2.default.TernaryExpression();

  node.test = base;

  this.inTernary = true;

  this.expect(_labels.TokenList.CONDITIONAL);
  node.consequent = this.parseExpressionStatement();
  this.expect(_labels.TokenList.COLON);
  node.alternate = this.parseExpressionStatement();

  this.inTernary = false;

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBinaryExpression = parseBinaryExpression;
exports.parseExpression = parseExpression;
exports.isPrefixOperator = isPrefixOperator;
exports.isPostfixOperator = isPostfixOperator;
exports.getUnifiedOperator = getUnifiedOperator;
exports.opInArray = opInArray;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _precedence = require("../../precedence");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Number} index
 * @return {Node}
 */
function parseBinaryExpression(index) {

  var tmp = null;
  var left = null;
  var node = null;

  var state = _precedence.IFX_PRECEDENCE[index];

  left = state !== void 0 ? this.parseBinaryExpression(index + 1) : this.parseExpression();

  while (this.acceptPrecedence(state)) {
    node = new _nodes2.default.BinaryExpression();
    node.operator = _labels.TokenList[state.op];
    this.next();
    node.left = left;
    tmp = state !== void 0 ? this.parseBinaryExpression(index + 1) : this.parseExpression();
    node.right = tmp;
    left = node;
  };

  // No infix expression, so check if postfix
  if (state === void 0 && this.current !== void 0) {
    if (this.isPostfixOperator(this.current)) {
      return this.parseUnaryExpression(left);
    }
  }

  return left;
}

/**
 * @return {Node}
 */
function parseExpression() {

  var node = null;
  var isParenthised = this.peek(_labels.TokenList.LPAREN);

  // Standalone parenthised operator
  if (this.isOperator(this.current.name)) {
    this.next();
    if (this.peek(_labels.TokenList.RPAREN)) {
      this.back();
      node = this.parseSpecialLiteral();
      return node;
    } else {
      this.back();
    }
  }

  // Closure
  if (this.peek(_labels.TokenList.LBRACE)) {
    node = this.parseAtom(this.parseClosureExpression());
  } else {
    node = this.parseAtom(this.parseLiteral());
  }

  if (node !== null && node.kind === _labels.Types.BinaryExpression) {
    node.isParenthised = isParenthised;
  }

  return node;
}

/**
 * @param {Object} token
 * @return {Boolean}
 */
function isPrefixOperator(token) {

  var op = this.getUnifiedOperator(token);

  return this.opInArray(_precedence.PEX_PRECEDENCE, op);
}

/**
 * @param {Object} token
 * @return {Boolean}
 */
function isPostfixOperator(token) {

  var op = this.getUnifiedOperator(token);

  return this.opInArray(_precedence.POX_PRECEDENCE, op);
}

/**
 * Parses an operator token, which is either
 * tokenized as a identifier (unknown) or a TT index
 * @return {String}
 */
function getUnifiedOperator(token) {

  if (token.name === _labels.Token.Identifier) {
    return token.value;
  } else {
    // Turn into op value
    return (0, _utils.getLabelByNumber)(_labels.TokenList[(0, _utils.getNameByLabel)(token.name)]);
  }
}

/**
 * @return {Boolean}
 */
function opInArray(array, op) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (key.op === op) return true;
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
  return false;
}

},{"../../labels":38,"../../nodes":39,"../../precedence":40,"../../utils":41}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseClosureExpression = parseClosureExpression;
exports.parseFunctionExpression = parseFunctionExpression;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseClosureExpression() {

  var node = new _nodes2.default.ClosureExpression();

  this.expect(_labels.TokenList.LBRACE);

  node.signature = this.parseExpressionStatement();

  // unparenthised comma seperated signature arguments
  if (this.eat(_labels.TokenList.COMMA)) {
    var tmp = this.parseCommaSeperatedValues();
    tmp.unshift(node);
    node = tmp;
  }

  this.eat(_labels.TokenList.IN);

  node.body = this.parseBlock();

  this.expect(_labels.TokenList.RBRACE);

  return node;
}

/**
 * @param {Node}
 * @return {Node}
 */
function parseFunctionExpression(node) {

  var tmp = new _nodes2.default.FunctionExpression();
  tmp.type = this.parseTypeExpression();

  if (!(tmp.type instanceof Array)) {
    tmp.type = [tmp.type];
  }

  // validate non-array argument
  tmp.arguments = node instanceof Array ? node : node === null ? [] : [node];

  return tmp;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],24:[function(require,module,exports){
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

  var node = null;

  switch (this.current.name) {
    /** Array */
    case _labels.TokenList.LBRACK:
      node = this.parseAtom(this.parseArrayExpression());
      break;
    default:
      /** Closure */
      if (!this.inCondition && this.peek(_labels.TokenList.LBRACE)) {
        node = this.parseBinaryExpression(0);
      } else if (this.isOperator(this.current.name) || (0, _utils.isLiteral)(this.current.name)) {
        node = this.parseBinaryExpression(0);
      }
      break;
  };

  if (this.eat(_labels.TokenList.ARROW)) {
    node = this.parseFunctionExpression(node);
  }

  /**
   * Trailing closure
   * Don't trail if inside
   * undparenthised condition
   */
  else if (!this.inCondition && this.peek(_labels.TokenList.LBRACE)) {
      // Only parse as trailing, if brace opens in same code line
      if (this.current.loc.start.line === this.previous.loc.start.line) {
        var tmp = this.parseClosureExpression();
        tmp.callee = node;
        node = tmp;
      }
    }

  if (this.peek(_labels.TokenList.CONDITIONAL) && this.current.isTernary) {
    node = this.parseTernaryExpression(node);
  }

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLiteral = parseLiteral;
exports.parseLiteralHead = parseLiteralHead;
exports.parseSpecialLiteral = parseSpecialLiteral;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseLiteral() {

  var node = new _nodes2.default.Literal();

  // Enum access
  if (this.eat(_labels.TokenList.PERIOD)) {
    node = this.parseLiteral();
    node.isEnumLink = true;
    return node;
  }

  // Unary pex expression
  if (this.isPrefixOperator(this.current)) {
    return this.parseUnaryExpression(null);
  }

  // Call expression
  if (this.eat(_labels.TokenList.LPAREN)) {
    // Empty
    if (this.eat(_labels.TokenList.RPAREN)) {
      return null;
    }
    var tmp = this.parseStatement();
    // Seems like a standalone operator
    if (tmp === null) {
      tmp = this.parseLiteral();
    }
    // Seems like a tuple o.O
    if (this.eat(_labels.TokenList.COMMA)) {
      // Parse all folowing tuple parameters
      var args = this.parseCommaSeperatedValues();
      args.unshift(tmp);
      tmp = args;
    }
    this.expect(_labels.TokenList.RPAREN);
    return tmp;
  }

  var isExplicit = this.eat(_labels.TokenList.UL);

  // Literal passed as pointer
  if (this.eat(_labels.TokenList.BIT_AND)) {
    node.isPointer = true;
  }

  if (isExplicit && this.peek(_labels.TokenList.COLON) && !this.inTernary) {
    // Explicit only parameter
  } else {
    // Parse literal
    if ((0, _utils.isLiteral)(this.current.name)) {
      node.type = this.current.name;
      node.value = this.current.value;
      node.raw = this.current.value;
      this.next();
    }
    // No literal to parse
    else {
        // Assignment to underscore
        if (isExplicit && this.isOperator(this.current.name)) {
          this.back();
          node = this.parseSpecialLiteral();
        } else {
          node = this.parseStatement();
        }
      }
  }

  // Dont parse colon as argument, if in ternary expression
  if (!this.inTernary && this.peek(_labels.TokenList.COLON)) {
    node = this.parseType(node);
    if (isExplicit) {
      node.isExplicit = true;
    }
  }

  // Shorthand
  if (node !== null && node.value !== void 0 && node.value !== null) {
    if (node.value.charAt(0) === "$") {
      node.isShorthand = true;
      // Delete $ sign
      node.value = node.value.slice(1);
    }
  }

  this.parseChaining(node);

  return node;
}

/**
 * Parse a literal head,
 * supports functions names
 * which are operators
 * @return {String}
 */
function parseLiteralHead() {

  var str = _labels.TokenList[this.current.name];

  // Custom operator
  if (str) {
    this.next();
    return str;
  }

  // Default literal
  return this.extract(_labels.Token.Identifier).value;
}

/**
 * Parse as literal, don't
 * care what it really is
 * @return {Node}
 */
function parseSpecialLiteral() {

  var node = new _nodes2.default.Literal();

  node.type = this.current.name;
  node.value = this.current.value;
  node.raw = this.current.value;
  this.next();

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUnaryExpression = parseUnaryExpression;

var _labels = require("../../labels");

var _nodes = require("../../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param  {Node} base
 * @return {Node}
 */
function parseUnaryExpression(base) {

  var node = new _nodes2.default.UnaryExpression();

  node.isPrefix = this.isPrefixOperator(this.current);
  node.operator = _labels.TokenList[this.parseLiteralHead()];
  node.argument = base || this.parseBinaryExpression(0);

  return node;
}

},{"../../labels":38,"../../nodes":39,"../../utils":41}],27:[function(require,module,exports){
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

var _array = require("./expression/array");

var arrays = _interopRequireWildcard(_array);

var _unary = require("./expression/unary");

var unaries = _interopRequireWildcard(_unary);

var _binary = require("./expression/binary");

var binaries = _interopRequireWildcard(_binary);

var _literal = require("./expression/literal");

var literals = _interopRequireWildcard(_literal);

var _closure = require("./expression/closure");

var closures = _interopRequireWildcard(_closure);

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

var _access = require("./access");

var accesses = _interopRequireWildcard(_access);

var _comment = require("./comment");

var comments = _interopRequireWildcard(_comment);

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

var _typealias = require("./declare/typealias");

var typealiases = _interopRequireWildcard(_typealias);

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

  /**
   * Inside condition
   * @type {Boolean}
   */
  this.inCondition = false;
};

exports.default = Parser;


(0, _utils.inherit)(Parser, parse);

(0, _utils.inherit)(Parser, args);
(0, _utils.inherit)(Parser, atoms);
(0, _utils.inherit)(Parser, arrays);
(0, _utils.inherit)(Parser, unaries);
(0, _utils.inherit)(Parser, binaries);
(0, _utils.inherit)(Parser, literals);
(0, _utils.inherit)(Parser, closures);
(0, _utils.inherit)(Parser, expressions);

(0, _utils.inherit)(Parser, guards);
(0, _utils.inherit)(Parser, ifelse);
(0, _utils.inherit)(Parser, pseudos);
(0, _utils.inherit)(Parser, switches);
(0, _utils.inherit)(Parser, branches);

(0, _utils.inherit)(Parser, loops);
(0, _utils.inherit)(Parser, types);
(0, _utils.inherit)(Parser, branches);
(0, _utils.inherit)(Parser, comments);
(0, _utils.inherit)(Parser, accesses);
(0, _utils.inherit)(Parser, statements);

(0, _utils.inherit)(Parser, imports);
(0, _utils.inherit)(Parser, classes);
(0, _utils.inherit)(Parser, structs);
(0, _utils.inherit)(Parser, protocols);
(0, _utils.inherit)(Parser, functions);
(0, _utils.inherit)(Parser, variables);
(0, _utils.inherit)(Parser, operators);
(0, _utils.inherit)(Parser, extensions);
(0, _utils.inherit)(Parser, typealiases);
(0, _utils.inherit)(Parser, declarations);

},{"../utils":41,"./access":2,"./branch":5,"./branch/guard":3,"./branch/if":4,"./branch/pseudo":6,"./branch/switch":7,"./comment":8,"./declare":13,"./declare/class":9,"./declare/extension":10,"./declare/function":11,"./declare/import":12,"./declare/operator":14,"./declare/protocol":15,"./declare/struct":16,"./declare/typealias":17,"./declare/variable":18,"./expression":24,"./expression/args":19,"./expression/array":20,"./expression/atom":21,"./expression/binary":22,"./expression/closure":23,"./expression/literal":25,"./expression/unary":26,"./loop":28,"./parse":29,"./statement":30,"./type":31}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseLoopStatement = parseLoopStatement;
exports.parseFor = parseFor;
exports.parseWhile = parseWhile;
exports.parseRepeat = parseRepeat;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @return {Node}
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
    init = this.parseStatement();
  }

  // for (expr) in (expr)
  if (this.eat(_labels.TokenList.IN)) {
    node = new _nodes2.default.ForInStatement();
    node.expression = this.parseCondition();
    // for (expr);(expr);(expr)
  } else {
    node.test = this.parseExpressionStatement();
    this.expect(_labels.TokenList.SEMICOLON);
    node.update = this.parseCondition();
  }

  node.init = init;

  this.expect(_labels.TokenList.LBRACE);
  node.body = this.parseBlock();
  this.expect(_labels.TokenList.RBRACE);

  return node;
}

/**
 * @return {Node}
 */
function parseWhile() {

  var node = new _nodes2.default.WhileStatement();

  this.expect(_labels.TokenList.WHILE);

  node.test = this.parseCondition();

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

  node.test = this.parseCondition();

  return node;
}

},{"../labels":38,"../nodes":39,"../utils":41}],29:[function(require,module,exports){
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
exports.parseFakeLiteral = parseFakeLiteral;

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
    } else {
      throw new Error("Reached end!");
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

  /**
   * If very first comment
   * doesn't contain compiler
   * instructions -> delete it
   */
  if (node.body.body.length) {
    var tmp = node.body.body[0];
    if (tmp.kind === _labels.Types.Comment) {
      if (!tmp.arguments.length) {
        node.body.body.shift();
      }
    }
  }

  return node;
}

/**
 * @return {Node}
 */
function parseBlock() {

  var node = new _nodes2.default.BlockStatement();

  var index = 0;
  var statement = null;

  for (; (statement = this.parseStatement()) !== null; ++index) {
    // Only allow parsing very first comment
    if (statement.kind !== _labels.Types.Comment || statement.kind === _labels.Types.Comment && index <= 0) node.body.push(statement);
    if (this.current === void 0) break;
  };

  return node;
}

/**
 * @return {Node}
 */
function parse(tokens) {
  this.reset(tokens);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tokens[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      //console.log(getNameByLabel(key.name), key.value);

      var key = _step.value;
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
  return this.parseProgram();
}

/**
 * Accept precedence
 * @param  {Object}  token
 * @param  {Number}  state
 * @return {Boolean}
 */
function acceptPrecedence(state) {
  if (state !== void 0 && this.current !== void 0) {
    // Custom infix operator
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

/**
 * @param {String} value
 * @return {Node}
 */
function parseFakeLiteral(value) {

  var tmp = this.current;

  this.current = {
    name: _labels.Token.Identifier,
    value: value
  };

  var node = this.parseLiteral();

  this.back();

  this.current = tmp;

  return node;
}

},{"../labels":38,"../nodes":39,"../utils":41}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseStatement = parseStatement;
exports.parseReturnStatement = parseReturnStatement;
exports.parseCondition = parseCondition;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @return {Node}
 */
function parseStatement() {

  var node = null;

  switch (this.current.name) {
    /** Comment */
    case _labels.Token.BlockComment:
    case _labels.Token.LineComment:
      node = this.parseComment();
      break;
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
    case _labels.TokenList.INIT:
    case _labels.TokenList.PROTOCOL:
    case _labels.TokenList.EXTENSION:
    case _labels.TokenList.OPERATOR:
    case _labels.TokenList.POSTFIX:
    case _labels.TokenList.PREFIX:
    case _labels.TokenList.INFIX:
      node = this.parseDeclarationStatement();
      break;
    /** Class */
    case _labels.TokenList.CLASS:
      node = this.parseClass();
      break;
    /** Access control */
    case _labels.TokenList.PUBLIC:
    case _labels.TokenList.PRIVATE:
    case _labels.TokenList.INTERNAL:
      node = this.parseAccessControl();
      break;
    /** Final */
    case _labels.TokenList.FINAL:
      node = this.parseFinal();
      break;
    case _labels.TokenList.STATIC:
      node = this.parseStatic();
      break;
    /** Override */
    case _labels.TokenList.OVERRIDE:
      node = this.parseOverride();
      break;
    /** Operator things */
    case _labels.TokenList.ASSOCIATIVITY:
      node = this.parseAssociativityExpression();
      break;
    case _labels.TokenList.PRECEDENCE:
      node = this.parsePrecedenceExpression();
      break;
    /** Expression statement */
    default:
      node = this.parseAtom(this.parseExpressionStatement());
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

/**
 * @return {Node}
 */
function parseCondition() {

  var node = null;

  this.inCondition = true;
  this.eat(_labels.TokenList.LPAREN);
  node = this.parseStatement();
  this.eat(_labels.TokenList.RPAREN);
  this.inCondition = false;

  return node;
}

},{"../labels":38,"../nodes":39,"../utils":41}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseType = parseType;
exports.parseTypeExpression = parseTypeExpression;
exports.parseTupleType = parseTupleType;
exports.parseGeneric = parseGeneric;
exports.parseTypeInheritance = parseTypeInheritance;

var _labels = require("../labels");

var _nodes = require("../nodes");

var _nodes2 = _interopRequireDefault(_nodes);

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @return {Node}
 */
function parseType(base) {

  var node = new _nodes2.default.TypeExpression();

  node.name = base;

  if (this.eat(_labels.TokenList.COLON)) {
    node.isReference = this.eat(_labels.TokenList.INOUT);
  }

  node.type = this.parseTypeExpression();

  return node;
}

/*
 * @return {Node}
 */
function parseTypeExpression() {

  var node = null;

  // Tuple
  if (this.peek(_labels.TokenList.LPAREN)) {
    node = this.parseTupleType();
  }
  // Identifier
  else if (this.peek(_labels.Token.Identifier)) {
      node = this.parseLiteral();
      if (this.peek(_labels.TokenList.LT)) {
        node.generic = this.parseGeneric();
      }
    }
    // Arrow
    else if (this.eat(_labels.TokenList.ARROW)) {
        node = this.parseLiteral();
      } else {
        node = this.parseExpressionStatement();
      }

  return node;
}

/*
 * @return {Array}
 */
function parseTupleType() {

  var node = this.parseMaybeArguments();

  return node;
}

function parseGeneric() {

  var node = new _nodes2.default.GenericClause();

  this.expect(_labels.TokenList.LT);

  var args = [];
  var id = null;

  while (true) {
    id = this.parseTypeExpression();
    args.push(id);
    if (!this.eat(_labels.TokenList.COMMA)) break;
  };

  this.expect(_labels.TokenList.GT);

  node.arguments = args;

  return node;
}

function parseTypeInheritance() {

  this.expect(_labels.TokenList.COLON);

  var args = [];
  var id = null;

  while (true) {
    id = this.parseLiteral();
    args.push(id);
    if (!this.eat(_labels.TokenList.COMMA)) break;
  };

  return args;
}

},{"../labels":38,"../nodes":39,"../utils":41}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"./scanner":34}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokenize = undefined;
exports.isWhiteSpace = isWhiteSpace;
exports.isLineTerminator = isLineTerminator;

var _char = require('./char');

var _labels = require('../labels');

/**
 * The code below is based on the compiled version of esprima (http://esprima.org/)
 * Small modifications were made, to support swift scanning
 */


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
    var tmp = source[index];
    // Dirty as? as! hack
    if (tmp === "?" || tmp === "!") {
      if (id.trim() === "as") {
        id += tmp;
        index++;
      }
    }
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

function isPunctuator(cp) {
  return cp === 40 || cp === 123 || cp === 46 || cp === 41 || cp === 59 || cp === 44 || cp === 91 || cp === 93 || cp === 58 || cp === 63;
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
    case '~':
      ++index;
      break;
    case '?':
      var before = source.charCodeAt(index - 1);
      var after = source.charCodeAt(index + 1);
      // Swift detects ternary ? by whitespace, on both sides
      if (isWhiteSpace(before) && isWhiteSpace(after)) {
        token.isTernary = true;
      }
      index++;
      break;
    default:
      var buf = "";
      var cp = source.charCodeAt(index);
      var res = "";
      while (!isDecimalDigit(cp) && !isWhiteSpace(cp) && !isPunctuator(cp) && !isIdentifierStart(cp)) {
        buf += source[index];
        index++;
        cp = source.charCodeAt(index);
        if (isKeyword(buf)) {
          res = buf;
        }
        if (isNaN(cp)) break;
      };
      res = res.trim();
      /** Unknown token, so turn into identifier */
      if (_labels.TokenList[buf] === void 0) {
        token.type = _labels.Token.Identifier;
      }
      str = buf.trim();
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
    // Tuple period subscript
    /*if (source.charCodeAt(index) === 0x2E) {
      if (isDecimalDigit(source.charCodeAt(index + 1))) {
        console.log(token);
      }
    }*/
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
      // Example: a.1
      if (extra.tokens[extra.tokens.length - 1].name === _labels.Token.Identifier) {
        return scanPunctuator();
      }
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

  //return scanStringLiteral(); // allows any character!!
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
    if (token.isTernary) {
      entry.isTernary = true;
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

  options.comment = true;

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

},{"../labels":38,"./char":32}],35:[function(require,module,exports){
"use strict";

var _labels = require("./labels");

var _precedence = require("./precedence");

var PREFIX = _labels.TokenList.PREFIX;
var INFIX = _labels.TokenList.INFIX;
var POSTFIX = _labels.TokenList.POSTFIX;

/** PREFIX */
(0, _precedence.registerOperator)("!", -1, "none", "NOT", PREFIX);
(0, _precedence.registerOperator)("~", -1, "none", "BIT_NOT", PREFIX);
(0, _precedence.registerOperator)("+", -1, "none", "UNARY_ADD", PREFIX);
(0, _precedence.registerOperator)("-", -1, "none", "UNARY_SUB", PREFIX);

/** INFIX */
(0, _precedence.registerOperator)("*", 150, "left", "MUL", INFIX);
(0, _precedence.registerOperator)("/", 150, "left", "DIV", INFIX);
(0, _precedence.registerOperator)("%", 150, "left", "MOD", INFIX);
(0, _precedence.registerOperator)("&", 150, "left", "BIT_AND", INFIX);

(0, _precedence.registerOperator)("+", 140, "left", "ADD", INFIX);
(0, _precedence.registerOperator)("-", 140, "left", "SUB", INFIX);

(0, _precedence.registerOperator)("|", 140, "left", "BIT_OR", INFIX);
(0, _precedence.registerOperator)("^", 140, "left", "BIT_XOR", INFIX);

(0, _precedence.registerOperator)("is", 132, "left", "IS", INFIX);
(0, _precedence.registerOperator)("as", 132, "left", "AS", INFIX);
(0, _precedence.registerOperator)("as!", 132, "left", "AS_UNWRAP", INFIX);
(0, _precedence.registerOperator)("as?", 132, "left", "AS_EXPLICIT", INFIX);

(0, _precedence.registerOperator)("??", 131, "right", "NIL_COA", INFIX);

(0, _precedence.registerOperator)("<", 130, "none", "LT", INFIX);
(0, _precedence.registerOperator)("<=", 130, "none", "LE", INFIX);
(0, _precedence.registerOperator)(">", 130, "none", "GT", INFIX);
(0, _precedence.registerOperator)(">=", 130, "none", "GE", INFIX);

(0, _precedence.registerOperator)("==", 130, "none", "EQ", INFIX);
(0, _precedence.registerOperator)("!=", 130, "none", "NEQ", INFIX);

(0, _precedence.registerOperator)("===", 130, "none", "IDENT", INFIX);
(0, _precedence.registerOperator)("!==", 130, "none", "NIDENT", INFIX);

(0, _precedence.registerOperator)("&&", 120, "left", "AND", INFIX);
(0, _precedence.registerOperator)("||", 110, "left", "OR", INFIX);

(0, _precedence.registerOperator)("=", 90, "right", "ASSIGN", INFIX);
(0, _precedence.registerOperator)("*=", 90, "right", "CMP_MUL", INFIX);
(0, _precedence.registerOperator)("/=", 90, "right", "CMP_DIV", INFIX);
(0, _precedence.registerOperator)("%=", 90, "right", "CMP_MOD", INFIX);
(0, _precedence.registerOperator)("+=", 90, "right", "CMP_ADD", INFIX);
(0, _precedence.registerOperator)("-=", 90, "right", "CMP_SUB", INFIX);
(0, _precedence.registerOperator)("&=", 90, "right", "CMP_AND", INFIX);
(0, _precedence.registerOperator)("|=", 90, "right", "CMP_OR", INFIX);
(0, _precedence.registerOperator)("^=", 90, "right", "CMP_XOR", INFIX);
(0, _precedence.registerOperator)("&&=", 90, "right", "CMP_LAND", INFIX);
(0, _precedence.registerOperator)("||=", 90, "right", "CMP_LOR", INFIX);

/** POSTFIX */
(0, _precedence.registerOperator)("--", -1, "none", "POST_SUB", POSTFIX); // removed in swift 3
(0, _precedence.registerOperator)("++", -1, "none", "POST_ADD", POSTFIX); // removed in swift 3

},{"./labels":38,"./precedence":40}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Version
 * @type {String}
 */
var VERSION = exports.VERSION = require("../package.json").version;

/**
 * Default type, if a function
 * has no type assigned
 * @type {String}
 */
var FUNC_DEFAULT_TYPE = exports.FUNC_DEFAULT_TYPE = "Void";

},{"../package.json":1}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = exports.tokenize = exports.parse = undefined;

var _Parser = require("./Parser");

var _Parser2 = _interopRequireDefault(_Parser);

var _Tokenizer = require("./Tokenizer");

var _Tokenizer2 = _interopRequireDefault(_Tokenizer);

require("./build");

var _utils = require("./utils");

var _const = require("./const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parse = function parse(tokens) {
  var parser = new _Parser2.default();
  return parser.parse(tokens);
};

var tokenize = function tokenize(code, opts) {
  var tokenizer = new _Tokenizer2.default();
  return tokenizer.scan(code, opts);
};

(0, _utils.greet)();

exports.parse = parse;
exports.tokenize = tokenize;
exports.VERSION = _const.VERSION;


if (typeof window !== "undefined") {
  window.hevia = {
    parse: parse,
    tokenize: tokenize,
    VERSION: _const.VERSION
  };
}

},{"./Parser":27,"./Tokenizer":33,"./build":35,"./const":36,"./utils":41}],38:[function(require,module,exports){
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

  Label[Label["MemberExpression"] = ++ii] = "MemberExpression";
  Label[Label["TernaryExpression"] = ++ii] = "TernaryExpression";
  Label[Label["BinaryExpression"] = ++ii] = "BinaryExpression";
  Label[Label["UnaryExpression"] = ++ii] = "UnaryExpression";
  Label[Label["CallExpression"] = ++ii] = "CallExpression";
  Label[Label["ParameterExpression"] = ++ii] = "ParameterExpression";
  Label[Label["ClosureExpression"] = ++ii] = "ClosureExpression";
  Label[Label["TrailingClosureExpression"] = ++ii] = "TrailingClosureExpression";

  Label[Label["BlockStatement"] = ++ii] = "BlockStatement";
  Label[Label["ReturnStatement"] = ++ii] = "ReturnStatement";
  Label[Label["IfStatement"] = ++ii] = "IfStatement";
  Label[Label["ForStatement"] = ++ii] = "ForStatement";
  Label[Label["ForInStatement"] = ++ii] = "ForInStatement";
  Label[Label["WhileStatement"] = ++ii] = "WhileStatement";
  Label[Label["RepeatStatement"] = ++ii] = "RepeatStatement";
  Label[Label["ExpressionStatement"] = ++ii] = "ExpressionStatement";
  Label[Label["ArrayExpression"] = ++ii] = "ArrayExpression";
  Label[Label["TypeExpression"] = ++ii] = "TypeExpression";

  Label[Label["AssociativityExpression"] = ++ii] = "AssociativityExpression";
  Label[Label["PrecedenceExpression"] = ++ii] = "PrecedenceExpression";

  Label[Label["FunctionExpression"] = ++ii] = "FunctionExpression";

  Label[Label["ExtensionDeclaration"] = ++ii] = "ExtensionDeclaration";
  Label[Label["ClassDeclaration"] = ++ii] = "ClassDeclaration";
  Label[Label["StructureDeclaration"] = ++ii] = "StructureDeclaration";
  Label[Label["ProtocolDeclaration"] = ++ii] = "ProtocolDeclaration";
  Label[Label["FunctionDeclaration"] = ++ii] = "FunctionDeclaration";
  Label[Label["VariableDeclaration"] = ++ii] = "VariableDeclaration";
  Label[Label["OperatorDeclaration"] = ++ii] = "OperatorDeclaration";
  Label[Label["InitializerDeclaration"] = ++ii] = "InitializerDeclaration";
  Label[Label["TypeAliasDeclaration"] = ++ii] = "TypeAliasDeclaration";
  Label[Label["ImportDeclaration"] = ++ii] = "ImportDeclaration";

  Label[Label["PseudoProperty"] = ++ii] = "PseudoProperty";
  Label[Label["TypeAnnotation"] = ++ii] = "TypeAnnotation";
  Label[Label["Parameter"] = ++ii] = "Parameter";
  Label[Label["TypeCast"] = ++ii] = "TypeCast";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["Literal"] = ++ii] = "Literal";

  Label[Label["GenericClause"] = ++ii] = "GenericClause";

  Label[Label["Comment"] = ++ii] = "Comment";
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
  Label[Label["Tuple"] = ++ii] = "Tuple";
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
  Label[Label["operator"] = ++ii] = "OPERATOR";
  Label[Label["protocol"] = ++ii] = "PROTOCOL";
  Label[Label["static"] = ++ii] = "STATIC";
  Label[Label["struct"] = ++ii] = "STRUCT";
  Label[Label["typealias"] = ++ii] = "TYPEALIAS";
  /** Access control */
  Label[Label["private"] = ++ii] = "PRIVATE";
  Label[Label["public"] = ++ii] = "PUBLIC";
  Label[Label["internal"] = ++ii] = "INTERNAL";
  /** Override */
  Label[Label["override"] = ++ii] = "OVERRIDE";
  Label[Label["final"] = ++ii] = "FINAL";
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

},{"./precedence":40}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _labels = require("./labels");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class AccessControl
 * @private
 */

var AccessControl = function AccessControl() {
  _classCallCheck(this, AccessControl);

  this.isFinal = false;
  this.isPublic = false;
  this.isPrivate = false;
  this.isInternal = false;
};

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
    key: "GenericClause",
    get: function get() {
      return function GenericClause() {
        _classCallCheck(this, GenericClause);

        this.kind = _labels.Types.GenericClause;
        this.arguments = [];
      };
    }
  }, {
    key: "TypeExpression",
    get: function get() {
      return function TypeExpression() {
        _classCallCheck(this, TypeExpression);

        this.kind = _labels.Types.TypeExpression;
        this.type = null;
      };
    }
  }, {
    key: "FunctionExpression",
    get: function get() {
      return function FunctionExpression() {
        _classCallCheck(this, FunctionExpression);

        this.kind = _labels.Types.FunctionExpression;
        this.arguments = [];
        this.type = null;
      };
    }
  }, {
    key: "TrailingClosureExpression",
    get: function get() {
      return function TrailingClosureExpression() {
        _classCallCheck(this, TrailingClosureExpression);

        this.kind = _labels.Types.TrailingClosureExpression;
        this.body = [];
        this.callee = null;
      };
    }
  }, {
    key: "ClosureExpression",
    get: function get() {
      return function ClosureExpression() {
        _classCallCheck(this, ClosureExpression);

        this.kind = _labels.Types.ClosureExpression;
        this.body = [];
        this.signature = [];
      };
    }
  }, {
    key: "Comment",
    get: function get() {
      return function Comment() {
        _classCallCheck(this, Comment);

        this.kind = _labels.Types.Comment;
        this.arguments = [];
      };
    }
  }, {
    key: "TypeAliasDeclaration",
    get: function get() {
      return function TypeAliasDeclaration() {
        _classCallCheck(this, TypeAliasDeclaration);

        this.kind = _labels.Types.TypeAliasDeclaration;
        this.argument = null;
      };
    }
  }, {
    key: "ImportDeclaration",
    get: function get() {
      return function ImportDeclaration() {
        _classCallCheck(this, ImportDeclaration);

        this.kind = _labels.Types.ImportDeclaration;
        this.specifiers = [];
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
    key: "StructureDeclaration",
    get: function get() {
      return function StructureDeclaration() {
        _classCallCheck(this, StructureDeclaration);

        this.kind = _labels.Types.StructureDeclaration;
        this.name = null;
        this.extend = [];
        this.body = [];
      };
    }
  }, {
    key: "ProtocolDeclaration",
    get: function get() {
      return function ProtocolDeclaration() {
        _classCallCheck(this, ProtocolDeclaration);

        this.kind = _labels.Types.ProtocolDeclaration;
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
        this.extend = [];
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
        this.test = null;
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
        this.test = null;
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
    key: "TypeAnnotation",
    get: function get() {
      return function TypeAnnotation() {
        _classCallCheck(this, TypeAnnotation);

        this.kind = _labels.Types.TypeAnnotation;
        this.type = null;
      };
    }
  }, {
    key: "ArrayExpression",
    get: function get() {
      return function ArrayExpression() {
        _classCallCheck(this, ArrayExpression);

        this.kind = _labels.Types.ArrayExpression;
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
    key: "UnaryExpression",
    get: function get() {
      return function UnaryExpression() {
        _classCallCheck(this, UnaryExpression);

        this.kind = _labels.Types.UnaryExpression;
        this.operator = null;
        this.argument = null;
        this.isPrefix = false;
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
exports.POX_PRECEDENCE = exports.PEX_PRECEDENCE = exports.IFX_PRECEDENCE = undefined;
exports.registerOperator = registerOperator;

var _labels = require("./labels");

var IFX_PRECEDENCE = exports.IFX_PRECEDENCE = [];
var PEX_PRECEDENCE = exports.PEX_PRECEDENCE = [];
var POX_PRECEDENCE = exports.POX_PRECEDENCE = [];

/**
 * @param {String} op
 * @param {Number} lvl
 * @param {String} assoc
 * @param {String} name
 * @param {Number} type
 */
function registerOperator(op, lvl, assoc, name, type) {

  var obj = {
    op: op,
    level: lvl,
    associativity: assoc
  };

  // Operator already registered
  if (name in _labels.Operators) {
    // Just update its settings
    _labels.Operators[name] = obj;
    return void 0;
  }

  switch (type) {
    case _labels.TokenList.PREFIX:
      PEX_PRECEDENCE.push(obj);
      break;
    case _labels.TokenList.INFIX:
      IFX_PRECEDENCE.push(obj);
      IFX_PRECEDENCE.sort(function (a, b) {
        if (a.level > b.level) return 1;
        if (a.level < b.level) return -1;
        return 0;
      });
      break;
    case _labels.TokenList.POSTFIX:
      POX_PRECEDENCE.push(obj);
      break;
  };

  (0, _labels.registerTT)(name, op);
  _labels.Operators[name] = obj;
}

},{"./labels":38}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inherit = inherit;
exports.uHash = uHash;
exports.getNameByLabel = getNameByLabel;
exports.getLabelByNumber = getLabelByNumber;
exports.isNumericType = isNumericType;
exports.isBoolean = isBoolean;
exports.isLiteral = isLiteral;
exports.isNativeType = isNativeType;
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

/**
 * @param {Number} n
 * @return {String}
 */
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
 * @param  {Node} node
 * @return {Boolean}
 */
function isBoolean(node) {
  return node.kind === _labels.Types.Literal && (node.type === _labels.TokenList.TRUE || node.type === _labels.TokenList.FALSE);
}

/**
 * @param {Node}
 * @return {Boolean}
 */
function isLiteral(name) {
  switch (name) {
    case _labels.TokenList.NULL:
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
      return true;
      break;
  };
  return false;
}

/**
 * @param {String} value
 * @return {Boolean}
 */
function isNativeType(value) {
  switch (value) {
    case "Void":
    case "Int":
    case "Int8":
    case "Uint8":
    case "Int32":
    case "Int64":
    case "Uint64":
    case "Double":
    case "Float":
    case "Boolean":
    case "String":
    case "Character":
      return true;
      break;
    default:
      return false;
      break;
  };
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
    return "Double";
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