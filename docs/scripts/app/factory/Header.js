define([ "knockout-footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'Header',
      initialize: function() {
        var CLOSED = true,
            OPEN = false,
            DIRECTION_DOWN = 1,
            DIRECTION_UP = -1,
            DIRECTION_NOMOVE = 0,
            DELTA_INTENT_TRIGGER = 160;

        this.config = {
          headerMinHeight: ko.observable().receiveFrom('Configuration', 'headerMinHeight'),
          headerMaxHeight: ko.observable().receiveFrom('Configuration', 'headerMaxHeight'),
          headerBorderWidth: ko.observable().receiveFrom('Configuration', 'headerBorderWidth'),
          headerContentMaxHeight: ko.observable().receiveFrom('Configuration', 'headerContentMaxHeight'),
          autoHideHeader: ko.observable().receiveFrom('Configuration', 'autoHideHeader'),
          defaultHeaderMaxHeight: ko.observable().receiveFrom('Configuration', 'defaultHeaderMaxHeight')
        };
        this.viewPortScrollPosition = ko.observable(0).receiveFrom('ViewPort', 'scrollPosition');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortIsMobile = ko.observable().receiveFrom('ViewPort', 'isMobile');
        this.viewPortHas3dTransforms = ko.observable(true).receiveFrom('ViewPort', 'has3dTransforms');
        this.columnWidth = ko.observable(0).receiveFrom('Pane', 'columnWidth');
        this.paneCollapsed = ko.observable().receiveFrom('Pane', 'collapsed');
        this.paneMoving = ko.observable().receiveFrom('Pane', 'moving');
        this.navReflowing = ko.observable().receiveFrom('Navigation', 'reflowing');
        this.overlapPane = ko.observable().receiveFrom('Body', 'overlapPane');

        this.closable = ko.computed(function() {
          return this.viewPortIsMobile() === true || this.config.autoHideHeader() === true;
        }, this);
        this.animate3d = ko.computed(function() {
          return this.viewPortHas3dTransforms() === true && this.overlapPane() === true;
        }, this);

        this.height = ko.computed(function() {
          return Math.floor( this.config.headerMaxHeight() + this.config.headerBorderWidth() ) + 'px';
        }, this).broadcastAs('height');
        this.closed = ko.observable(false).broadcastAs('closed', true);
        this.closedTransform = ko.computed(function() {
          if( this.animate3d() === true ) {
            if( this.closable() && this.closed() ) {
              return 'translate3d(0px,-' + this.visibleHeight() + ',0px)';
            }
            return 'translate3d(0px,0px,0px)';
          }
          return 'none';
        }, this).broadcastAs('closedTransform');
        this.visibleHeight = ko.computed(function() {
          var headerMinHeight = this.config.headerMinHeight(),
              headerMaxHeight = this.config.headerMaxHeight(),
              height = ( headerMaxHeight - this.viewPortScrollPosition() );

          height = ( height >= headerMinHeight ? height : headerMinHeight );
          height = ( height <= headerMaxHeight ? height : headerMaxHeight );

          return Math.floor( height + this.config.headerBorderWidth() ) + 'px';
        }, this).broadcastAs('visibleHeight');
        this.sourceLinkVisibleMinHeight = ko.observable(155).broadcastAs('sourceLinkVisibleMinHeight');
        this.closePoint = ko.computed(function() {
          return parseInt( this.height(), 10 );
        }, this).broadcastAs('closePoint');

        var throttledMoving = ko.observable(false).extend({ throttle: { timeout: 300, when: function(moving) { return moving === false; } } });
        this.contentHeight = ko.computed(function() {
          var headerContentMaxHeight = this.config.headerContentMaxHeight(),
              visibleHeight = parseInt( this.visibleHeight(), 10 );

          visibleHeight = ( visibleHeight >= headerContentMaxHeight ? headerContentMaxHeight : visibleHeight );
          return ( visibleHeight - this.config.headerBorderWidth() ) + 'px';
        }, this).broadcastAs('contentHeight');
        this.minHeight = ko.computed(function() {
          return this.config.headerMinHeight() + this.config.headerBorderWidth();
        }, this).broadcastAs('minHeight');
        this.outerHeight = ko.computed(function() {
          return ( this.config.headerBorderWidth() + parseInt( this.height(), 10 ) ) + 'px';
        }, this).broadcastAs('outerHeight');
        this.fixed = ko.computed(function() {
          return this.config.headerMaxHeight() - this.viewPortScrollPosition() < this.config.headerMinHeight();
        }, this).broadcastAs('fixed');
        this.sourceLinkVisible = ko.computed(function() {
          return parseInt( this.visibleHeight(), 10 ) >= this.sourceLinkVisibleMinHeight();
        }, this).broadcastAs('sourceLinkVisible');
        this.pastClosePoint = ko.computed(function() {
          return this.viewPortScrollPosition() > this.closePoint();
        }, this).broadcastAs('pastClosePoint');
        this.moving = throttledMoving.extend({ autoDisable: 300 }).broadcastAs('moving');
        this.topOffset = ko.computed(function() {
          if( this.animate3d() === false && this.closed() === true ) {
            return '-' + this.visibleHeight();
          }
          return '0px';
        }, this).broadcastAs('topOffset');

        this.closed.subscribe(function() {
          this.moving(true);
        }, this);

        this.viewPortScrollPosition.subscribe(function( position ) {
          if( this.viewPortIsMobile() === true ||
              (this.overlapPane() && this.paneCollapsed() === false) ||
              this.paneMoving() === true ) {
            return false;
          }

          var vector,
              lastVector,
              lastVectorFlip,
              setState = this.closed(),
              defaultVector = {
                direction: DIRECTION_NOMOVE,
                position: position,
                delta: 0
              };

          if( this.closable() ) {
            if( this.pastClosePoint() === false ) {
              this.closed(OPEN);
              return false;
            }

            lastVector = this._lastVector || _.extend({}, defaultVector);
            lastVectorFlip = this._lastVectorFlip || _.extend({}, defaultVector);

            vector = {
              position: position,
              direction: (position - lastVector.position >= 0 ? DIRECTION_DOWN : DIRECTION_UP),
              delta: Math.abs(lastVectorFlip.position - position)
            };

            if( lastVector.direction !== vector.direction ) {
              this._lastVectorFlip = vector;
              vector.delta = 0;
            }

            if( vector.delta >= DELTA_INTENT_TRIGGER ) {
              if( vector.direction === DIRECTION_UP ) {
                setState = OPEN;
              } else if( vector.direction === DIRECTION_DOWN ) {
                setState = CLOSED;
              }
            }

            this.closed(setState);
            this._lastVector = vector;
          }
        }, this);

        this.fixed.subscribe(function( fixState ) {
          if( fixState === false ) {
            throttledMoving.force(false);
          }
        }, this);

        this.borderWidth = ko.computed(function() {
          return this.config.headerBorderWidth() + 'px';
        }, this);

        this.sourceLinkHidden = ko.computed(function() {
          return parseInt( this.visibleHeight(), 10 ) <= this.config.headerContentMaxHeight();
        }, this);

        this.headerStateCheck = ko.computed(function() {
          var viewPortLayoutMode = this.viewPortLayoutMode();

          if( viewPortLayoutMode !== 'mobile' && this.pastClosePoint() === false && this.paneMoving() === false && this.paneCollapsed() === true) {
            this.closed(false);
          } else if( viewPortLayoutMode === 'mobile' ) {
            this.closed(true);
          }
        }, this);
      }
    });
  }
);