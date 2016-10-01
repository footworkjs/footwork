var fw = require('../bower_components/knockoutjs/dist/knockout.js');
var postal = require('../bower_components/postal.js/lib/postal.js');
var _ = require('./lodash.js');

var nsProto = require('./namespace-proto.js');

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

// Returns a normalized namespace name based off of 'name'. It will register the name counter
// if not present and increment it if it is, then return the name (with the counter appended
// if autoIncrement === true and the counter is > 0).
function indexedNamespaceName(name, autoIncrement) {
  if (_.isUndefined(namespaceNameCounter[name])) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

// Duck type check for a namespace object
function isNamespace(thing) {
  return _.isObject(thing) && !!thing.__isNamespace;
}

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index,
// 'entering' into that namespace (it is now the current namespace).
// The namespace object returned from this method also has a pointer to its parent
function enterNamespaceName(namespaceName) {
  namespaceStack.unshift(namespaceName);
  return fw.namespace(fw.utils.currentNamespaceName());
}

// enterNamespace() uses a current namespace definition as the one to enter into.
function enterNamespace(namespace) {
  namespaceStack.unshift(namespace.getName());
  return namespace;
}

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
function exitNamespace() {
  namespaceStack.shift();
  return fw.utils.currentNamespace();
}

fw.utils.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
fw.utils.currentNamespace = function() {
  return fw.namespace(fw.utils.currentNamespaceName());
};

// Creates and returns a new namespace instance
fw.namespace = function(namespaceName, $parentNamespace) {
  if (!_.isUndefined($parentNamespace)) {
    if (_.isString($parentNamespace)) {
      namespaceName = $parentNamespace + '.' + namespaceName;
    } else if (!_.isUndefined($parentNamespace.channel)) {
      namespaceName = $parentNamespace.channel + '.' + namespaceName;
    }
  }
  var namespace = postal.channel(namespaceName);

  var subscriptions = namespace.subscriptions = [];
  namespace._subscribe = namespace.subscribe;
  namespace.subscribe = function(topic, callback, context) {
    if (arguments.length > 2) {
      callback = callback.bind(context);
    }
    var subscription = namespace._subscribe.call(namespace, topic, callback);
    subscriptions.push(subscription);
    return subscription;
  };
  namespace.unsubscribe = nsProto.unregisterNamespaceHandler;

  namespace._publish = namespace.publish;
  namespace.publish = function(envelope, callback, context) {
    if(arguments.length > 2) {
      callback = callback.bind(context);
    }
    namespace._publish.call(namespace, envelope, callback);
  };

  namespace.__isNamespace = true;
  namespace.dispose = nsProto.disconnectNamespaceHandlers.bind(namespace);

  namespace.commandHandlers = [];
  namespace.command = nsProto.sendCommandToNamespace.bind(namespace);
  namespace.command.handler = nsProto.registerNamespaceCommandHandler.bind(namespace);
  namespace.command.unregister = nsProto.unregisterNamespaceHandler;

  namespace.requestHandlers = [];
  namespace.request = nsProto.requestResponseFromNamespace.bind(namespace);
  namespace.request.handler = nsProto.registerNamespaceRequestHandler.bind(namespace);
  namespace.request.unregister = nsProto.unregisterNamespaceHandler;

  namespace.eventHandlers = [];
  namespace.event = namespace.trigger = nsProto.triggerEventOnNamespace.bind(namespace);
  namespace.event.handler = nsProto.registerNamespaceEventHandler.bind(namespace);
  namespace.event.unregister = nsProto.unregisterNamespaceHandler;

  namespace.getName = nsProto.getNamespaceName.bind(namespace);
  namespace.enter = function() {
    return enterNamespace( this );
  };
  namespace.exit = function() {
    if (fw.utils.currentNamespaceName() === this.getName()) {
      return exitNamespace();
    }
  };

  return namespace;
};
