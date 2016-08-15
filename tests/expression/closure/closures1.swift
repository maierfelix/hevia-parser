// case 1
func filterInts(_ number: Int, _ includeNumber: (Int) -> Bool) -> Int {}

func isEven(_ n:Int) -> Bool {
  return n % 2 == 0
}

let number = 3; // number to check, if even
let evenNumber = filterInts(number, isEven);

// case 2
func filterInts(_ number: Int, _ includeNumber: (Int) -> Bool) -> Int {}

let evenNumbers = filterInts([2, 5, 1, 3]) { $0 % 2 == 0 }; // trailing closure

// case 3
let evenDigitSums = filterInts(numbers) { number in

  var sum = 0, number = number

  while number > 0 {
    // blabla
  }

  return sum % 2 == 0

}

// case 4
let names = ["i", "am", "silly"];

let shortNames = filterStrings(names) { name in
  name.characters.count < 5
}

print(shortNames);

// case 5
func filter(array:[Int], _ isEven: (Int) -> Bool) -> [Int] {
  for ii in array {
    if isEven(ii) {
      print("Ok", ii);
    }
  };
  return [1337]
}

let numbers = filter([2, 3, 1, 5, 7]) { $0 % 2 == 0 }