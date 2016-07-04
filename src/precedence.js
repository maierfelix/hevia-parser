import {
  Operators,
  TokenList as TT,
  registerTT
} from "./labels";

export let IFX_PRECEDENCE = [];
export let PEX_PRECEDENCE = [];
export let POX_PRECEDENCE = [];

export function registerOperator(op, lvl, assoc, name, type) {

  let obj = {
    op: op,
    level: lvl,
    associativity: assoc
  };

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
  };

  registerTT(name, op);
  Operators[name] = obj;

}