// broadcast-receive.js
// ----------------

ko.isAReceivable = function(thing) {
  return _.has(thing, '__isReceived') && thing.__isReceived === true;
};

ko.isABroadcastable = function(thing) {
  return _.has(thing, '__isBroadcast') && thing.__isBroadcast === true;
};

//     this.myValue = ko.observable().receiveFrom('Namespace' / Namespace, 'varName');
ko.subscribable.fn.receiveFrom = function(namespace, variable) {
  var target = this;
  var observable = this;
  var channel;

  if( _.isObject(namespace) === true && namespace.channel !== undefined ) {
    channel = namespace;
  } else if(typeof namespace === 'string') {
    channel = postal.channel( namespace );
  } else {
    logError('Invalid namespace [' + typeof namespace + ']');
    return observable;
  }

  observable = ko.computed({
    read: target,
    write: function( value ) {
      channel.publish( 'change.' + variable, value );
    }
  });

  observable.refresh = function() {
    channel.publish( 'refresh.' + variable );
  };
  channel.subscribe( variable, function( newValue ) {
    target( newValue );
  });

  observable.__isReceived = true;
  return observable;
};

//     this.myValue = ko.observable().broadcastAs('NameOfVar');
//     this.myValue = ko.observable().broadcastAs('NameOfVar', isWritable);
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', writable: true });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: Namespace });
//     this.myValue = ko.observable().broadcastAs({ name: 'NameOfVar', namespace: 'NamespaceName' });
ko.subscribable.fn.broadcastAs = function(varName, option) {
  var observable = this, channel;

  if(_.isObject(varName) === true) {
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

  channel = option.namespace || ko.currentNamespace();
  if(typeof channel === 'string') {
    channel = ko.namespace(channel);
  }

  if( option.writable ) {
    channel.subscribe( 'change.' + option.name, function( newValue ) {
      observable( newValue );
    });
  }

  channel.subscribe( 'refresh.' + option.name, function() {
    channel.publish( option.name, observable() );
  });
  observable.subscribe(function( newValue ) {
    channel.publish( option.name, newValue );
  });

  observable.__isBroadcast = true;
  return observable;
};