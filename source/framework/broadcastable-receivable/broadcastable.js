// framework/broadcastable-receivable/broacastable.js
// ------------------

function isBroadcastable(thing) {
  return isObject(thing) && !!thing.__isBroadcastable;
}

// factory method which turns an observable into a broadcastable
fw.subscribable.fn.broadcastAs = function(varName, option) {
  var observable = this;
  var namespace;
  var subscriptions = [];
  var namespaceSubscriptions = [];
  var isLocalNamespace = false;

  if( isObject(varName) ) {
    option = varName;
  } else {
    if( isBoolean(option) ) {
      option = {
        name: varName,
        writable: option
      };
    } else if( isObject(option) ) {
      option = extend({
        name: varName
      }, option);
    } else {
      option = {
        name: varName
      };
    }
  }

  namespace = option.namespace || fw.utils.currentNamespace();
  if( isString(namespace) ) {
    namespace = fw.namespace(namespace);
    isLocalNamespace = true;
  }

  if( !isNamespace(namespace) ) {
    throw 'Invalid namespace provided for broadcastAs() observable.';
  }

  if( option.writable ) {
    namespaceSubscriptions.push( namespace.subscribe( '__change.' + option.name, function( newValue ) {
      observable( newValue );
    }) );
  }

  observable.broadcast = function() {
    namespace.publish( option.name, observable() );
    return this;
  };

  namespaceSubscriptions.push( namespace.subscribe( '__refresh.' + option.name, function() {
    namespace.publish( option.name, observable() );
  }) );
  subscriptions.push( observable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  }) );

  observable.dispose = function() {
    invoke(namespaceSubscriptions, 'unsubscribe');
    invoke(subscriptions, 'dispose');
    if( isLocalNamespace ) {
      namespace.dispose();
    }
  };

  observable.__isBroadcastable = true;
  return observable.broadcast();
};
