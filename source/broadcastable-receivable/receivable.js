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
  var subscriptions = [];
  var isLocalNamespace = false;
  var namespace;

  if (_.isString(instanceOrNamespaceName)) {
    namespace = fw.namespace(instanceOrNamespaceName);
    isLocalNamespace = true;
  } else if (fw.isNamespace(instanceOrNamespaceName)) {
    namespace = instanceOrNamespaceName;
  } else {
    throw Error('Invalid namespace provided for receiveFrom() observable.');
  }

  var receivable = fw.computed({
    read: target,
    write: function (value) {
      namespace.publish('__change.' + variable, value);
    }
  });

  receivable.refresh = function () {
    namespace.publish('__refresh.' + variable);
    return this;
  };

  subscriptions.push(namespace.subscribe(variable, function (newValue) {
    target(newValue);
  }));

  var targetDispose = target.dispose || _.noop;
  var receivableDispose = receivable.dispose;
  receivable.dispose = function () {
    _.invokeMap(subscriptions, 'dispose');
    if (isLocalNamespace) {
      namespace.dispose();
    }

    receivableDispose.call(receivable);
    targetDispose.call(target);
  };

  receivable[isReceivableSymbol] = true;
  return receivable.refresh();
};
