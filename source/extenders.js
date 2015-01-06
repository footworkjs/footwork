// extenders.js
// ----------------

fw.extenders.debounce = function(target, opt) {
  if( isNumber(opt) ) {
    opt = {
      timeout: opt,
      when: function() { return true; } // default always throttle
    };
  }

  target.throttleEvaluation = opt.timeout;

  var writeTimeoutInstance = null;
  var throttledTarget = fw.computed({
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

  var throttleDispose = throttledTarget.dispose;
  if( isFunction(target.dispose) ) {
    // has to pass-through the dispose method from the target so it can be released properly as well
    throttledTarget.dispose = function() {
      target.dispose();
      throttleDispose.call(throttledTarget);
    };
  }

  return throttledTarget;
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
  var delay = 300;
  var triggerFunc = noop;
  var trigger;

  if( isObject(options) ) {
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

      if( !isUndefined(trigger) ) {
        clearTrigger();
      }

      trigger = setTimeout(function() {
        triggerFunc( target, options );
      }.bind(target), delayedObservable.triggerDelay);
    }
  });
  delayedObservable.clearTrigger = clearTrigger;
  delayedObservable.triggerDelay = delay;

  var delayedObservableDispose = delayedObservable.dispose;
  if( isFunction(target.dispose) ) {
    // has to pass-through the dispose method from the target so it can be released properly as well
    delayedObservable.dispose = function() {
      target.dispose();
      delayedObservableDispose.call(delayedObservable);
    };
  }

  return delayedObservable;
};

fw.extenders.delayWrite = function( target, options ) {
  var filter;
  var delay = 300;

  if( isObject(options) ) {
    delay = !isNaN( options.delay ) && parseInt( options.delay, 10 ) || delay;
    filter = options.filter || function() { return true; };
  } else {
    delay = !isNaN( options ) && parseInt( options, 10 ) || delay;
  }

  var delayWriteComputed = fw.computed({
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

  var delayWriteComputedDispose = delayWriteComputed.dispose;
  if( isFunction(target.dispose) ) {
    // has to pass-through the dispose method from the target so it can be released properly as well
    delayWriteComputed.dispose = function() {
      target.dispose();
      delayWriteComputedDispose.call(delayWriteComputed);
    };
  }

  return delayWriteComputed;
};
