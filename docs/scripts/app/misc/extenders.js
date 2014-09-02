define([ "jquery", "lodash", "knockout", "postal" ],
  function( $, _, ko, postal ) {

    // custom throttle() based on ko v3.0.0 throttle(), allows value to be force()'d to a value at any time
    ko.extenders.throttle = function(target, opt) {
      if( typeof opt === 'number' ) {
        opt = {
          timeout: opt,
          when: function() { return true; } // default always throttle
        };
      }

      target.throttleEvaluation = opt.timeout;

      var writeTimeoutInstance = null,
          throttledTarget = ko.dependentObservable({
              'read': target,
              'write': function(value) {
                if( opt.when(value) ) {
                  clearTimeout(writeTimeoutInstance);
                  writeTimeoutInstance = setTimeout(function() {
                    target(value);
                  }, opt.timeout);
                } else {
                  clearTimeout(writeTimeoutInstance);
                  target(value);
                }
              }
          });

      throttledTarget.force = function( value ) {
        clearTimeout(writeTimeoutInstance);
        target(value);
      };

      return throttledTarget;
    };

    ko.extenders.read = function( target, readOpCallback ) {
      return ko.computed({
        write: target,
        read: function() {
          return readOpCallback( target );
        }
      });
    };

    ko.extenders.write = function( target, writeOpCallback ) {
      return ko.computed({
        read: target,
        write: function( value ) {
          writeOpCallback( target, value );
        }
      });
    };

    ko.extenders.autoDisable = function( target, delay ) {
      return target.extend({
        delayTrigger: {
          delay: delay || 0,
          trigger: function( target ) { target( false ); }
        }
      });
    };

    ko.extenders.autoEnable = function( target, delay ) {
      return target.extend({
        delayTrigger: {
          delay: delay || 0,
          trigger: function( target ) { target( true ); }
        }
      });
    };

    ko.extenders.delayTrigger = function( target, options ) {
      var delay = 300,
          triggerFunc = function() {},
          trigger;

      if( typeof options === 'object' ) {
        delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
        triggerFunc = options.trigger || triggerFunc;
      } else {
        delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
      }

      var clearTrigger = function() {
        clearTimeout( trigger );
        trigger = undefined;
      };

      var delayedObservable = ko.computed({
        read: target,
        write: function( state ) {
          target( state );

          if( trigger !== undefined ) {
            clearTrigger();
          }

          trigger = setTimeout(function() {
            triggerFunc( target, options );
          }.bind(target), delayedObservable.triggerDelay);
        }
      });
      delayedObservable.clearTrigger = clearTrigger;
      delayedObservable.triggerDelay = delay;

      return delayedObservable;
    };

    ko.extenders.delayWrite = function( target, options ) {
      var filter, delay = 300;

      if( typeof options === 'object' ) {
        delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
        filter = options.filter || function() { return true; };
      } else {
        delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
      }

      return ko.computed({
        read: target,
        write: function( writeValue ) {
          if( filter( writeValue ) ) {
            if(target._delayWriteTimer) {
              clearTimeout( this._delayWriteTimer );
            }
            target._delayWriteTimer = setTimeout(function() {
              target( writeValue );
            }, delay);
          } else {
            target( writeValue );
          }
        }
      });
    };

    ko.extenders.units = function( target, units ) {
      var defaultOptions = {
        cast: 'none',
        postfix: ''
      }, options;

      if( typeof units !== 'object' ) {
        options = _.extend( defaultOptions, { postfix: units.toString() } );
      } else {
        options = _.extend( defaultOptions, units );
      }

      observable = ko.computed({
        read: function() {
          var value;
          switch(options.cast) {
            case 'integer':
            case 'int':
              value = parseInt(target());
              break;

            default:
              value = target();
          }
          return value + options.postfix;
        },
        write: target
      });
      _.extend( observable, _.pick( target, ['refresh', '__isReceived', 'broadcast', '__isBroadcast'] ) );
      
      return observable;
    };

  }
);