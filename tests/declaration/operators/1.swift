infix operator °°°° {
  associativity left
  precedence 160
}
func °°°° (left:Int, right:Int)->Int{
  return pow(left, right);
}

expect(2°°°°7*7 == 98);