var _ = require('lodash');
var fw = require('knockout/build/output/knockout-latest');

// Prepare an empty namespace stack.
// This is where footwork registers its current working namespace name. Each new namespace is
// 'unshifted' and 'shifted' as they are entered and exited, keeping the most current at
// index 0.
var namespaceStack = [];

// This counter is used when model options { autoIncrement: true } and more than one model
// having the same namespace is instantiated. This is used in the event you do not want
// multiple copies of the same model to share the same namespace (if they do share a
// namespace, they receive all of the same events/messages/commands/etc).
var namespaceNameCounter = {};

/**
 * Returns a normalized namespace name based off of 'name'. It will register the name counter
 * if not present and increment it if it is, then return the name (with the counter appended
 * if autoIncrement === true and the counter is > 0).
 *
 * @param {string} name namespace name
 * @param {boolean} autoIncrement flag indicating whether or not to autoincrement the namespace
 * @returns {string} indexed namespace name
 */
function indexedNamespaceName(name, autoIncrement) {
  if (_.isUndefined(namespaceNameCounter[name])) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

/**
 * Enter a namespace context using the given namespaceName. This makes it so that any
 * broadcastable/receivable made can have a 'default' namespace which is the one lexically
 * local to it.
 *
 * @param {string} namespaceName
 * @returns {object} namespace
 */
function enterNamespaceName(namespaceName) {
  namespaceStack.unshift(namespaceName);
  return fw.namespace(currentNamespaceName());
}

/**
 * Enter a namespace context using the given namespace instance. This makes it so that any
 * broadcastable/receivable made can have a 'default' namespace which is the one lexically
 * local to it.
 *
 * @param {any} ns
 * @returns {object} namespace
 */
function enterNamespace(ns) {
  namespaceStack.unshift(ns.getName());
  return ns;
}

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack

/**
 * Exit the current namespace context (leaving you in the context above that, if there is one)
 *
 * @returns {object} namespace
 */
function exitNamespace() {
  namespaceStack.shift();
  return currentNamespace();
}


/**
 * Return the current namespace channel name.
 *
 * @returns {string} namespaceName
 */
function currentNamespaceName() {
  return namespaceStack[0];
};

/**
 * Return instance of the current namespace channel.
 *
 * @returns {object} namespace
 */
function currentNamespace() {
  return fw.namespace(currentNamespaceName());
};

_.extend(fw.utils, {
  currentNamespaceName: currentNamespaceName,
  currentNamespace: currentNamespace
});

module.exports = {
  indexedNamespaceName: indexedNamespaceName,
  enterNamespace: enterNamespace,
  enterNamespaceName: enterNamespaceName,
  exitNamespace: exitNamespace,
  currentNamespace: currentNamespace,
  currentNamespaceName: currentNamespaceName
};
