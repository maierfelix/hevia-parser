/**
 * This file contains all shit, to
 * provide a clean & fast way, to compare
 * nodes and tokens in later steps
 */

import {
  registerOperator
} from "./precedence";

export let Types = {};
export let Token = {};
export let TokenList = {};
export let Operators = {};

let ii = 0;

/** Types */
((Label) => {

  Label[Label["Program"] = ++ii] = "Program";

  Label[Label["MemberExpression"] = ++ii] = "MemberExpression";
  Label[Label["TernaryExpression"] = ++ii] = "TernaryExpression";
  Label[Label["BinaryExpression"] = ++ii] = "BinaryExpression";
  Label[Label["UnaryExpression"] = ++ii] = "UnaryExpression";
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
  Label[Label["ArrayExpression"] = ++ii] = "ArrayExpression";

  Label[Label["ExtensionDeclaration"] = ++ii] = "ExtensionDeclaration";
  Label[Label["ClassDeclaration"] = ++ii] = "ClassDeclaration";
  Label[Label["StructureDeclaration"] = ++ii] = "StructureDeclaration";
  Label[Label["ProtocolDeclaration"] = ++ii] = "ProtocolDeclaration";
  Label[Label["FunctionDeclaration"] = ++ii] = "FunctionDeclaration";
  Label[Label["VariableDeclaration"] = ++ii] = "VariableDeclaration";
  Label[Label["OperatorDeclaration"] = ++ii] = "OperatorDeclaration";
  Label[Label["InitializerDeclaration"] = ++ii] = "InitializerDeclaration";
  Label[Label["ImportDeclaration"] = ++ii] = "ImportDeclaration";

  Label[Label["PseudoProperty"] = ++ii] = "PseudoProperty";
  Label[Label["TypeAnnotation"] = ++ii] = "TypeAnnotation";
  Label[Label["Parameter"] = ++ii] = "Parameter";
  Label[Label["TypeCast"] = ++ii] = "TypeCast";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["Literal"] = ++ii] = "Literal";

  Label[Label["AssociativityExpression"] = ++ii] = "AssociativityExpression";
  Label[Label["PrecedenceExpression"] = ++ii] = "PrecedenceExpression";

  Label[Label["Comment"] = ++ii] = "Comment";

})(Types);

/** Data types */
((Label) => {

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
((Label) => {

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
(() => {
  let index = 0;
  let length = Object.keys(TokenList).length;
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
export function registerTT(name, value) {
  TokenList[TokenList[value] = ++ii] = name;
  TokenList[TokenList[ii]] = ii;
}