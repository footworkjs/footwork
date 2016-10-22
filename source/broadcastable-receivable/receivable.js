var fw = require('knockout');
var postal = require('postal');
var _ = require('lodash');

var alwaysPassPredicate = require('../misc/util').alwaysPassPredicate;
var isNamespace = require('../namespace/namespace').isNamespace;

fw.isReceivable = function (thing) {
  return _.isObject(thing) && !!thing.__isReceivable;
};

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function (namespace, variable) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = alwaysPassPredicate;

  if (_.isString(namespace)) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if (!isNamespace(namespace)) {
    throw new Error('Invalid namespace provided for receiveFrom() observable.');
  }

  receivable = fw.computed({
    read: target,
    write: function (value) {
      namespace.publish('__change.' + variable, value);
    }
  });

  receivable.refresh = function () {
    namespace.publish('__refresh.' + variable);
    return this;
  };

  namespaceSubscriptions.push(namespace.subscribe(variable, function (newValue) {
    if (when(newValue)) {
      target(newValue);
    } else {
      target(undefined);
    }
  }));

  var observableDispose = receivable.dispose;
  receivable.dispose = function () {
    _.invokeMap(namespaceSubscriptions, 'unsubscribe');
    if (isLocalNamespace) {
      namespace.dispose();
    }
    observableDispose.call(receivable);
  };

  receivable.when = function (predicate) {
    if (_.isFunction(predicate)) {
      when = predicate;
    } else {
      when = function (updatedValue) {
        return _.isEqual(updatedValue, predicate);
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};
