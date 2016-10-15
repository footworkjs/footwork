/* istanbul ignore next */
var _ = require('../misc/lodash');

function isCollection(thing) {
  return _.isObject(thing) && !!thing.__isCollection;
}

module.exports = {
  isCollection: isCollection
};
