/** SWIFT */
var editor_swift = CodeMirror.fromTextArea(document.getElementById("swift"), {
  lineNumbers: true,
  mode: "text/x-swift",
  matchBrackets: true,
  theme: "seti",
  autofocus: true
});
editor_swift.on("change", function() {
  editor_js.setValue("");
  parse();
});

/** JS */
var editor_js = CodeMirror.fromTextArea(document.getElementById("out"), {
  lineNumbers: true,
  mode: "text/javascript",
  matchBrackets: true,
  theme: "seti",
  readOnly: true
});

/** Styling */
var nodes = document.getElementsByClassName("CodeMirror");
for (let key in nodes) {
  if (nodes[key] instanceof HTMLElement) {
    nodes[key].classList.add("txt");
  }
};