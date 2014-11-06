define([ "jquery", "lodash", "footwork", "LoadProfile" ],
  function( $, _, fw, LoadProfile ) {
    var LOADING_STATE = true,
        DONE_STATE = false;

    return function LoadState(options) {
      this.watchState = fw.observable();
      this.loading = fw.observable();
      this.message = fw.observable('[*]');
      this.oldState = fw.observable();
      this.failReason = fw.observable('');
      this.percentComplete = fw.observable(0).extend({ read: function(observable) { return observable() + '%'; } });
      this.stepTransitionDuration = fw.observable(0).extend({ read: function(observable) { return observable() + 'ms'; } });
      this.stepTransition = fw.computed(function() {
        var state = this.loading();
        if( state === LOADING_STATE ) {
          return 'opacity 0ms 20ms linear, width ' + this.stepTransitionDuration() + ' 0ms linear';
        }
        return 'opacity 350ms 500ms linear, width ' + this.stepTransitionDuration() + ' 0ms linear';
      }, this);

      if( !_.isUndefined(options) && !_.isUndefined(options.ignoreStatus) && options.ignoreStatus instanceof Array === false ) {
        options.ignoreStatus = [ options.ignoreStatus ];
      }

      this.options = $.extend(true, {
        speed: 'normal-load',
        watchState: this.watchState,
        exportState: false,
        ignoreStatus: [],
        showFailMessage: true,
        messageStates: {
          ready: "[ready]",
          busy: "Loading...",
          success: "Done.",
          fail: "Error."
        }
      }, options || {});
      this.watchState = this.options.watchState;

      var minLoadProfileDuration = 100;
      var loadProfile = new LoadProfile()
        .bind('start', function() {
          this.stepTransitionDuration(0);
          setTimeout(function() {this.percentComplete(0);}.bind(this), 0);
        }.bind(this))
        .bind('step', function(data) {
          if(data.point) {
            this.stepTransitionDuration(data.duration > minLoadProfileDuration ? data.duration : minLoadProfileDuration);
            this.percentComplete(data.point);
          }
        }.bind(this))
        .bind('end', function(aborted) {
          if(aborted) {
            this.percentComplete(100);
          }
        }.bind(this));

      this.loading.subscribe(function(loadingState) {
        typeof this.options.exportState === 'function' && this.options.exportState( loadingState );
        if(loadingState === LOADING_STATE) {
          loadProfile.start();
        } else {
          loadProfile.end();
        }
      }, this);
      this.loading.toggle = function() {
        this.loading( !this.loading() );
      }.bind(this);
      this.loading(this.options.isLoading);

      this.state = fw.computed(function() {
        var state = [];
        if(this.oldState() === 'fail') {
          state.push('fail');
        }
        if( this.loading() ) {
          state.push('loading');
        } else {
          state.push('loaded');
        }
        return state.join(' ');
      }, this);

      var resolveState = function(state) {
        var stateJoined = state;
        if(typeof state === 'object' && state.join) {
          stateJoined = state.join(', ');
        }
        var message = '[' + stateJoined + ' - unknown state]';
        _.each(this.options.messageStates, function(stateMessage, stateCheck) {
          if( (typeof state === 'string' && state === stateCheck) ||
              (typeof state === 'object' && _.indexOf(state, stateCheck) !== -1) ) {
            if( typeof stateMessage === 'function' ) {
              message = stateMessage(this.failReason());
            } else {
              if( this.options.showFailMessage === true && this.failReason().length ) {
                message = this.failReason();
              } else {
                message = stateMessage;
              }
            }
          }
        }.bind(this));
        return message;
      }.bind(this);

      var stateCast = _.invert({
        'busy': true,
        'success': false
      });
      this.setState = function(state) {
        var origState = state;

        if( _.isUndefined(state) ) {
          state = this.oldState();
        }
        this.oldState(state);

        if( typeof state === 'boolean' ) {
          state = stateCast[state];
        }

        switch(state) {
          case 'busy':
          case 'then':
            this.loading(LOADING_STATE);
            break;

          case 'ready':
          case 'success':
          case 'done':
            this.loading(DONE_STATE);
            break;

          case 'fail':
            break;

          default:
            throw 'Unknown load bar state [' + origState + '].';
            return;
        }
        this.message( resolveState(state) );
      };

      this.options.watchState.subscribe( this.setState, this );
      this.watch = function(deferred, minPendingTime, callBack) {
        var loadState = this;
        var loadStart = new Date().getTime();

        this.loadTimer && clearTimeout(this.loadTimer);

        callBack = callBack || function() {};
        minPendingTime = minPendingTime || 0;

        if( deferred.state() === 'pending' ) {
          this.loading(false);
          this.setState('busy');
        }

        var state = function(setStateAs) {
          var loadTime = (new Date().getTime()) - loadStart;

          if( loadTime < minPendingTime ) {
            this.loadTimer = setTimeout(function() {
              loadState.setState(setStateAs);
              callBack();
            }.bind(this), minPendingTime - loadTime );
          } else {
            loadState.setState(setStateAs);
          }
        }.bind(this);

        return deferred.done(function() {
                         this.failReason('');
                         state('success');
                       }.bind(this))
                       .fail(function(xhr) {
                         this.failReason(xhr.statusText === 'error' ? 'Unknown error' : xhr.status);
                         if(this.options.ignoreStatus.indexOf(xhr.status) !== -1) {
                           state('success');
                         } else {
                           state('fail');
                         }
                       }.bind(this));
      };

      this.setState('ready');

      return this;
    };
  }
);