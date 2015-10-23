// framework/collection/utility.js
// ------------------

function isCollection(thing) {
  return isObject(thing) && !!thing.__isCollection;
}

function commonKeyEqual(a, b) {
  var commonKeys = intersection(keys(a), keys(b));
  return isEqual(pick(a, commonKeys), pick(b, commonKeys));
}
