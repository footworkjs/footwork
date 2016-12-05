var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');
var privateDataSymbol = require('../misc/util').getSymbol('footwork');

/**
 * Construct a new namespace instance.
 *
 * @param {string} namespaceName
 * @returns
 */
function Namespace (namespaceName) {
  if (!(this instanceof Namespace)) {
    return new Namespace(namespaceName);
  }

  this[privateDataSymbol] = {
    namespaceName: namespaceName || '__footwork',
    subscriptions: []
  };
};

_.extend(Namespace.prototype, require('./namespace-methods'));

fw.namespace = Namespace;

fw.isNamespace = function (thing) {
  return thing instanceof fw.namespace;
};
