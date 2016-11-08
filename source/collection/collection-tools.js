var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var getSymbol = require('../misc/util').getSymbol;

function isCollection (thing) {
  return _.isObject(thing) && !!thing[getSymbol('isCollection')];
}

module.exports = {
  isCollection: fw.isCollection = isCollection
};
