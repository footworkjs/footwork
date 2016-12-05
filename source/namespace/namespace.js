var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');
var postbox = require('./postbox');

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
    postbox: postbox(namespaceName),
    subscriptions: []
  };
};

_.extend(Namespace.prototype, require('./namespace-methods'));

fw.namespace = Namespace;

fw.isNamespace = function (thing) {
  return thing instanceof fw.namespace;
};
