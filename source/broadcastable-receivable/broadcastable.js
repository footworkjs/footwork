var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var isBroadcastableSymbol = require('../misc/util').getSymbol('isBroadcastable');

fw.isBroadcastable = function (thing) {
  return _.isObject(thing) && !!thing[isBroadcastableSymbol];
};

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcast = function (varName, instanceOrNamespaceName, isWritable) {
  var target = this;
  var namespace;
  var subscriptions = [];
  var isLocalNamespace = false;

  if (fw.isViewModel(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName.$namespace;
  } else if (fw.isNamespace(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName;
  } else if (_.isString(instanceOrNamespaceName)) {
    namespace = fw.namespace(instanceOrNamespaceName);
    isLocalNamespace = true;
  } else {
    throw Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if (isWritable) {
    subscriptions.push(namespace.subscribe('__change.' + varName, function (newValue) {
      target(newValue);
    }));
  }

  target.broadcast = function () {
    namespace.publish(varName, target());
    return this;
  };

  subscriptions.push(namespace.subscribe('__refresh.' + varName, function () {
    namespace.publish(varName, target());
  }));
  subscriptions.push(target.subscribe(function (newValue) {
    namespace.publish(varName, newValue);
  }));

  var targetDispose = target.dispose || _.noop;
  target.dispose = function () {
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }

    targetDispose.call(target);
  };

  target[isBroadcastableSymbol] = true;
  return target.broadcast();
};
