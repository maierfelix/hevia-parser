version.innerHTML = "v" + hevia.VERSION;
var src = 
`
var closure3a : () -> () -> (Int,Int) = {{ (4, 2) }}
_ = f1(x: 1, y: 2);

class C {
  func map(_ x: (Int) -> Int) -> C { return self }
  func filter(_ x: (Int) -> Bool) -> C { return self }
}

var a = C().map {$0 + 1}.filter {$0 % 3 == 0}

var b = C().map {$0 + 1}.filter {$0 % 3 == 0}

var c = C().map {
  $0 + 1
}
`;

swift.innerHTML = src;

var ast = null;

function build(value) {
  var tokens = hevia.tokenize(value);
  ast = hevia.parse(tokens);
  console.log(ast);
  ast = JSON.stringify(ast, null, "  ");
  return (ast);
}

function parse() {
  var code = build(editor_swift.getValue());
  editor_js.setValue(ast);
}

com.addEventListener('click', function() {
  parse();
}, false);

download.addEventListener('click', function() {
  createDownloadLink(ast, "ast.json");
});

out.innerHTML = build(swift.value);

function createDownloadLink(str, name) {
  if (window.navigator.msSaveOrOpenBlob) {
    var data = [str];
    var blob = new Blob(data);
    download.onclick = function() {
      window.navigator.msSaveOrOpenBlob(blob, name);
    };
  } else {
    var url = "data:text/plain;charset=utf-8," + encodeURIComponent(str);
    download.setAttribute("download", name);
    download.setAttribute("href", url);
  }
}