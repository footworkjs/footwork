var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');

/**
 * Namespace postbox-based communication based on: http://www.knockmeout.net/2012/05/using-ko-native-pubsub.html
 */
var postboxes = {};

/**
 * Construct a new namespace instance. The generator also creates or returns an instance of the namespace subscribable.
 *
 * @param {string} namespaceName
 * @returns {object} the namespace (this)
 */
function Namespace (namespaceName) {
  if (!(this instanceof Namespace)) {
    return new Namespace(namespaceName);
  }

  this[privateDataSymbol] = {
    namespaceName: namespaceName || '__footwork',
    postbox: postboxes[namespaceName] = postboxes[namespaceName] || new fw.subscribable(),
    subscriptions: []
  };
}

_.extend(Namespace.prototype, require('./namespace-methods'));

fw.namespace = Namespace;

fw.isNamespace = function (thing) {
  return thing instanceof fw.namespace;
};
