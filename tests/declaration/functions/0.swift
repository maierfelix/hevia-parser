func test1()->Int {
  return 1337;
}

expect(test1() + test1() == 2674);