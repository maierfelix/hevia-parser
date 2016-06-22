import { inherit } from "../utils";

/** Parser methods */
import * as parse from "./parse";

/** Expressions */
import * as atoms from "./expression/atom";
import * as casts from "./expression/cast";
import * as tuples from "./expression/tuple";
import * as binaries from "./expression/binary";
import * as expressions from "./expression";

/** Branches */
import * as branches from "./branch";
import * as guards from "./branch/guard";
import * as ifelse from "./branch/ifelse";
import * as pseudos from "./branch/pseudo";
import * as switches from "./branch/switch";

/** Globals */
import * as loops from "./loop";
import * as types from "./type";
import * as parameters from "./parameter";
import * as statements from "./statement";

/** Declarations */
import * as structs from "./declare/struct";
import * as classes from "./declare/class";
import * as imports from "./declare/import";
import * as functions from "./declare/function";
import * as protocols from "./declare/protocol";
import * as variables from "./declare/variable";
import * as declarations from "./declare";
import * as extensions from "./declare/extension";

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
     * Current scope
     * @type {Scope}
     */
    this.scope = null;

  }

}

inherit(Parser, parse);

inherit(Parser, casts);
inherit(Parser, atoms);
inherit(Parser, binaries);
inherit(Parser, expressions);

inherit(Parser, guards);
inherit(Parser, ifelse);
inherit(Parser, pseudos);
inherit(Parser, switches);
inherit(Parser, branches);

inherit(Parser, loops);
inherit(Parser, types);
inherit(Parser, tuples);
inherit(Parser, branches);
inherit(Parser, parameters);
inherit(Parser, statements);

inherit(Parser, imports);
inherit(Parser, classes);
inherit(Parser, structs);
inherit(Parser, protocols);
inherit(Parser, functions);
inherit(Parser, variables);
inherit(Parser, extensions);
inherit(Parser, declarations);