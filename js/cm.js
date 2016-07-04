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

/** Styling */
var nodes = document.getElementsByClassName("CodeMirror");
for (let key in nodes) {
  if (nodes[key] instanceof HTMLElement) {
    nodes[key].classList.add("txt");
  }
};