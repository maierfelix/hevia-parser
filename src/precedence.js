/**
 * Operator precedence
 */

import {
  Operators,
  TokenList as TT,
  registerTT
} from "./labels";

export let Precedence = [];

export function registerOperator(op, lvl, assoc, name) {
  let obj = {
    op: op,
    level: lvl,
    associativity: assoc
  };
  Precedence.push(obj);
  Precedence.sort(function(a, b) {
    if (a.level > b.level) return 1;
    if (a.level < b.level) return -1;
    return 0;
  });
  registerTT(name, op);
  Operators[name] = obj;
}