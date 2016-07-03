// **
infix operator ** {
  associativity left
  precedence 160
}
func ** (left: Double, right: Double) -> Double {
  return pow(left, right);
}

// %%
infix operator %% {
  associativity left
  precedence 2
}
func %%(a: Int, b: Int) -> Int {
  return (a * b);
}

var res1 = 2 ** 8;
expect(res1 == 256.0);

var res2 = 4 % 2 + 27 %% 123;
expect(res2 == 3321);