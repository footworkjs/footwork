//import("init.js");
//import("utility.js");
//import("proto.js");
//import("entityMixins.js");

// Return the current namespace name.
fw.utils.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
fw.utils.currentNamespace = function() {
  return fw.namespace( fw.utils.currentNamespaceName() );
};

// Creates and returns a new namespace instance
fw.namespace = function(namespaceName, $parentNamespace) {
  if( !isUndefined($parentNamespace) ) {
    if( isString($parentNamespace) ) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if( !isUndefined($parentNamespace.channel) ) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var namespace = postal.channel(namespaceName);

  var subscriptions = namespace.subscriptions = [];
  namespace._subscribe = namespace.subscribe;
  namespace.subscribe = function(topic, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = namespace._subscribe.call(namespace, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  namespace.unsubscribe = unregisterNamespaceHandler;

  namespace._publish = namespace.publish;
  namespace.publish = function(envelope, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    namespace._publish.call(namespace, envelope, callback);
  };

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
    if(fw.utils.currentNamespaceName() === this.getName()) {
      return exitNamespace();
    }
  };

  return namespace;
};

