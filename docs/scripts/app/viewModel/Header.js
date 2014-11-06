define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'Header',
      initialize: function() {
        var CLOSED = true;
        var OPEN = false;
        var DIRECTION_DOWN = 1;
        var DIRECTION_UP = -1;
        var DIRECTION_NOMOVE = 0;
        var DELTA_INTENT_TRIGGER = 160;

        this.headerMinHeight = fw.observable().receiveFrom('Configuration', 'headerMinHeight');
        this.headerMaxHeight = fw.observable().receiveFrom('Configuration', 'headerMaxHeight');
        this.headerBorderWidth = fw.observable().receiveFrom('Configuration', 'headerBorderWidth');
        this.headerContentMaxHeight = fw.observable().receiveFrom('Configuration', 'headerContentMaxHeight');
        this.autoHideHeader = fw.observable().receiveFrom('Configuration', 'autoHideHeader');
        this.defaultHeaderMaxHeight = fw.observable().receiveFrom('Configuration', 'defaultHeaderMaxHeight');
        this.viewPortScrollPosition = fw.observable(0).receiveFrom('ViewPort', 'scrollPosition');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortIsMobile = fw.observable().receiveFrom('ViewPort', 'isMobile');
        this.viewPortHas3dTransforms = fw.observable(true).receiveFrom('ViewPort', 'has3dTransforms');
        this.columnWidth = fw.observable(0).receiveFrom('Pane', 'columnWidth');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.paneMoving = fw.observable().receiveFrom('Pane', 'moving');
        this.navReflowing = fw.observable().receiveFrom('Navigation', 'reflowing');
        this.overlapPane = fw.observable().receiveFrom('Body', 'overlapPane');

        this.closable = fw.computed(function() {
          return this.viewPortIsMobile() === true || this.autoHideHeader() === true;
        }, this);
        this.animate3d = fw.computed(function() {
          return this.viewPortHas3dTransforms() === true && this.overlapPane() === true;
        }, this);

        this.height = fw.computed(function() {
          return Math.floor( this.headerMaxHeight() + this.headerBorderWidth() ) + 'px';
        }, this).broadcastAs('height');
        this.closed = fw.observable(false).broadcastAs('closed', true);
        this.closedTransform = fw.computed(function() {
          if( this.animate3d() === true ) {
            if( this.closable() && this.closed() ) {
              return 'translate3d(0px,-' + this.visibleHeight() + ',0px)';
            }
            return 'translate3d(0px,0px,0px)';
          }
          return 'none';
        }, this).broadcastAs('closedTransform');
        this.visibleHeight = fw.computed(function() {
          var headerMinHeight = this.headerMinHeight();
          var headerMaxHeight = this.headerMaxHeight();
          var height = ( headerMaxHeight - this.viewPortScrollPosition() );

          height = ( height >= headerMinHeight ? height : headerMinHeight );
          height = ( height <= headerMaxHeight ? height : headerMaxHeight );

          return Math.floor( height + this.headerBorderWidth() ) + 'px';
        }, this).broadcastAs('visibleHeight');
        this.sourceLinkVisibleMinHeight = fw.observable(155).broadcastAs('sourceLinkVisibleMinHeight');
        this.closePoint = fw.computed(function() {
          return parseInt( this.height(), 10 );
        }, this).broadcastAs('closePoint');

        var throttledMoving = fw.observable(false).extend({ debounce: { timeout: 300, when: function(moving) { return moving === false; } } });
        this.contentHeight = fw.computed(function() {
          var headerContentMaxHeight = this.headerContentMaxHeight();
          var visibleHeight = parseInt( this.visibleHeight(), 10 );

          visibleHeight = ( visibleHeight >= headerContentMaxHeight ? headerContentMaxHeight : visibleHeight );
          return ( visibleHeight - this.headerBorderWidth() ) + 'px';
        }, this).broadcastAs('contentHeight');
        this.minHeight = fw.computed(function() {
          return this.headerMinHeight() + this.headerBorderWidth();
        }, this).broadcastAs('minHeight');
        this.outerHeight = fw.computed(function() {
          return ( this.headerBorderWidth() + parseInt( this.height(), 10 ) ) + 'px';
        }, this).broadcastAs('outerHeight');
        this.fixed = fw.computed(function() {
          return this.headerMaxHeight() - this.viewPortScrollPosition() < this.headerMinHeight();
        }, this).broadcastAs('fixed');
        this.sourceLinkVisible = fw.computed(function() {
          return parseInt( this.visibleHeight(), 10 ) >= this.sourceLinkVisibleMinHeight();
        }, this).broadcastAs('sourceLinkVisible');
        this.pastClosePoint = fw.computed(function() {
          return this.viewPortScrollPosition() > this.closePoint();
        }, this).broadcastAs('pastClosePoint');
        this.moving = throttledMoving.extend({ autoDisable: 300 }).broadcastAs('moving');
        this.topOffset = fw.computed(function() {
          if( this.animate3d() === false && this.closed() === true ) {
            return '-' + this.visibleHeight();
          }
          return '0px';
        }, this).broadcastAs('topOffset');

        this.closed.subscribe(function() {
          this.moving(true);
        }, this);

        this.viewPortScrollPosition.subscribe(function( position ) {
          var vector;
          var lastVector;
          var lastVectorFlip;
          var setState = this.closed();
          var defaultVector = {
            direction: DIRECTION_NOMOVE,
            position: position,
            delta: 0
          };

          if( this.viewPortIsMobile() === true ||
              (this.overlapPane() && this.paneCollapsed() === false) ||
              this.paneMoving() === true ) {
            return false;
          }

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

        this.borderWidth = fw.computed(function() {
          return this.headerBorderWidth() + 'px';
        }, this);

        this.sourceLinkHidden = fw.computed(function() {
          return parseInt( this.visibleHeight(), 10 ) <= this.headerContentMaxHeight();
        }, this);

        this.headerStateCheck = fw.computed(function() {
          var viewPortLayoutMode = this.viewPortLayoutMode();

          if( viewPortLayoutMode !== 'mobile' ) {
            if( !this.closable() || (this.pastClosePoint() === false && this.paneMoving() === false && this.paneCollapsed() === true) ) {
              this.closed(false);
            }
          } else if( viewPortLayoutMode === 'mobile' ) {
            this.closed(true);
          }
        }, this);
      }
    });
  }
);