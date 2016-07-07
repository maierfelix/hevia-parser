let a:Int = 1+4/5*4+51+(4*(945+94/748)+44+2)+56;
let b:Int = 1 > 2;
let c:Int = 1 < 2;
let d:Int = 1 >= 2;
let e:Int = 1 <= 2;
let f:Int = true && true;
let g:Int = 1 == 1 && 2 == 3;

expect(a == 3937.7026737967913);
expect(b == false);
expect(c == true);
expect(d == false);
expect(e == true);
expect(f == true);
expect(g == false);