var fw = require('../../bower_components/knockoutjs/dist/knockout');
var postal = require('../../bower_components/postal.js/lib/postal');

var _ = require('../misc/lodash');

var alwaysPassPredicate = require('../misc/util').alwaysPassPredicate;
var isNamespace = require('../namespace/namespace').isNamespace;

fw.isBroadcastable = function(thing) {
  return _.isObject(thing) && !!thing.__isBroadcastable;
};

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcastAs = function(varName, option) {
  var broadcastable = this;
  var namespace;
  var subscriptions = [];
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if (_.isObject(varName)) {
    option = varName;
  } else {
    if (_.isBoolean(option)) {
      option = {
        name: varName,
        writable: option
      };
    } else if (_.isObject(option)) {
      option = _.extend({
        name: varName
      }, option);
    } else if (_.isString(option)) {
      option = _.extend({
        name: varName,
        namespace: option
      }, option);
    } else {
      option = {
        name: varName
      };
    }
  }

  namespace = option.namespace || fw.utils.currentNamespace();
  if (_.isString(namespace)) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if (!isNamespace(namespace)) {
    throw new Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if (option.writable) {
    namespaceSubscriptions.push(namespace.subscribe('__change.' + option.name, function(newValue) {
      broadcastable(newValue);
    }));
  }

  broadcastable.broadcast = function() {
    namespace.publish(option.name, broadcastable());
    return this;
  };

  namespaceSubscriptions.push(namespace.subscribe('__refresh.' + option.name, function() {
    namespace.publish(option.name, broadcastable());
  }));
  subscriptions.push(broadcastable.subscribe(function(newValue) {
    namespace.publish(option.name, newValue);
  }));

  broadcastable.dispose = function() {
    _.invokeMap(namespaceSubscriptions, 'unsubscribe');
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }
  };

  broadcastable.__isBroadcastable = true;
  return broadcastable.broadcast();
};
