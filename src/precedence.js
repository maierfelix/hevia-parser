import {
  Operators,
  TokenList as TT,
  registerTT
} from "./labels";

export let IFX_PRECEDENCE = [];
export let PEX_PRECEDENCE = [];
export let POX_PRECEDENCE = [];

/**
 * @param {String} op
 * @param {Number} lvl
 * @param {String} assoc
 * @param {String} name
 * @param {Number} type
 */
export function registerOperator(op, lvl, assoc, name, type) {

  let obj = {
    op: op,
    level: lvl,
    associativity: assoc
  };

  // Operator already registered
  if (name in Operators) {
    // Just update its settings
    Operators[name] = obj;
    return void 0;
  }

  switch (type) {
    case TT.PREFIX:
      PEX_PRECEDENCE.push(obj);
    break;
    case TT.INFIX:
      IFX_PRECEDENCE.push(obj);
      IFX_PRECEDENCE.sort(function(a, b) {
        if (a.level > b.level) return 1;
        if (a.level < b.level) return -1;
        return 0;
      });
    break;
    case TT.POSTFIX:
      POX_PRECEDENCE.push(obj);
    break;
  };

  registerTT(name, op);
  Operators[name] = obj;

}