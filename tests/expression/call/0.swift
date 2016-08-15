func power(a:Double, _ b:Double) -> Double {
  return (pow(a, b));
}

var x = y().z.aa();
var bb = cc(dd().ee).ff();
var bb = cc(dd(1, 2).ee, 1337).ff(66);
var a:Int = a.b + c.d;

var b:Double = pow(2, 4) + pow(2, 2 * 3);
var c:Double = power(a:2, 4) + power(a:2, 4);

expect(b == 80.0);
expect(c == 32.0);