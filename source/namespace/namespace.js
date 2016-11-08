var privateDataSymbol = require('../misc/config').privateDataSymbol;
var namespaceMethods = require('./namespace-methods');
var defaultNamespace = require('../misc/config').defaultNamespace;

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
    namespaceName: namespaceName || defaultNamespace,
    subscriptions: []
  };
};

Namespace.prototype.dispose = namespaceMethods.dispose;
Namespace.prototype.publish = namespaceMethods.publish;
Namespace.prototype.subscribe = namespaceMethods.subscribe;
Namespace.prototype.unsubscribe = namespaceMethods.unsubscribe;
Namespace.prototype.request = namespaceMethods.request;
Namespace.prototype.requestHandler = namespaceMethods.requestHandler;
Namespace.prototype.getName = namespaceMethods.getName;

module.exports = Namespace;
