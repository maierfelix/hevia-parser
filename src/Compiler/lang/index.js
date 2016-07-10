import { inherit } from "../../utils";

/** Java */
import * as index_java from "./Java";

/** JavaScript */
import * as index_js from "./JavaScript";
import * as args_js from "./JavaScript/args";
import * as literals_js from "./JavaScript/literal";
import * as expressions_js from "./JavaScript/expression";
import * as declarations_js from "./JavaScript/declaration";

let Java = {
  index_java
};

let JavaScript = {
  args_js,
  index_js,
  literals_js,
  expressions_js,
  declarations_js
};

export {
  Java,
  JavaScript
}