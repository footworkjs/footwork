var _ = require('lodash');

/**
 * Create postal message envelope using a given topic, data, and expiration
 *
 * @param {any} topic
 * @param {any} data
 * @param {any} expires
 * @returns {object} postal.js envelope
 */
function createEnvelope(topic, data) {
  var envelope = {
    topic: topic,
    data: data
  };

  return envelope;
}

// Method used to trigger an event on a namespace
function triggerEventOnNamespace(eventKey, params) {
  this.publish(createEnvelope('event.' + eventKey, params));
  return this;
}

// Method used to register an event handler on a namespace
function registerNamespaceEventHandler(eventKey, callback, context) {
  if (!_.isUndefined(context)) {
    callback = callback.bind(context);
  }

  var handlerSubscription = this._subscribe('event.' + eventKey, callback);
  this.eventHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to unregister an event handler on a namespace
function unregisterNamespaceHandler(handlerSubscription) {
  handlerSubscription.unsubscribe();
  return this;
}

// Method used to send a command to a namespace
function sendCommandToNamespace(commandKey, params) {
  this.publish(createEnvelope('command.' + commandKey, params));
  return this;
}

// Method used to register a command handler on a namespace
function registerNamespaceCommandHandler(commandKey, callback, context) {
  if (!_.isUndefined(context)) {
    callback = callback.bind(context);
  }

  var handlerSubscription = this._subscribe('command.' + commandKey, callback);
  this.commandHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// Method used to issue a request for data from a namespace, returning the response (or undefined if no response)
// This method will return an array of responses if more than one is received.
function requestResponseFromNamespace(requestKey, params, allowMultipleResponses) {
  var response = undefined;
  var responseSubscription;

  responseSubscription = this._subscribe('request.' + requestKey + '.response', function (reqResponse) {
    if (_.isUndefined(response)) {
      response = allowMultipleResponses ? [reqResponse] : reqResponse;
    } else if (allowMultipleResponses) {
      response.push(reqResponse);
    }
  });

  this.publish(createEnvelope('request.' + requestKey, params));
  responseSubscription.unsubscribe();

  return response;
}

// Method used to register a request handler on a namespace.
// Requests sent using the specified requestKey will be called and passed in any params specified, the return value is passed back to the issuer
function registerNamespaceRequestHandler(requestKey, callback, context) {
  if (!_.isUndefined(context)) {
    callback = callback.bind(context);
  }

  var requestHandler = function (params) {
    var callbackResponse = callback(params);
    this.publish(createEnvelope('request.' + requestKey + '.response', callbackResponse));
  }.bind(this);

  var handlerSubscription = this._subscribe('request.' + requestKey, requestHandler);
  this.requestHandlers.push(handlerSubscription);

  return handlerSubscription;
}

// This effectively shuts down all requests, commands, events, and subscriptions by unsubscribing all handlers on a discreet namespace object
var handlerRepos = [ 'requestHandlers', 'commandHandlers', 'eventHandlers', 'subscriptions' ];
function disconnectNamespaceHandlers() {
  var namespace = this;
  _.each(handlerRepos, function (handlerRepo) {
    _.invokeMap(namespace[handlerRepo], 'unsubscribe');
  });
  return this;
}

function getNamespaceName() {
  return this.channel;
}

module.exports = {
  createEnvelope: createEnvelope,
  triggerEventOnNamespace: triggerEventOnNamespace,
  registerNamespaceEventHandler: registerNamespaceEventHandler,
  unregisterNamespaceHandler: unregisterNamespaceHandler,
  sendCommandToNamespace: sendCommandToNamespace,
  registerNamespaceCommandHandler: registerNamespaceCommandHandler,
  requestResponseFromNamespace: requestResponseFromNamespace,
  registerNamespaceRequestHandler: registerNamespaceRequestHandler,
  disconnectNamespaceHandlers: disconnectNamespaceHandlers,
  getNamespaceName: getNamespaceName
};
