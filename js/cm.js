/** SWIFT */
var editor_swift = CodeMirror.fromTextArea(document.getElementById("swift"), {
  lineNumbers: false,
  mode: "text/x-swift",
  matchBrackets: true,
  theme: "seti"
});
editor_swift.on("change", function() {
  compile();
});
/** JS */
var editor_js = CodeMirror.fromTextArea(document.getElementById("out"), {
  lineNumbers: false,
  mode: "text/javascript",
  matchBrackets: true,
  theme: "seti"
});