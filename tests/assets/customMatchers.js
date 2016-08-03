function checkType(util, customEqualityTesters) {
  return {
    compare: function(actual, expected) {
      var result = {};
      switch(expected.toLowerCase()) {
        case 'promise':
          result.pass = util.equals(typeof actual, 'object', customEqualityTesters) && util.equals(typeof actual.done, 'function', customEqualityTesters);
          break;

        case 'array':
          result.pass = util.equals(Object.prototype.toString.call(actual), '[object Array]', customEqualityTesters);
          break;

        default:
          result.pass = util.equals(typeof actual, expected, customEqualityTesters);
          break;
      }

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
