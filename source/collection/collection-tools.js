var _ = require('lodash');

function isCollection(thing) {
  return _.isObject(thing) && !!thing.__isCollection;
}

module.exports = {
  isCollection: isCollection
};
