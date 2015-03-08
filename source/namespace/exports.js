// namespace/exports.js
// ----------------

// Creates and returns a new namespace instance
var makeNamespace = fw.namespace = function(namespaceName, $parentNamespace) {
  if( !isUndefined($parentNamespace) ) {
    if( isString($parentNamespace) ) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if( !isUndefined($parentNamespace.channel) ) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var namespace = postal.channel(namespaceName);

  var subscriptions = namespace.subscriptions = [];
  var subscribeToTopic = namespace.subscribeToTopic = namespace.subscribe;
  namespace.subscribe = function(topic, callback) {
    var subscription = subscribeToTopic.call(namespace, topic, callback);
    subscriptions.push( subscription );
    return subscription;
  };
  namespace.unsubscribe = unregisterNamespaceHandler;

  namespace.__isNamespace = true;
  namespace.dispose = disconnectNamespaceHandlers.bind(namespace);

  namespace.commandHandlers = [];
  namespace.command = sendCommandToNamespace.bind(namespace);
  namespace.command.handler = registerNamespaceCommandHandler.bind(namespace);
  namespace.command.unregister = unregisterNamespaceHandler;

  namespace.requestHandlers = [];
  namespace.request = requestResponseFromNamespace.bind(namespace);
  namespace.request.handler = registerNamespaceRequestHandler.bind(namespace);
  namespace.request.unregister = unregisterNamespaceHandler;

  namespace.eventHandlers = [];
  namespace.event = namespace.trigger = triggerEventOnNamespace.bind(namespace);
  namespace.event.handler = registerNamespaceEventHandler.bind(namespace);
  namespace.event.unregister = unregisterNamespaceHandler;

  namespace.getName = getNamespaceName.bind(namespace);
  namespace.enter = function() {
    return enterNamespace( this );
  };
  namespace.exit = function() {
    if( currentNamespaceName() === this.getName() ) {
      return exitNamespace();
    }
  };

  return namespace;
};

// Return the current namespace name.
var currentNamespaceName = fw.utils.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
var currentNamespace = fw.utils.currentNamespace = function() {
  return makeNamespace( currentNamespaceName() );
};
