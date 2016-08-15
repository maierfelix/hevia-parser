func getAHighScore() -> (name: String, score: Int) {
  let theName = "Patricia"
  let theScore = 3894
  
  return (theName, theScore)
}

let a = getAHighScore();

expect(a.0 == "Patricia");
expect(a.1 == 3894);