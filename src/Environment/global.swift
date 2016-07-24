module.exports = `

/**
 * #BIND_JS_CTX
 */

func pow(_ a:Double, _ b:Double) -> Double {
  return (
    Math.pow(a, b)
  );
}

func print() -> Void {
  console.log.apply(console, arguments);
}

func expect(truth:Bool) -> Void {
  if (!truth) {
    console.error("Expection error!");
  }
}

func clone(obj) {
  return (JSON.parse(JSON.stringify(obj)));
}

`;