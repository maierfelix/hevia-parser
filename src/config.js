/**
 * Wasm supported
 * @type {Boolean}
 */
export let WASM_SUPPORTED = !!(typeof Wasm !== undefined && Wasm.instantiateModule !== void 0);

/**
 * Supported swift release
 * @type {Object}
 */
export const SWIFT = {
  version: `3.0`,
  date: 1465776000
};