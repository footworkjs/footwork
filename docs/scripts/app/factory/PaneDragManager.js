define([ "jquery", "lodash", "knockout-footwork" ],
  function( $, _, ko ) {
    return ko.model({
      namespace: 'PaneDragManager',
      afterCreating: function() {
        var $mobileGripper = $('.mobile-only.gripper'),
            $collapseButton = $('#collapse-button');

        if( window.IOS_VERSION === undefined || window.IOS_VERSION < 7 ) {
          $mobileGripper.bind('touchy-drag', this.dragHandler);
          $collapseButton
            .bind('touchy-drag', this.dragHandler)
            .bind('touchy-longpress', function() { clearTimeout(clickTimeout); });
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
      },
      initialize: function() {
        var dragPointers = [],
            lastMove = { movePoint: { x: 0 } },
            clickTimeout,
            customTransitionTimeout,
            MIN_COMPLETION_DURATION = 80,
            MAX_COMPLETION_DURATION = 250,
            NO_INTENT_DURATION = 200,
            INTENT_DURATION_OFFSET = -50, // aka fudge factor
            DRAG_VELOCITY_TRIGGER = 0.10,
            DRAG_START_THRESHOLD = 0,
            FRAME_RATE_MS = 1000 / 60,
            CLICK_TIMEOUT = 170,
            ABORT_MAX_DURATION = 70;

        this.paneMoving = ko.observable().receiveFrom('Pane', 'movingTimer');
        this.paneCollapsed = ko.observable().receiveFrom('Pane', 'collapsed');
        this.paneDragging = ko.observable().receiveFrom('Pane', 'dragging');
        this.paneDragOffset = ko.observable(0).receiveFrom('Pane', 'dragOffset');
        this.paneTransition = ko.observable(undefined).receiveFrom('Pane', 'transition');
        this.paneTrueLeftOffset = ko.observable(0).receiveFrom('Pane', 'trueLeftOffset');
        this.paneWidth = ko.observable(0).receiveFrom('Pane', 'width');
        this.closedOffset = ko.observable().receiveFrom('ViewPort', 'closedOffset');
        this.openOffset = ko.observable().receiveFrom('ViewPort', 'openOffset');

        this.touchHandler = function(event, phase, $target, touchData) {
          this.paneCollapsed( !this.paneCollapsed() );
        }.bind(this);

        this.dragHandler = function (event, phase, $target, touchData) {
          if( this.paneMoving() === true ) {
            return false;
          }

          var delta = touchData.startPoint.x - touchData.movePoint.x,
              currentClosedOffset = this.closedOffset(),
              currentOpenOffset = this.openOffset(),
              PANE_OPEN = false,
              PANE_CLOSED = true;

          if( this.paneCollapsed() === false ) {
            delta = delta < 0 ? 0 : delta;
            delta = delta < currentClosedOffset ? delta : currentClosedOffset;
          } else {
            delta = delta > 0 ? 0 : delta;
            delta = delta > currentOpenOffset ? delta : currentOpenOffset;
          }

          if( phase === 'start' ) {
            this.paneDragging(true);
            dragPointers = [];

            if( $target.attr('id') === 'collapse-button' ) {
              clickTimeout = setTimeout(function() {
                this.paneDragging(false);
                this.paneCollapsed( !this.paneCollapsed() );
              }.bind(this), CLICK_TIMEOUT);
            }
          } else {
            if( clickTimeout !== undefined ) {
              clearTimeout(clickTimeout);
              clickTimeout = undefined;
            }
            if( customTransitionTimeout !== undefined ) {
              clearTimeout(customTransitionTimeout);
              customTransitionTimeout = undefined;
            }
          }

          if( phase === 'move' || phase === 'end' ) {
            this.paneDragOffset(delta);
          }

          if( phase === 'start' || phase === 'move' ) {
            touchData.timestamp = new Date().getTime();
            dragPointers.push(touchData);
            if( dragPointers.length > 2 ) {
              lastMove = dragPointers[ dragPointers.length - 2 ];
            }
          } else if( phase === 'end' ) {
            var newState = this.paneCollapsed(),
                thisMove = dragPointers[ dragPointers.length - 1 ],
                dragIntent = this.paneCollapsed(),
                paneState = this.paneCollapsed(),
                dragPeriod = thisMove.timestamp - dragPointers[dragPointers.length - 2].timestamp,
                recentVelocity = thisMove.velocity;

            if( thisMove.movePoint.x < lastMove.movePoint.x ) {
              dragIntent = PANE_CLOSED;
            } else if( thisMove.movePoint.x > lastMove.movePoint.x ) {
              dragIntent = PANE_OPEN;
            }

            if( recentVelocity > DRAG_VELOCITY_TRIGGER ) {
              newState = dragIntent;
              var destinationOffset = ( newState === PANE_CLOSED ? currentClosedOffset : currentOpenOffset ),
                  animationDuration = Math.floor( Math.abs( (dragPeriod * destinationOffset) / (recentVelocity * FRAME_RATE_MS) ) ) + INTENT_DURATION_OFFSET;

              if( (paneState === PANE_CLOSED && dragIntent === PANE_CLOSED) ||
                  (paneState === PANE_OPEN && dragIntent === PANE_OPEN) ) {
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
                this.paneCollapsed(newState);
                this.paneDragging(false);
                this.paneDragOffset(0);
              }.bind(this), animationDuration);
            } else {
              if( paneState === PANE_CLOSED && parseInt(this.paneTrueLeftOffset(), 10) < parseInt( this.paneWidth(), 10 ) / 2 ) {
                newState = PANE_OPEN;
              } else if( paneState === PANE_OPEN && parseInt(this.paneTrueLeftOffset(), 10) > parseInt( this.paneWidth(), 10 ) / 2 ) {
                newState = PANE_CLOSED;
              }

              this.paneDragging(false);
              this.paneMoving(true);
              this.paneCollapsed(newState);
              this.paneDragOffset(0);
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