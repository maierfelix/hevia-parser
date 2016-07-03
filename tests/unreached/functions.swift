var me:Int = 22;

/*func tuple(aa:Int, bb:Int) -> (aa: Int, bb: Int) {
  return (aa * 2, bb * 2);
}*/

func test1()->Int {
  return 1337;
}

func test2(_ c:Int) -> Int {
  return (c * 10);
}

func test3(e: inout Int) {
  e *= 4;
}

func test4(g:Int, to h:Int) -> Int {
  return (g + h);
}

func test5(m:Int, _ n: inout Int) {
  n *= 2;
  expect((m * n) == 1760);
}

func test6(_ a: Int) -> Int {
  return a
}

func test7(_: Int) -> Int {
  return 4
}

/*expect(tuple(aa:1, bb:2));*/

expect(test1() + test1() == 2674);

expect(test2(44) == 440);

expect(me == 22);
test3(e: &me);
expect(me == 88);

expect(test4(g: 22, to: 33) == 55);

expect(me == 88);
test5(m:10, &me);
expect(me == 176);