func takeIntToInt(_ f: (Int) -> Int) { }
func takeIntIntToInt(_ f: (Int, Int) -> Int) { }

// Simple closures
func simple() {
  takeIntToInt({(x: Int) -> Int in
    return x + 1
  })
  takeIntIntToInt({(x: Int, y: Int) -> Int in
    return x + y
  })
}