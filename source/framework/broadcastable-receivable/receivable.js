// framework/broadcastable-receivable/receivable.js
// ------------------

// factory method which turns an observable into a receivable
fw.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var receivable = this;
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;
  var when = alwaysPassPredicate;

  if( isString(namespace) ) {
    namespace = fw.namespace( namespace );
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw 'Invalid namespace provided for receiveFrom() observable.';
  }

  receivable = fw.computed({
    read: target,
    write: function( value ) {
      namespace.publish( '__change.' + variable, value );
    }
  });

  receivable.refresh = function() {
    namespace.publish( '__refresh.' + variable );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( variable, function( newValue ) {
    if(when(newValue)) {
      target(newValue);
    } else {
      target(undefined);
    }
  }) );

  var observableDispose = receivable.dispose;
  receivable.dispose = function() {
    invoke(namespaceSubscriptions, 'unsubscribe');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
    observableDispose.call(receivable);
  };

  receivable.when = function(predicate) {
    if(isFunction(predicate)) {
      when = predicate;
    } else {
      when = function(updatedValue) {
        return updatedValue === predicate;
      };
    }
    return this;
  };

  receivable.__isReceivable = true;
  return receivable.refresh();
};
