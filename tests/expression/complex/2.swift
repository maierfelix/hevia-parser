prefix operator √ {}
prefix func √ (number: Double) -> Double {
  return sqrt(number)
}

postfix operator ++ {}
postfix func ++ (value: Double) -> Double {
  return (value + 1);
}

expect(5-- + !(√4==2++));