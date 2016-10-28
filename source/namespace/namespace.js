var postal = require('postal');
var _ = require('lodash');

var namespaceMethods = require('./namespace-methods');
var disconnectNamespaceHandlers = namespaceMethods.disconnectNamespaceHandlers;
var sendCommandToNamespace = namespaceMethods.sendCommandToNamespace;
var registerNamespaceCommandHandler = namespaceMethods.registerNamespaceCommandHandler;
var unregisterNamespaceHandler = namespaceMethods.unregisterNamespaceHandler;
var getNamespaceName = namespaceMethods.getNamespaceName;
var triggerEventOnNamespace = namespaceMethods.triggerEventOnNamespace;
var requestResponseFromNamespace = namespaceMethods.requestResponseFromNamespace;
var registerNamespaceRequestHandler = namespaceMethods.registerNamespaceRequestHandler;
var registerNamespaceEventHandler = namespaceMethods.registerNamespaceEventHandler;

// Creates and returns a new namespace instance
var Namespace = function Namespace (namespaceName) {
  var ns = postal.channel(namespaceName);

  var subscriptions = ns.subscriptions = [];
  ns._subscribe = ns.subscribe;
  ns.subscribe = function (topic, callback, context) {
    if (arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = ns._subscribe.call(ns, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  ns.unsubscribe = unregisterNamespaceHandler;

  ns.__isNamespace = true;
  ns.dispose = disconnectNamespaceHandlers.bind(ns);

  ns.commandHandlers = [];
  ns.command = sendCommandToNamespace.bind(ns);
  ns.command.handler = registerNamespaceCommandHandler.bind(ns);
  ns.command.unregister = unregisterNamespaceHandler;

  ns.requestHandlers = [];
  ns.request = requestResponseFromNamespace.bind(ns);
  ns.request.handler = registerNamespaceRequestHandler.bind(ns);
  ns.request.unregister = unregisterNamespaceHandler;

  ns.eventHandlers = [];
  ns.event = ns.trigger = triggerEventOnNamespace.bind(ns);
  ns.event.handler = registerNamespaceEventHandler.bind(ns);
  ns.event.unregister = unregisterNamespaceHandler;

  ns.getName = getNamespaceName.bind(ns);

  return ns;
};

Namespace.isNamespace = function isNamespace (thing) {
  return _.isObject(thing) && !!thing.__isNamespace;
};

module.exports = Namespace;
