import { inherit } from "../utils";

import * as classes from "./class";

/**
 * Runtime
 * @class Runtime
 * @export
 */
export default class Runtime {

  /** @constructor */
  constructor() {

    this.global = {
      print: function() {
        console.log.apply(console, arguments);
      }
    };

  }

}

inherit(Runtime, classes);