/**
 * Wasm supported
 * @type {Boolean}
 */
export let WASM_SUPPORTED = !!(typeof Wasm !== undefined && Wasm.instantiateModule !== void 0);