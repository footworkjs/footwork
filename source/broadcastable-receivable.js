var fw = require('../bower_components/knockoutjs/dist/knockout.js');
var postal = require('../bower_components/postal.js/lib/postal.js');
var _ = require('./misc/lodash.js');
var util = require('./misc/util.js');
var isNamespace = require('./namespace/namespace').isNamespace;

fw.isBroadcastable = function(thing) {
  return _.isObject(thing) && !!thing.__isBroadcastable;
};

fw.isReceivable = function(thing) {
  return _.isObject(thing) && !!thing.__isReceivable;
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
    } else if(_.isObject(option)) {
      option = _.extend({
        name: varName
      }, option);
    } else if(_.isString(option)) {
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
  if(_.isString(namespace)) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if(!isNamespace(namespace)) {
    throw new Error('Invalid namespace provided for broadcastAs() observable.');
  }

  if( option.writable ) {
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

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = util.alwaysPassPredicate;

  if (_.isString(namespace)) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if (!isNamespace(namespace)) {
    throw new Error('Invalid namespace provided for receiveFrom() observable.');
  }

  receivable = fw.computed({
    read: target,
    write: function(value) {
      namespace.publish('__change.' + variable, value);
    }
  });

  receivable.refresh = function() {
    namespace.publish('__refresh.' + variable);
    return this;
  };

  namespaceSubscriptions.push(namespace.subscribe( variable, function(newValue) {
    if (when(newValue)) {
      target(newValue);
    } else {
      target(undefined);
    }
  }));

  var observableDispose = receivable.dispose;
  receivable.dispose = function() {
    _.invokeMap(namespaceSubscriptions, 'unsubscribe');
    if (isLocalNamespace) {
      namespace.dispose();
    }
    observableDispose.call(receivable);
  };

  receivable.when = function(predicate) {
    if (_.isFunction(predicate)) {
      when = predicate;
    } else {
      when = function(updatedValue) {
        return _.isEqual(updatedValue, predicate);
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};

module.exports = fw;
