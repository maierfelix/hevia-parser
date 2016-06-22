/**
 * @param {Object} cls
 * @param {Object} prot
 * @export
 */
export function inherit(cls, prot) {

  let key = null;

  for (key in prot) {
    if (prot[key] instanceof Function) {
      cls.prototype[key] = prot[key];
    }
  };

}

let hashIndex = -1;
let hashes = [];

/**
 * Generate a unique hash
 * @return {Number}
 * @export
 */
export function uHash() {

  let index = ++hashIndex;

  if (hashes.indexOf(index) > -1) return (this.uHash());

  hashes.push(index);

  return (index);

}