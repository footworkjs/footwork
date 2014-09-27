define([ "jquery", "lodash", "footwork" ],
  function( $, _, ko ) {
    var MIN_COMPLETION_DURATION = 80;
    var MAX_COMPLETION_DURATION = 250;
    var NO_INTENT_DURATION = 200;
    var INTENT_DURATION_OFFSET = -50; // aka fudge factor
    var DRAG_VELOCITY_TRIGGER = 0.10;
    var DRAG_START_THRESHOLD = 0;
    var FRAME_RATE_MS = 1000 / 60;
    var CLICK_TIMEOUT = 170;
    var ABORT_MAX_DURATION = 70;

    return ko.viewModel({
      namespace: 'PaneDragManager',
      initialize: function() {
        var dragPointers = [];
        var customTransitionTimeout;
        this.clickTimeout = undefined;

        this.$namespace.event.handler('PaneInitialized', function() {
          var $mobileGripper = $('.mobile-only.gripper');
          var $collapseButton = $('#collapse-button');

          if( window.IOS_VERSION === undefined || window.IOS_VERSION < 7 ) {
            $mobileGripper.bind('touchy-drag', this.dragHandler);
            $collapseButton
              .bind('touchy-drag', this.dragHandler)
              .bind('touchy-longpress', function() { clearTimeout(this.clickTimeout); });
            $collapseButton.data('touchyLongpress').settings.msThresh = (CLICK_TIMEOUT - 20);
            $mobileGripper.data('touchyDrag').settings.msHoldThresh = DRAG_START_THRESHOLD;
          } else {
            // Damn you Apple, why did you make it so developers cannot disable the new swipe-to-go-back feature in IOS7!
            $mobileGripper.bind('touchy-longpress', this.touchHandler);
            $collapseButton.bind('touchy-longpress', this.touchHandler);
            _.each([ $mobileGripper, $collapseButton ], function($el) {
              $el.data('touchyLongpress').settings.msThresh = 0;
            });
          }
        }, this);

        this.paneMoving = ko.observable().receiveFrom('Pane', 'movingTimer');
        this.paneCollapsed = ko.observable().receiveFrom('Pane', 'collapsed');
        this.paneDragging = ko.observable().receiveFrom('Pane', 'dragging');
        this.paneDragOffset = ko.observable(0).receiveFrom('Pane', 'dragOffset');
        this.paneTransition = ko.observable(undefined).receiveFrom('Pane', 'transition');
        this.paneTrueLeftOffset = ko.observable(0).receiveFrom('Pane', 'trueLeftOffset');
        this.paneWidth = ko.observable(0).receiveFrom('Pane', 'width');
        this.closedOffset = ko.observable().receiveFrom('ViewPort', 'closedOffset');
        this.openOffset = ko.observable().receiveFrom('ViewPort', 'openOffset');
        this.dragActive = ko.observable(false);

        this.touchHandler = function(event, phase, $target, touchData) {
          this.paneCollapsed( !this.paneCollapsed() );
        }.bind(this);

        this.dragHandler = function (event, phase, $target, touchData) {
          var dragActive = this.dragActive();
          if( this.paneMoving() === true ) {
            return false;
          }

          if( !dragActive && phase === 'start' ) {
            this.paneDragging(true);
            this.dragActive(true);
            dragPointers = [];

            if( $target.attr('id') === 'collapse-button' ) {
              this.clickTimeout = setTimeout(function() {
                this.paneDragging(false);
                this.paneCollapsed( !this.paneCollapsed() );
              }.bind(this), CLICK_TIMEOUT);
            }
          } else if(dragActive) {
            if( this.clickTimeout !== undefined ) {
              clearTimeout(this.clickTimeout);
              this.clickTimeout = undefined;
            }
            if( customTransitionTimeout !== undefined ) {
              clearTimeout(customTransitionTimeout);
              customTransitionTimeout = undefined;
            }
          }

          if( dragActive ) {
            var delta = touchData.startPoint.x - touchData.movePoint.x;
            var currentClosedOffset = this.closedOffset();
            var currentOpenOffset = this.openOffset();
            var PANE_OPEN = false;
            var PANE_CLOSED = true;
            
            if( this.paneCollapsed() === false ) {
              delta = delta < 0 ? 0 : delta;
              delta = delta < currentClosedOffset ? delta : currentClosedOffset;
            } else {
              delta = delta > 0 ? 0 : delta;
              delta = delta > currentOpenOffset ? delta : currentOpenOffset;
            }

            if( (phase === 'move' || phase === 'end') ) {
              this.paneDragOffset(delta);
            }

            if( (phase === 'start' || phase === 'move') ) {
              touchData.timestamp = (new Date()).getTime();
              dragPointers.push(touchData);
            } else if( phase === 'end' ) {
              this.dragActive(false);
              var moveDifferential = _.reduce(dragPointers.reverse(), function(diffObj, dragPointer) {
                var prevDragPointer = diffObj[0] || { movePoint: { x: 0 } };
                if( diffObj.length === 0 || (diffObj.length < 2 && dragPointer.movePoint.x !== prevDragPointer.movePoint.x) ) {
                  diffObj.push(dragPointer);
                }
                return diffObj;
              }, []);
              var thisMove = moveDifferential[0];
              var lastMove = moveDifferential[1];
              var newState = this.paneCollapsed();
              var dragIntent = this.paneCollapsed();
              var currentpaneState = this.paneCollapsed();
              var dragPeriod = thisMove.timestamp - dragPointers[dragPointers.length - 2].timestamp;
              var recentVelocity = thisMove.velocity;

              if( thisMove.movePoint.x < lastMove.movePoint.x ) {
                dragIntent = PANE_CLOSED;
              } else if( thisMove.movePoint.x > lastMove.movePoint.x ) {
                dragIntent = PANE_OPEN;
              }

              if( recentVelocity > DRAG_VELOCITY_TRIGGER ) {
                newState = dragIntent;
                var destinationOffset = ( newState === PANE_CLOSED ? currentClosedOffset : currentOpenOffset );
                var animationDuration = Math.floor( Math.abs( (dragPeriod * destinationOffset) / (recentVelocity * FRAME_RATE_MS) ) ) + INTENT_DURATION_OFFSET;

                if( (currentpaneState === PANE_CLOSED && dragIntent === PANE_CLOSED) ||
                    (currentpaneState === PANE_OPEN && dragIntent === PANE_OPEN) ) {
                  destinationOffset = 0;
                }
                animationDuration = ( animationDuration > MAX_COMPLETION_DURATION ? MAX_COMPLETION_DURATION : animationDuration );
                animationDuration = ( animationDuration < MIN_COMPLETION_DURATION ? MIN_COMPLETION_DURATION : animationDuration );

                if( newState === this.paneCollapsed() ) {
                  animationDuration = ( animationDuration > ABORT_MAX_DURATION ? ABORT_MAX_DURATION : animationDuration );
                }

                this.paneTransition('transform ' + animationDuration + 'ms linear, left ' + animationDuration + 'ms linear');
                this.paneDragOffset(destinationOffset);
                customTransitionTimeout = setTimeout(function() {
                  this.paneTransition('none');
                  this.paneDragging(false);
                  this.paneDragOffset(0);
                  this.paneCollapsed(newState);
                }.bind(this), animationDuration);
              } else {
                if( currentpaneState === PANE_CLOSED && parseInt(this.paneTrueLeftOffset(), 10) < parseInt( this.paneWidth(), 10 ) / 2 ) {
                  newState = PANE_OPEN;
                } else if( currentpaneState === PANE_OPEN && parseInt(this.paneTrueLeftOffset(), 10) > parseInt( this.paneWidth(), 10 ) / 2 ) {
                  newState = PANE_CLOSED;
                }

                this.paneDragging(false);
                this.paneMoving(true);
                this.paneDragOffset(0);
                this.paneCollapsed(newState);
              }
            }
          }
        }.bind(this);

        this.paneMoving.subscribe(function(isMoving) {
          if( isMoving === true ) {
            this.paneTransition('transform ' + NO_INTENT_DURATION + 'ms linear, left ' + NO_INTENT_DURATION + 'ms linear');
          } else {
            this.paneTransition('none');
          }
        }, this);
      }
    });
  }
);