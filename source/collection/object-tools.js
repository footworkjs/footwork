var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * Note: object 'a' can provide a regex value for a property and have it searched matching on the regex value
 * @param  {object} a Object to compare (which can contain regex values for properties)
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function regExpIsEqual (a, b, isEq) {
  isEq = isEq || regExpIsEqual;

  if (_.isObject(a) && _.isObject(b)) {
    return _.every(_.reduce(a, function (comparison, paramValue, paramName) {
      var isCongruent = false;
      var bParamValue = b[paramName];
      if (bParamValue) {
        if (_.isRegExp(paramValue)) {
          isCongruent = !_.isNull(bParamValue.match(paramValue));
        } else {
          isCongruent = isEq(paramValue, bParamValue);
        }
      }

      comparison.push(isCongruent);
      return comparison;
    }, []));
  } else {
    return a === b;
  }
}

/**
 * Performs an equality comparison between two objects while ensuring atleast one or more keys/values match and that all keys/values from object A also exist in B
 * In other words: A == B, but B does not necessarily == A
 * @param  {object} a Object to compare
 * @param  {object} b Object to compare
 * @param  {function} isEqual evauluator to use (optional)
 * @return boolean   Result of equality comparison
 */
function sortOfEqual (a, b, isEq) {
  isEq = isEq || _.isEqual;

  if (_.isObject(a) && _.isObject(b)) {
    var AKeys = _.keys(a);
    var BKeys = _.keys(b);
    var commonKeys = _.intersection(AKeys, BKeys);
    var hasAllAKeys = _.every(AKeys, function (Akey) {
      return BKeys.indexOf(Akey) !== -1;
    })
    return commonKeys.length > 0 && hasAllAKeys && isEq(_.pick(a, commonKeys), _.pick(b, commonKeys));
  } else {
    return a === b;
  }
}

module.exports = {
  regExpIsEqual: regExpIsEqual,
  sortOfEqual: sortOfEqual
};
