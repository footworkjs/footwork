var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var alwaysPassPredicate = require('../misc/util').alwaysPassPredicate;
var isReceivableSymbol = require('../misc/util').getSymbol('isReceivable');

fw.isReceivable = function (thing) {
  return _.isObject(thing) && !!thing[isReceivableSymbol];
};

// factory method which turns an observable into a receivable
fw.subscribable.fn.receive = function (variable, instanceOrNamespaceName) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = alwaysPassPredicate;
  var namespace;

  if (_.isString(instanceOrNamespaceName)) {
    namespace = fw.namespace(instanceOrNamespaceName);
    isLocalNamespace = true;
  } else if (fw.isNamespace(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName;
  } else {
    throw Error('Invalid namespace provided for receiveFrom() observable.');
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

    if(_.isFunction(target.dispose)) {
      target.dispose();
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

  receivable[isReceivableSymbol] = true;
  return receivable.refresh();
};
