/* istanbul ignore next */
var postal = require('../../bower_components/postal.js/lib/postal');
/* istanbul ignore next */
var _ = require('../misc/lodash');

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

var namespaceTools = require('./namespace-tools');
var enterNamespace = namespaceTools.enterNamespace;
var enterNamespaceName = namespaceTools.enterNamespaceName;
var currentNamespaceName = namespaceTools.currentNamespaceName;
var exitNamespace = namespaceTools.exitNamespace;
var indexedNamespaceName = namespaceTools.indexedNamespaceName;

// Creates and returns a new namespace instance
var Namespace = function Namespace(namespaceName, $parentNamespace) {
  if (!_.isUndefined($parentNamespace)) {
    if (_.isString($parentNamespace)) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if (!_.isUndefined($parentNamespace.channel)) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var ns = postal.channel(namespaceName);

  var subscriptions = ns.subscriptions = [];
  ns._subscribe = ns.subscribe;
  ns.subscribe = function(topic, callback, context) {
    if (arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = ns._subscribe.call(ns, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  ns.unsubscribe = unregisterNamespaceHandler;

  ns._publish = ns.publish;
  ns.publish = function(envelope, callback, context) {
    if (arguments.length > 2) {
      callback = callback.bind(context);
    }
    ns._publish.call(ns, envelope, callback);
  };

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
  ns.enter = function() {
    return enterNamespace(this);
  };
  ns.exit = function() {
    if (currentNamespaceName() === this.getName()) {
      return exitNamespace();
    }
  };

  return ns;
};

Namespace.isNamespace = function isNamespace(thing) {
  return _.isObject(thing) && !!thing.__isNamespace;
};

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
require('../entities/entity-mixins').push({
  runBeforeInit: true,
  _preInit: function(options) {
    var $configParams = this.__private('configParams');
    var namespaceName = $configParams.namespace || $configParams.name || _.uniqueId('namespace');
    this.$namespace = enterNamespaceName(indexedNamespaceName(namespaceName, $configParams.autoIncrement));
    this.$rootNamespace = Namespace(namespaceName);
    this.$globalNamespace = Namespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.$namespace.getName();
    }
  },
  _postInit: function(options) {
    exitNamespace();
  }
});

module.exports = Namespace;
