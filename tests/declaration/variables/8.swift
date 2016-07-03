var a = true;
var b = a == false;
var c = b ? false : true;

var d = c == true;

expect(d == true);