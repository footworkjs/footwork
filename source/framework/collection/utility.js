// framework/collection/utility.js
// ------------------

function isCollection(thing) {
  return isObject(thing) && !!thing.__isCollection;
}

function sortOfEqual(a, b) {
  var commonKeys = _.intersection(_.keys(a), _.keys(b));
  return _.isEqual(_.pick(a, commonKeys), _.pick(b, commonKeys));
}
