define([ "jquery", "lodash", "footwork" ],
  function( $, _, fw ) {
    var MIN_COMPLETION_DURATION = 80;
    var MAX_COMPLETION_DURATION = 180;
    var NO_INTENT_DURATION = 200;
    var INTENT_DURATION_OFFSET = -50; // aka fudge factor
    var DRAG_VELOCITY_TRIGGER = 0.80;
    var FRAME_RATE_MS = 1000 / 60;
    var CLICK_TIMEOUT = 250;
    var ABORT_MAX_DURATION = 70;
    var FINGER_DELAY_DRAG_CANCEL_TIMEOUT = 200;
    var DRAG_POINT_REGISTER_SIZE = 10;

    var touchEvents = [
      'touchstart',
      'touchmove',
      'touchend',
      'touchenter',
      'touchleave',
      'touchcancel'
    ];

    var PANE_OPEN = false;
    var PANE_CLOSED = true;

    var dragPointers = [];
    var lastXPos = null;
    var pointerOffset = 0;
    var dragPoint = [];
    var dragActive = false;

    function getDistance(p1, p2) {
      return Math.abs(Math.abs(p1.delta) - Math.abs(p2.delta));
    }

    function getDuration(p1, p2) {
      return Math.abs(p1.timestamp - p2.timestamp);
    }

    function getVelocity(p1, p2) {
      return getDistance(p1, p2) / getDuration(p1, p2);
    }
            
    function sameDirectionAs(thisDragPoint) {
      return function(thatDragPoint) {
        return thisDragPoint.direction === thatDragPoint.direction;
      }
    }
    
    function touchEventHandler(eventName, target, event) {
      if( this.paneMoving() === true ) {
        return false;
      }

      var velocity = 0;
      var duration = 0;
      var myDragPoint = { direction: 'none', delta: 0, timestamp: new Date().getTime() };
      var phase = eventName.substr(5).toLowerCase();
      var currentPaneState = this.paneCollapsed();
      var viewPortWidth = this.viewPortDimensions().width;
      var xPos = !_.isUndefined(event.originalEvent.changedTouches[0]) ? (event.originalEvent.changedTouches[0].pageX || lastXPos) : lastXPos;
      if(phase === 'start') {
        pointerOffset = xPos;
      }
      xPos = xPos - pointerOffset;
      lastXPos = _.isNull(lastXPos) ? xPos : lastXPos;
      var delta = lastXPos - xPos;
      var currentClosedOffset = this.closedOffset();
      var currentOpenOffset = this.openOffset();

      if(['start','move','end'].indexOf(phase) === -1) {
        // unknown phase/event triggered on target...reset pane state
        this.setPane(currentPaneState);
        return;
      }

      if( currentPaneState === PANE_OPEN ) {
        delta = delta < 0 ? 0 : delta;
        delta = delta < currentClosedOffset ? delta : currentClosedOffset;
      } else {
        delta = delta > 0 ? 0 : delta;
        delta = delta > currentOpenOffset ? delta : currentOpenOffset;
      }

      if(phase === 'start' && !dragActive) {
        this.paneDragging(true);
        dragActive = true;
        dragPoint = [];

        this.clickTimeout = setTimeout(function() {
          this.paneDragging(false);
          this.paneCollapsed( !this.paneCollapsed() );
        }.bind(this), CLICK_TIMEOUT);
      }

      if(phase === 'move' && (dragPoint.length === 0 || dragPoint[0].delta !== delta)) {
        myDragPoint.delta = delta;
        this.paneDragOffset(delta);
        dragPoint.unshift(myDragPoint);
        if( dragPoint.length > DRAG_POINT_REGISTER_SIZE ) {
          dragPoint.pop();
        }

        // determine distance, duration, and direction of drag relative to the last point
        if(dragPoint.length > 1) {
          myDragPoint.distance = getDistance(dragPoint[0], dragPoint[1]);
          myDragPoint.duration = getDuration(dragPoint[0], dragPoint[1]);
          myDragPoint.direction = (dragPoint[0].delta < dragPoint[1].delta ? 'right' : 'left');
        }
      }

      if(dragActive && (phase === 'move' || phase === 'end')) {
        clearTimeout(this.clickTimeout);
        clearTimeout(this.customTransitionTimeout);
      }

      myDragPoint.dragIntent = myDragPoint.direction === 'right' ? PANE_OPEN : PANE_CLOSED;

      if( phase === 'end' && dragActive ) {
        dragActive = false;
        var significantPoint = dragPoint.length - 3;
        sDragPoints = _.filter(dragPoint, sameDirectionAs(dragPoint[significantPoint >= 0 ? significantPoint : 0]));
        if(sDragPoints.length < 2 || myDragPoint.timestamp - sDragPoints[sDragPoints.length - 1].timestamp > FINGER_DELAY_DRAG_CANCEL_TIMEOUT) {
          // users finger lingered too long before release...set drag state based on final position
          if( sDragPoints.length > 1 ) {
            if( this.farEnoughToOpen() ) {
              this.setPane(PANE_OPEN);
            } else {
              this.setPane(PANE_CLOSED);
            }
          } else {
            this.setPane( !currentPaneState );
          }
        } else if( sDragPoints.length >= 2 ) {
          // user lifted finger while dragging, determine velocity and duration...then trigger pane animation as appropriate
          velocity = getVelocity(sDragPoints[0], sDragPoints[sDragPoints.length - 1]);
          duration = getDuration(sDragPoints[0], sDragPoints[sDragPoints.length - 1]);
          if( velocity > DRAG_VELOCITY_TRIGGER ) {
            this.dragPane( sDragPoints[0].dragIntent, velocity, duration )
          } else {
            this.setPane( this.farEnoughToOpen() ? PANE_OPEN : PANE_CLOSED );
          }
        } else {
          this.setPane( currentPaneState );
        }
      }
    }

    return fw.viewModel({
      namespace: 'PaneTouchManager',
      initialize: function() {
        this.$paneNamespace = fw.namespace('Pane');
        this.$paneNamespace.event.handler('initialized', function() {
          var $mobileGripper = $('.mobile-only.gripper');
          var $collapseButton = $('#collapse-button');

          _.each(touchEvents, function(touchEvent) {
            $mobileGripper.on(touchEvent, _.bind(touchEventHandler, this, touchEvent, 'gripper'));
            $collapseButton.on(touchEvent, _.bind(touchEventHandler, this, touchEvent, 'button'));
          }.bind(this));
        }, this);
        this.$namespace.request.handler('ping', function() {
          return 'pong';
        });

        this.setPane = function(state) {
          this.paneDragging(false);
          this.paneMoving(true);
          this.paneDragOffset(0);
          this.paneCollapsed(state);
        };

        this.dragPane = function(newState, velocity, dragDuration) {
          var destinationOffset = ( newState === PANE_CLOSED ? this.closedOffset() : this.openOffset() );
          var animationDuration = Math.floor( Math.abs( (dragDuration * destinationOffset) / (velocity * FRAME_RATE_MS) ) ) + INTENT_DURATION_OFFSET;
          var currentPaneState = this.paneCollapsed();

          if( (currentPaneState === PANE_CLOSED && newState === PANE_CLOSED) ||
              (currentPaneState === PANE_OPEN && newState === PANE_OPEN) ) {
            destinationOffset = 0;
          }
          animationDuration = ( animationDuration > MAX_COMPLETION_DURATION ? MAX_COMPLETION_DURATION : animationDuration );
          animationDuration = ( animationDuration < MIN_COMPLETION_DURATION ? MIN_COMPLETION_DURATION : animationDuration );

          if( newState === currentPaneState ) {
            animationDuration = ( animationDuration > ABORT_MAX_DURATION ? ABORT_MAX_DURATION : animationDuration );
          }

          this.paneTransition('transform ' + animationDuration + 'ms linear, left ' + animationDuration + 'ms linear');
          this.paneDragOffset(destinationOffset);
          this.customTransitionTimeout = setTimeout(function() {
            this.paneTransition('none');
            this.paneDragging(false);
            this.paneDragOffset(0);
            this.paneCollapsed(newState);
          }.bind(this), animationDuration);
        };

        this.farEnoughToOpen = function() {
          return parseInt(this.paneTrueLeftOffset(), 10) < (parseInt( this.paneWidth(), 10 ) / 2);
        };

        this.paneMoving = fw.observable().receiveFrom('Pane', 'movingTimer');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.paneDragging = fw.observable().receiveFrom('Pane', 'dragging');
        this.paneDragOffset = fw.observable(0).receiveFrom('Pane', 'dragOffset');
        this.paneTransition = fw.observable(undefined).receiveFrom('Pane', 'transition');
        this.paneTrueLeftOffset = fw.observable(0).receiveFrom('Pane', 'trueLeftOffset');
        this.paneWidth = fw.observable(0).receiveFrom('Pane', 'width');
        this.closedOffset = fw.observable().receiveFrom('ViewPort', 'closedOffset');
        this.openOffset = fw.observable().receiveFrom('ViewPort', 'openOffset');
        this.viewPortDimensions = fw.observable().receiveFrom('ViewPort', 'dimensions');
        this.dragActive = fw.observable(false);

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