infix operator ** {
  associativity left
  precedence 160
}
func ** (left: Double, right: Double) -> Double {
  return pow(left, right);
}
print(2 ** 8);