import { inherit } from "../utils";

/** Parser methods */
import * as parse from "./parse";

/** Expressions */
import * as args from "./expression/args";
import * as atoms from "./expression/atom";
import * as arrays from "./expression/array";
import * as unaries from "./expression/unary";
import * as binaries from "./expression/binary";
import * as literals from "./expression/literal";
import * as expressions from "./expression";

/** Branches */
import * as branches from "./branch";
import * as guards from "./branch/guard";
import * as ifelse from "./branch/if";
import * as pseudos from "./branch/pseudo";
import * as switches from "./branch/switch";

/** Globals */
import * as loops from "./loop";
import * as types from "./type";
import * as accesses from "./access";
import * as closures from "./closure";
import * as comments from "./comment";
import * as statements from "./statement";

/** Declarations */
import * as structs from "./declare/struct";
import * as classes from "./declare/class";
import * as imports from "./declare/import";
import * as functions from "./declare/function";
import * as protocols from "./declare/protocol";
import * as variables from "./declare/variable";
import * as operators from "./declare/operator";
import * as extensions from "./declare/extension";
import * as typealiases from "./declare/typealias";
import * as declarations from "./declare";

/**
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
     * Inside ternary expr
     * @type {Boolean}
     */
    this.inTernary = false;

  }

}

inherit(Parser, parse);

inherit(Parser, args);
inherit(Parser, atoms);
inherit(Parser, arrays);
inherit(Parser, unaries);
inherit(Parser, binaries);
inherit(Parser, literals);
inherit(Parser, expressions);

inherit(Parser, guards);
inherit(Parser, ifelse);
inherit(Parser, pseudos);
inherit(Parser, switches);
inherit(Parser, branches);

inherit(Parser, loops);
inherit(Parser, types);
inherit(Parser, branches);
inherit(Parser, comments);
inherit(Parser, accesses);
inherit(Parser, closures);
inherit(Parser, statements);

inherit(Parser, imports);
inherit(Parser, classes);
inherit(Parser, structs);
inherit(Parser, protocols);
inherit(Parser, functions);
inherit(Parser, variables);
inherit(Parser, operators);
inherit(Parser, extensions);
inherit(Parser, typealiases);
inherit(Parser, declarations);