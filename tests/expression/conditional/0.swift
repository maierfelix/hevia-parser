var x = 2;var y = 2;

var gg = 1 > 2 ? 1 * 10 : 1 * 2.5;
var bb = true ? 1 ? 1 : 0 : false;

expect(gg == 2.5);
expect(bb == 1);

expect((x && y ? 1 : 2));
expect((x == y ? 1 : 2) == 1);