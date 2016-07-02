var a = 1;
var b = 2;
var c = 3;
var d = 4;
var e = 5;
var f = 6;
var g = 7;
var h = 8;
var i = 9;
var j = 10;
var k = 11;

var z = a || b && c || d > e && f == g < h >= i + j * k;

expect(z == 1);