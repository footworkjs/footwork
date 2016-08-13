define(['lodash'],
  function(_) {
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

    function checkLength(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var result = {
            pass: util.equals(Object.prototype.toString.call(actual), '[object Array]', customEqualityTesters) && util.equals(actual.length, expected, customEqualityTesters)
          };

          if(!result.pass) {
            result.message = '\'' + (typeof actual) + '\' is not ' + expected + ' elements in length';
          }
          return result;
        }
      };
    }

    function checkLengthGreaterThan(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var result = {
            pass: !_.isUndefined(actual) && actual.length > expected
          };

          if(!result.pass) {
            result.message = '\'' + (typeof actual) + '\' is not ' + expected + ' elements in length';
          }
          return result;
        }
      };
    }

    function checkForExternallyLoadedModule(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var result = { pass: !!loadedModules[actual] };
          if(!result.pass) {
            result.message = 'Expected \'' + actual + '\' requirejs module to have been loaded.';
          }
          return result;
        }
      };
    }

    return {
      toBeA: checkType,
      toBeAn: checkType,
      lengthToBe: checkLength,
      lengthToBeGreaterThan: checkLengthGreaterThan,
      toBeLoaded: checkForExternallyLoadedModule
    };
  }
);
