func tuple(aa:Int, bb:Int) -> (aa: Int, bb: Int) {
  return (aa * 2, bb * 2);
}

func mul(aa:Int, bb:Int) -> (aa: Int, bb: Int) {
  return (aa * bb);
}

func a() {
  return 1337 * 4;
}

func b(c:Int) -> Int {
  return (a);
}

func d(e: inout Int) {
  a *= 2;
}

func f(g:Int, to h:Int) -> Int {
  return (b + a);
}

func i(j:Int, _ k:Int) {
  print(a * b);
}

func l(m:Int, _ n: inout Int) {
  print(a * b);
}

print(mul(a:2, to:668.5)); // 1337

var s:Int = mul(a:2, 4) + mul(a:2, 4); // 16
print(s);