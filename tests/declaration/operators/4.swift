postfix operator %% {}
 
postfix func %% (percentage: Double) -> Double {
  return (percentage / 100);
}

expect(1%% == 0.01);