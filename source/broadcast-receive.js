// broadcast-receive.js
// ----------------

//     this.myValue = ko.observable().receiveFrom('NamespaceName' / Namespace, 'varName');
ko.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var observable = this;

  if( isNamespace(namespace) === false ) {
    if( typeof namespace === 'string') {
      namespace = makeNamespace( namespace );
    } else {
      throw 'Invalid namespace [' + typeof namespace + ']';
    }
  }

  observable = ko.computed({
    read: target,
    write: function( value ) {
      namespace.publish( 'change.' + variable, value );
    }
  });

  observable.refresh = function() {
    namespace.publish( 'refresh.' + variable );
    return this;
  };
  namespace.subscribe( variable, function( newValue ) {
    target( newValue );
  });

  observable.__isReceived = true;
  return observable.refresh();
};

//     this.myValue = ko.observable().broadcastAs('NameOfVar');
//     this.myValue = ko.observable().broadcastAs('NameOfVar', isWritable);
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', writable: true });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: Namespace });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: 'NamespaceName' });
ko.subscribable.fn.broadcastAs = function(varName, option) {
  var observable = this;
  var namespace;

  if( _.isObject(varName) === true ) {
    option = varName;
  } else {
    if( typeof option === 'boolean' ) {
      option = {
        name: varName,
        writable: option
      };
    } else if( _.isObject(option) === true ) {
      option = _.extend({
        name: varName
      }, option);
    } else {
      option = {
        name: varName
      };
    }
  }

  namespace = option.namespace || currentNamespace();
  if(typeof namespace === 'string') {
    namespace = makeNamespace(channel);
  }

  if( option.writable ) {
    namespace.subscribe( 'change.' + option.name, function( newValue ) {
      observable( newValue );
    });
  }

  observable.broadcast = function() {
    namespace.publish( option.name, observable() );
    return this;
  };
  namespace.subscribe( 'refresh.' + option.name, function() {
    namespace.publish( option.name, observable() );
  });
  observable.subscribe(function( newValue ) {
    namespace.publish( option.name, newValue );
  });

  observable.__isBroadcast = true;
  return observable.broadcast();
};