define(["lodash", "jquery", "footwork"], function(_, $, ko) {
  return function LoadProfile(options) {
    var profiles = [
      [[ 120, { point: 25, duration: 120 } ],
       [ 120, { point: 35, duration: 50 } ],
       [ 200, { point: 55, duration: 50 } ],
       [ 400, { point: 80, duration: 50 } ]],
      [[ 120, { point: 25, duration: 50 } ],
       [ 100, { point: 35, duration: 50 } ],
       [ 200, { point: 65, duration: 50 } ],
       [ 400, { point: 80, duration: 50 } ]],
      [[ 100, { point: 30, duration: 50 } ],
       [ 200, { point: 35, duration: 50 } ],
       [ 300, { point: 50, duration: 50 } ],
       [ 400, { point: 80, duration: 50 } ]],
    ];

    var LoadProfile = this,
        profile, runningProfile, currentStep, stepIndex, thisProfileStep, stepTimer;

    options = _.extend({
      alwaysNewProfile: true,
      adjustment: 1.0,
      onStep: [ ],
      onStart: [ ],
      onEnd: [ ]
    }, options);

    var proper = function(eventName) {
      var nameOffset = 2;
      if( eventName.slice(0, nameOffset) !== 'on' ) {
        nameOffset = 0;
      }
      eventName = eventName.slice(nameOffset);
      return 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1);
    };

    var alertCallbacks = function(eventName, data) {
      _.each(options[proper(eventName)], function(eventCallback) {
        if(typeof eventCallback === 'function') {
          eventCallback( data );
        }
      });
    };

    var step = function() {
      var stepDefinition;

      if(stepIndex === undefined) {
        stepIndex = 0;
      }

      if(thisProfileStep === undefined || thisProfileStep[stepIndex] === undefined) {
        thisProfileStep = runningProfile.shift();
        stepIndex = 0;
      }

      if(thisProfileStep !== undefined) {
        if(stepIndex < thisProfileStep.length) {
          stepDefinition = thisProfileStep[stepIndex];


          if(typeof stepDefinition === 'number') {
            stepDefinition = { duration: stepDefinition };
          } else if( _.isObject(stepDefinition) === false ) {
            throw 'Invalid step definition [' + typeof stepDefinition + '], can only accept number or object';
          }

          stepTimer = setTimeout(step, Math.floor(stepDefinition.duration * options.adjustment));
          alertCallbacks('step', stepDefinition);
          stepIndex++;
        }
      } else {
        alertCallbacks('end');
      }
    };

    this.bind = function(eventName, eventCallback) {
      var event = proper(eventName);
      if(options[event] instanceof Array) {
        options[event].push(eventCallback);
      }
      return this;
    };

    this.unbind = function(eventName, callbackToUnbind) {
      var event = proper(eventName);
      if(options[event] !== undefined) {
        options[event] = _.reject(options[event], function(registeredCallback) {
          return registeredCallback === callbackToUnbind;
        });
      }
      return this;
    };

    var prepare = function() {
      thisProfileStep = undefined;
      stepIndex = undefined;
      currentStep = 0;
    };

    this.start = function() {
      prepare();
      if(options.alwaysNewProfile) {
        this.chooseProfile();
      }
      runningProfile = this.getProfile();

      clearTimeout(stepTimer);
      alertCallbacks('start');
      step();

      return this;
    };

    this.end = function() {
      clearTimeout(stepTimer);
      alertCallbacks('end', true);
    };

    this.getProfile = function() {
      return $.extend( true, [], profile );
    };

    (this.chooseProfile = function() {
      profile = profiles[Math.floor(Math.random() * profiles.length)];
      prepare();
      return this;
    })();
  };
});