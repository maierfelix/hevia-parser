var a = 10;
var result:Int = 0;
if (a > 10) {
  result = 0;
} else if (a > 100) {
  result = 1;
} else {
  result = 0;
}

expect(result == 0);

if (result == 0) {
  result = 1337;
}

expect(result == 1337);

if (result == 1337) {
  result = 1338;
} else {
  result = 1336;
}

expect(result == 1338);