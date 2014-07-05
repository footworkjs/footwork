// namespace.js
// ------------------

// This counter is used when model options { autoIncrement: true } and more than one model
// having the same namespace is instantiated. This is used in the event you do not want
// multiple copies of the same model to share the same namespace (if they do share a
// namespace, they receive all of the same events/messages/commands/etc).
var namespaceNameCounter = {};

// Prepare an empty namespace stack.
// This is where footwork registers its current working namespace name. Each new namespace is
// 'unshifted' and 'shifted' as they are entered and exited, keeping the most current at
// index 0.
var namespaceStack = [];

// Returns a normalized namespace name based off of 'name'. It will register the name counter
// if not present and increment it if it is, then return the name (with the counter appended
// if autoIncrement === true and the counter is > 0).
function indexedNamespaceName(name, autoIncrement) {
  if(namespaceNameCounter[name] === undefined) {
    namespaceNameCounter[name] = 0;
  } else {
    namespaceNameCounter[name]++;
  }
  return name + (autoIncrement === true ? namespaceNameCounter[name] : '');
}

// Method used to trigger an event on a namespace
function triggerEventOnNamespace(eventKey, params) {
  this.publish('event.' + eventKey, params);
  return this;
}

// Method used to register an event handler on a namespace
function registerNamespaceEventHandler(eventKey, callback) {
  var handlerSubscription = this.subscribe('event.' + eventKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to unregister an event handler on a namespace
function unregisterNamespaceEventHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

// Method used to send a command to a namespace
function sendCommandToNamespace(commandKey, params) {
  this.publish('command.' + commandKey, params);
  return this;
}

// Method used to register a command handler on a namespace
function registerNamespaceCommandHandler(requestKey, callback) {
  var handlerSubscription = this.subscribe('command.' + requestKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to unregister a command handler on a namespace
function unregisterNamespaceCommandHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

// Method used to is a request for data from a namespace, returning the response (or undefined if no response)
function requestResponseFromNamespace(requestKey, params) {
  var response;
  var responseSubscription;

  responseSubscription = this.subscribe('request.' + requestKey + '.response', function(reqResponse) {
    response = reqResponse;
  });
  this.publish('request.' + requestKey, params);
  responseSubscription.unsubscribe();

  return response;
}

// Method used to register a request handler on a namespace.
// Requests sent using the specified requestKey will be called and passed in any params specified, the return value is passed back to the issuer
function registerNamespaceRequestHandler(requestKey, callback) {
  var requestHandler = _.bind(function(params) {
    var callbackResponse = callback(params);
    this.publish('request.' + requestKey + '.response', callbackResponse);
  }, this);

  var handlerSubscription = this.subscribe('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to unregister a request-response handler on a namespace
function unregisterNamespaceRequestHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

// This effectively shuts down all requests, commands, and events by unsubscribing all handlers on a discreet namespace object
function disconnectNamespaceHandlers() {
  _.invoke(this.requestHandlers, 'unsubscribe');
  _.invoke(this.commandHandlers, 'unsubscribe');
  _.invoke(this.eventHandlers, 'unsubscribe');
  return this;
}

// Creates and returns a new namespace instance
var makeNamespace = ko.namespace = function(namespaceName, $parentNamespace) {
  var namespace = postal.channel(namespaceName);

  namespace.shutdown = _.bind( disconnectNamespaceHandlers, namespace );

  namespace.commandHandlers = [];
  namespace.command = _.bind( sendCommandToNamespace, namespace );
  namespace.command.handler = _.bind( registerNamespaceCommandHandler, namespace );
  namespace.command.handler.unregister = _.bind( unregisterNamespaceCommandHandler, namespace );

  namespace.requestHandlers = [];
  namespace.request = _.bind( requestResponseFromNamespace, namespace );
  namespace.request.handler = _.bind( registerNamespaceRequestHandler, namespace );
  namespace.request.handler.unregister = _.bind( unregisterNamespaceRequestHandler, namespace );

  namespace.eventHandlers = [];
  namespace.event = namespace.triggerEvent = _.bind( triggerEventOnNamespace, namespace );
  namespace.event.handler = _.bind( registerNamespaceEventHandler, namespace );
  namespace.event.handler.unregister = _.bind( unregisterNamespaceEventHandler, namespace );

  namespace.$parentNamespace = $parentNamespace;
  return namespace;
};

// Duck type check for a namespace object
var isNamespace = ko.isNamespace = function(thing) {
  return _.isFunction(thing.subscribe) && _.isFunction(thing.publish) && typeof thing.channel === 'string';
};

// Return the current namespace name.
var currentNamespaceName = ko.currentNamespaceName = function() {
  return namespaceStack[0];
};

// Return the current namespace channel.
var currentNamespace = ko.currentNamespace = function() {
  return makeNamespace( currentNamespaceName() );
};

// enterNamespaceName() adds a namespaceName onto the namespace stack at the current index, 
// 'entering' into that namespace (it is now the currentNamespace).
// The namespace object returned from this method also has a pointer to its parent
var enterNamespaceName = ko.enterNamespaceName = function(namespaceName) {
  var $parentNamespace = currentNamespace();
  namespaceStack.unshift( namespaceName );
  return makeNamespace( currentNamespaceName(), $parentNamespace );
};

// Called at the after a model constructor function is run. exitNamespace()
// will shift the current namespace off of the stack, 'exiting' to the
// next namespace in the stack
var exitNamespace = ko.exitNamespace = function() {
  namespaceStack.shift();
  return currentNamespace();
};

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
viewModelMixins.push({
  _preInit: function( options ) {
    this._viewModel.globalNamespace = makeNamespace();
    this._viewModel.namespaceName = indexedNamespaceName(this._viewModel.modelOptions.componentNamespace || this._viewModel.modelOptions.namespace || _.uniqueId('namespace'), this._viewModel.modelOptions.autoIncrement);

    enterNamespaceName( this._viewModel.namespaceName );
    this.namespace = currentNamespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.namespace.channel;
    },
    broadcastAll: function() {
      var model = this;
      _.each( this, function(property, propName) {
        if( isABroadcastable(property) === true ) {
          property.broadcast();
        }
      });
      return this;
    },
    refreshReceived: function() {
      _.each( this, function(property, propName) {
        if( isAReceivable(property) === true ) {
          property.refresh();
        }
      });
      return this;
    },
    startup: function() {
      this.refreshReceived().broadcastAll();
      return this;
    }
  },
  _postInit: function( options ) {
    viewModels[ this.getNamespaceName() ] = this;
    exitNamespace();

    this.startup();
    _.isFunction(this._viewModel.modelOptions.afterCreating) && this._viewModel.modelOptions.afterCreating.call(this);
  }
});