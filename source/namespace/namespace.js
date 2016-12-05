var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var privateDataSymbol = require('../misc/util').getSymbol('footwork');

// Namespace postbox-based communication based loosely on: http://www.knockmeout.net/2012/05/using-ko-native-pubsub.html
var postboxes = {};

/**
 * Generate and/or return the postbox communications channel for a given namespaceName
 *
 * @param {string} namespaceName The namespace channel for the postbox
 * @returns {object} subscribable communications channel
 */
function postbox (namespaceName) {
  postboxes[namespaceName] = postboxes[namespaceName] || new fw.subscribable();
  return postboxes[namespaceName];
}

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
