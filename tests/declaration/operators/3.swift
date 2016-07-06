prefix operator √ {}
prefix func √ (number: Double) -> Double {
  return sqrt(number)
}

expect(√4 == 2);