var someScore = ("John", 55)

var anotherScore = someScore
anotherScore.0 = "Robert"

expect(anotherScore.1 === 55);
expect(anotherScore.0 === "Robert");
expect(someScore.0 === "John");