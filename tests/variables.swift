/** Variable declarations */
var a = 0;
var b = 1;
var c:Int = 2 * 2;
var d:Int = 5.75 * 2.0 + 4;

var (first, second) = (10, 7 * 6);
var (a1, b1, c1) = (22, 33 * 2, 8);

var gender:String

var double:Int {
  return 2 * 2
}

expect(a == 0);
expect(b == 1);
expect(d == 4);
expect(c == 15.5);

expect(first == 10);
expect(second == 42);

expect(a1 == 22);
expect(b1 == 66);
expect(c1 == 8);

expect(gender == null);

expect(double == 4);