version.innerHTML = "v" + hevia.VERSION;
var src = 
`infix operator ⚡⚡⚡ {
  associativity left
  precedence 160
}
func ⚡⚡⚡(left:Int,right:Int)->Int{
  return (left * right);
}

print(2⚡⚡⚡7*7 == 98);

class H {
  func f(_ x: Int) { }
}

class HDerived : H {
  override func f(_ x: inout Int) { }
}`;

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