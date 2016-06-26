var src = 
`infix operator ** {
  associativity left
  precedence 160
}
func ** (left: Double, right: Double) -> Double {
  return pow(left, right);
}
func test(a:Int) -> Int {
  return (a * a);
}
var b = 7 * 6;
var c = test(b);
var d = b + c;
print(2 / 3);
print(2 ** 8);
`;

swift.innerHTML = src;

function execute() {
  new Function("__global", out.value)(hevia.global);
}

function build() {

  var tokens = hevia.tokenize(swift.value);
  var ast = hevia.parse(tokens);
  var code = hevia.compile(ast, "JS");

  out.innerHTML = code;

}

run.addEventListener('click', execute, false);
compile.addEventListener('click', build, false);