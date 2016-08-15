{ (_ number:Int) -> Bool in return number % 2 == 0 }
var closureName: (ParameterTypes) -> (ReturnType)
myfunction({(ParameterTypes) -> (ReturnType) in statements})
array.sort({ (item1: Int, item2: Int) -> Bool in return item1 < item2 })
array.sort({ (item3, item4) -> Bool in return item3 < item4 })
array.sort({ (item5, item6) in return item5 < item6 })
array.sort { (item7, item8) in return item7 < item8 }
array.sort { return $0 < $1 }
array.sort { $2 < $3 }

AnonymousFunction1( { (number1: Int) -> Bool in number1 < 0 } )
AnonymousFunction2 { (number2: Int) -> Bool in number2 < 0 }
AnonymousFunction3 { (number3) -> Bool in number3 < 0 }
AnonymousFunction4 { number4 -> Bool in number4 < 0 }
AnonymousFunction5 { number5 in number5 < 0 }
AnonymousFunction6 { $0 < 0 }

var reversed = names.sort({ (s1: String, s2: String) -> Bool in
  return s1 > s2
})

typealias NamedCheck = (number: Int) -> Bool
let f: NamedCheck = { $0 < 5 }
f(number: 1)
NamedFunction(f)

//Test( { $0 < 1 } as Double);

let strings = numbers.map {
  (number) -> String in
  var number = number
  var output = ""
  while number > 0 {
    output = digitNames[number % 10]! + output
    number /= 10
  }
  return output
}