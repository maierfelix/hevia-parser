var a = !true;
var b = !a;
var c = !(!a);

expect(a == false);
expect(b == true);
expect(c == false);