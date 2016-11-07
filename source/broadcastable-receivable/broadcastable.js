var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var alwaysPassPredicate = require('../misc/util').alwaysPassPredicate;
var isNamespace = require('../namespace/namespace').isNamespace;
var isBroadcastableSymbol = require('../misc/util').getSymbol('isBroadcastable');

fw.isBroadcastable = function (thing) {
  return _.isObject(thing) && !!thing[isBroadcastableSymbol];
};

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcast = function (varName, instanceOrNamespaceName, isWritable) {
  var broadcastable = this;
  var namespace;
  var subscriptions = [];
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if(fw.isViewModel(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName.$namespace;
  } else if (isNamespace(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName;
  } else if (_.isString(instanceOrNamespaceName)) {
    namespace = fw.namespace(instanceOrNamespaceName);
    isLocalNamespace = true;
  } else {
    throw Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if (isWritable) {
    namespaceSubscriptions.push(namespace.subscribe('__change.' + varName, function (newValue) {
      broadcastable(newValue);
    }));
  }

  broadcastable.broadcast = function () {
    namespace.publish(varName, broadcastable());
    return this;
  };

  namespaceSubscriptions.push(namespace.subscribe('__refresh.' + varName, function () {
    namespace.publish(varName, broadcastable());
  }));
  subscriptions.push(broadcastable.subscribe(function (newValue) {
    namespace.publish(varName, newValue);
  }));

  broadcastable.dispose = function () {
    _.invokeMap(namespaceSubscriptions, 'unsubscribe');
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }
  };

  broadcastable[isBroadcastableSymbol] = true;
  return broadcastable.broadcast();
};
