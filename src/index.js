import Parser from "./Parser";
import Tokenizer from "./Tokenizer";

const parse = (tokens) => {

  let parser = new Parser();

  return (
    parser.parse(tokens)
  );

};

const tokenize = (code, opts) => {

  let tokenizer = new Tokenizer();

  return (tokenizer.scan(code, opts));

};

const version = "0.0.1";

let src = `
var x = y().z.aa();
var bb = cc(dd().ee).ff();
var bb = cc(dd(1, 2).ee, 1337).ff(66);

var a = a is Int;
var b = b as Int;
var c = c as? Int;
var d = d as! Int;

for var a:Int = 5; a < 10; {
  print(a)
}
for (var a:Int = 5; a < 10; a += 1) {
  print(a)
}
while 10 < 20 {
  print(1337)
}

repeat {
  print(1337)
  print(1338)
} while 10 < 20

var tuple:(Double, Double) = (3.14159, 2.71828);
var (firstNumber, secondNumber) = (10, 42);
var (f, g) = (5, 9.45);
var (h, _) = (6, 3.45);
var (i, _, (j, k)) = (7, 9.45);
var (l, _) = (8.5, 9.45, (12, 3));
var (m, _, (n, o)) = (2, 9.45, (12, 3));
var p = (10, 20, 30);

var x = 0;
var x:Int {
  set(a) {
    x = a / 2
  }
  get {
    return x * 2
  }
  willSet(b) {
    return 2;
  }
  didSet(c) {
    return (4 * 1);
  }
}

var gg = 1 > 2 ? 1 * 10 : 1 * 2.5;
var bb = true ? 1 ? 1 : 0 : false;

/** Variable declarations */
var a = 0;
var b = 0;
var c:Int = 0;
var d:Int = 2 * 2;
var e:Int = 2 * 3 / 4;
var a = 5.square();
var c = 5.75 * 2.0 + 4;
`;

swift.innerHTML = src;

let tokens = tokenize(src);

let pp = new Parser();
for (let key in tokens) {
  //console.log(pp.getNameByLabel(tokens[key].name));
};

console.log(parse(tokens));

export {
  parse,
  tokenize,
  version
}