var x = 0, y = 1, z = 2;
var a = x || y && z;

expect(a == z);