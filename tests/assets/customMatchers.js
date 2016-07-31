function checkType(util, customEqualityTesters) {
  return {
    compare: function(actual, expected) {
      var result = {};
      result.pass = util.equals(typeof actual, expected, customEqualityTesters);
      if(!result.pass) {
        result.message = '\'' + (typeof actual) + '\' is not a ' + expected;
      }
      return result;
    }
  };
}

var customMatchers = {
  toBeA: checkType,
  toBeAn: checkType
};
