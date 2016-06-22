export let Types = {};
export let Token = {};
export let TokenList = {};

let ii = 0;

/** Types */
((Label) => {

  Label[Label["Program"] = ++ii] = "Program";
  Label[Label["BlockStatement"] = ++ii] = "BlockStatement";
  Label[Label["Parameter"] = ++ii] = "Parameter";
  Label[Label["ParameterExpression"] = ++ii] = "ParameterExpression";
  Label[Label["Tuple"] = ++ii] = "Tuple";
  Label[Label["TupleType"] = ++ii] = "TupleType";
  Label[Label["TypeCast"] = ++ii] = "TypeCast";
  Label[Label["BinaryExpression"] = ++ii] = "BinaryExpression";
  Label[Label["CallExpression"] = ++ii] = "CallExpression";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["Literal"] = ++ii] = "Literal";
  Label[Label["UnaryExpression"] = ++ii] = "UnaryExpression";
  Label[Label["FunctionDeclaration"] = ++ii] = "FunctionDeclaration";
  Label[Label["VariableDeclaration"] = ++ii] = "VariableDeclaration";
  Label[Label["ClassDeclaration"] = ++ii] = "ClassDeclaration";
  Label[Label["ExpressionStatement"] = ++ii] = "ExpressionStatement";
  Label[Label["TypeAnnotation"] = ++ii] = "TypeAnnotation";
  Label[Label["VariableDeclarement"] = ++ii] = "VariableDeclarement";
  Label[Label["MemberExpression"] = ++ii] = "MemberExpression";
  Label[Label["TernaryExpression"] = ++ii] = "TernaryExpression";
  Label[Label["PseudoProperty"] = ++ii] = "PseudoProperty";
  Label[Label["ReturnStatement"] = ++ii] = "ReturnStatement";
  Label[Label["IfStatement"] = ++ii] = "IfStatement";
  Label[Label["ForStatement"] = ++ii] = "ForStatement";
  Label[Label["WhileStatement"] = ++ii] = "WhileStatement";
  Label[Label["RepeatStatement"] = ++ii] = "RepeatStatement";

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
  /** Logical operators */
  Label[Label["!"] = ++ii] = "NOT";
  Label[Label["||"] = ++ii] = "OR";
  Label[Label["&&"] = ++ii] = "AND";
  /** Binary operators */
  Label[Label["+"] = ++ii] = "ADD";
  Label[Label["-"] = ++ii] = "SUB";
  Label[Label["*"] = ++ii] = "MUL";
  Label[Label["/"] = ++ii] = "DIV";
  Label[Label["%"] = ++ii] = "MOD";
  /** Compare operators */
  Label[Label["<"] = ++ii] = "LT";
  Label[Label["<="] = ++ii] = "LE";
  Label[Label[">"] = ++ii] = "GT";
  Label[Label[">="] = ++ii] = "GE";
  Label[Label["=="] = ++ii] = "EQ";
  Label[Label["!="] = ++ii] = "NEQ";
  /** Bitwise operators */
  Label[Label["^"] = ++ii] = "BIT_XOR";
  Label[Label["~"] = ++ii] = "BIT_NOT";
  Label[Label["|"] = ++ii] = "BIT_OR";
  Label[Label["&"] = ++ii] = "BIT_AND";
  /** Assignment operators */
  Label[Label["="] = ++ii] = "ASSIGN";
  /** Compound operators */
  Label[Label["+="] = ++ii] = "CMP_ADD";
  Label[Label["-="] = ++ii] = "CMP_SUB";
  Label[Label["*="] = ++ii] = "CMP_MUL";
  Label[Label["/="] = ++ii] = "CMP_DIV";
  Label[Label["%="] = ++ii] = "CMP_MOD";
  /** Bitwise compound operators */
  Label[Label["<<="] = ++ii] = "CMP_LSHIFT";
  Label[Label[">>="] = ++ii] = "CMP_RSHIFT";
  Label[Label["&="] = ++ii] = "CMP_AND";
  Label[Label["|="] = ++ii] = "CMP_OR";
  Label[Label["^="] = ++ii] = "CMP_XOR";
  /** Literals */
  Label[Label["nil"] = ++ii] = "NULL";
  Label[Label["true"] = ++ii] = "TRUE";
  Label[Label["false"] = ++ii] = "FALSE";
  /** Declaration keywords */
  Label[Label["func"] = ++ii] = "FUNCTION";
  Label[Label["var"] = ++ii] = "VAR";
  Label[Label["let"] = ++ii] = "CONST";
  Label[Label["class"] = ++ii] = "CLASS";
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