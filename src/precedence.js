/**
 * Operator precedence
 */

import {
  TokenList as TT
} from "./labels";

export const Precedence = [
  [TT.ASSIGN],
  [TT.OR],
  [TT.AND],
  [TT.BIT_OR],
  [TT.BIT_XOR],
  [TT.BIT_AND],
  [TT.EQ, TT.NEQ],
  [TT.LT, TT.GT, TT.LE, TT.GE],
  [TT.LSHIFT, TT.RSHIFT],
  [TT.ADD, TT.SUB],
  [TT.MUL, TT.DIV, TT.MOD],
  [TT.CMP_OR],
  [TT.CMP_XOR],
  [TT.CMP_AND],
  [TT.CMP_LSHIFT, TT.CMP_RSHIFT],
  [TT.CMP_ADD, TT.CMP_SUB],
  [TT.CMP_MUL, TT.CMP_DIV]
];