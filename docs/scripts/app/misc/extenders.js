define([ "jquery", "lodash", "knockout", "postal" ],
  function( $, _, fw, postal ) {

    // custom throttle() based on fw v3.0.0 throttle(), allows value to be force()'d to a value at any time
    fw.extenders.throttle = function(target, opt) {
      if( typeof opt === 'number' ) {
        opt = {
          timeout: opt,
          when: function() { return true; } // default always throttle
        };
      }

      target.throttleEvaluation = opt.timeout;

      var writeTimeoutInstance = null,
          throttledTarget = fw.dependentObservable({
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

    fw.extenders.read = function( target, readOpCallback ) {
      return fw.computed({
        write: target,
        read: function() {
          return readOpCallback( target );
        }
      });
    };

    fw.extenders.write = function( target, writeOpCallback ) {
      return fw.computed({
        read: target,
        write: function( value ) {
          writeOpCallback( target, value );
        }
      });
    };

    fw.extenders.autoDisable = function( target, delay ) {
      return target.extend({
        delayTrigger: {
          delay: delay || 0,
          trigger: function( target ) { target( false ); }
        }
      });
    };

    fw.extenders.autoEnable = function( target, delay ) {
      return target.extend({
        delayTrigger: {
          delay: delay || 0,
          trigger: function( target ) { target( true ); }
        }
      });
    };

    fw.extenders.delayTrigger = function( target, options ) {
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

      var delayedObservable = fw.computed({
        read: target,
        write: function( state ) {
          target( state );

          if( !_.isUndefined(trigger) ) {
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

    fw.extenders.delayWrite = function( target, options ) {
      var filter, delay = 300;

      if( typeof options === 'object' ) {
        delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
        filter = options.filter || function() { return true; };
      } else {
        delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
      }

      return fw.computed({
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

    fw.extenders.units = function( target, units ) {
      var defaultOptions = {
        cast: 'none',
        postfix: ''
      }, options;

      if( typeof units !== 'object' ) {
        options = _.extend( defaultOptions, { postfix: units.toString() } );
      } else {
        options = _.extend( defaultOptions, units );
      }

      observable = fw.computed({
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