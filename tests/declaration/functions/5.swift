// #1
func swap(a: inout Int, _ b: inout Int) {
  let tmp:Int = a;
  a = b;
  b = tmp;
}

var a1 = 22;
var b1 = 33;

expect(a1 == 22); expect(b1 == 33);
swap(a: &a1, &b1);
expect(a1 == 33); expect(b1 == 22);

// #2
var me = 22;

func test3(e: inout Int) {
  e *= 4;
}

expect(me == 22);
test3(e: &me);
expect(me == 88);