import {
  Token,
  Types as Type,
  TokenList as TT
} from "./labels";

import {
  registerOperator
} from "./precedence";

let PREFIX = TT.PREFIX;
let INFIX = TT.INFIX;
let POSTFIX = TT.POSTFIX;

/** PREFIX */
registerOperator("!", -1, "none", "NOT", PREFIX);
registerOperator("~", -1, "none", "BIT_NOT", PREFIX);
registerOperator("+", -1, "none", "UNARY_ADD", PREFIX);
registerOperator("-", -1, "none", "UNARY_SUB", PREFIX);

registerOperator("++", -1, "none", "PRE_ADD", PREFIX); // removed in swift 3
registerOperator("--", -1, "none", "PRE_SUB", PREFIX); // removed in swift 3

/** INFIX */
registerOperator("*", 150, "left", "MUL", INFIX);
registerOperator("/", 150, "left", "DIV", INFIX);
registerOperator("%", 150, "left", "MOD", INFIX);
registerOperator("&", 150, "left", "BIT_AND", INFIX);

registerOperator("+", 140, "left", "ADD", INFIX);
registerOperator("-", 140, "left", "SUB", INFIX);

registerOperator("|", 140, "left", "BIT_OR", INFIX);
registerOperator("^", 140, "left", "BIT_XOR", INFIX);

registerOperator("is", 132, "left", "IS", INFIX);
registerOperator("as", 132, "left", "AS", INFIX);
registerOperator("as!", 132, "left", "AS_UNWRAP", INFIX);
registerOperator("as?", 132, "left", "AS_EXPLICIT", INFIX);

registerOperator("??", 131, "right", "NIL_COA", INFIX);

registerOperator("<", 130, "none", "LT", INFIX);
registerOperator("<=", 130, "none", "LE", INFIX);
registerOperator(">", 130, "none", "GT", INFIX);
registerOperator(">=", 130, "none", "GE", INFIX);

registerOperator("==", 130, "none", "EQ", INFIX);
registerOperator("!=", 130, "none", "NEQ", INFIX);

registerOperator("===", 130, "none", "IDENT", INFIX);
registerOperator("!==", 130, "none", "NIDENT", INFIX);

registerOperator("&&", 120, "left", "AND", INFIX);
registerOperator("||", 110, "left", "OR", INFIX);

registerOperator("=", 90, "right", "ASSIGN", INFIX);
registerOperator("*=", 90, "right", "CMP_MUL", INFIX);
registerOperator("/=", 90, "right", "CMP_DIV", INFIX);
registerOperator("%=", 90, "right", "CMP_MOD", INFIX);
registerOperator("+=", 90, "right", "CMP_ADD", INFIX);
registerOperator("-=", 90, "right", "CMP_SUB", INFIX);
registerOperator("&=", 90, "right", "CMP_AND", INFIX);
registerOperator("|=", 90, "right", "CMP_OR", INFIX);
registerOperator("^=", 90, "right", "CMP_XOR", INFIX);
registerOperator("&&=", 90, "right", "CMP_LAND", INFIX);
registerOperator("||=", 90, "right", "CMP_LOR", INFIX);

/** POSTFIX */
registerOperator("--", -1, "none", "POST_SUB", POSTFIX); // removed in swift 3
registerOperator("++", -1, "none", "POST_ADD", POSTFIX); // removed in swift 3