define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'Pane',
      afterBinding: function() {
        this.$namespace.trigger('initialized', true, false);
      },
      initialize: function() {
        this.paneMaxWidth = fw.observable().receiveFrom('Configuration', 'paneMaxWidth');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.paneAccentPadding = fw.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.linksMinWidth = fw.observable().receiveFrom('Configuration', 'linksMinWidth');
        this.configReflowing = fw.observable().receiveFrom('Configuration', 'reflowing');
        this.viewPortDim = fw.observable({}).receiveFrom('ViewPort', 'dimensions');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortSmall = fw.observable(true).receiveFrom('ViewPort', 'isSmall');
        this.logoWidth = fw.observable(161).receiveFrom('ViewPort', 'logoWidth');
        this.viewPortHas3dTransforms = fw.observable(true).receiveFrom('ViewPort', 'has3dTransforms');
        this.headerVisibleHeight = fw.observable().receiveFrom('Header', 'visibleHeight');
        this.headerClosed = fw.observable().receiveFrom('Header', 'closed');
        this.headerTopOffset = fw.observable().receiveFrom('Header', 'topOffset');
        this.headerClosedTopOffset = fw.observable().receiveFrom('Header', 'closedTopOffset');
        this.overlapPane = fw.observable().receiveFrom('Body', 'overlapPane');

        this.movingTimer = fw.observable(false).extend({ autoDisable: 400 }).broadcastAs('movingTimer', true);
        this.maxWidth = fw.computed(function() {
          var viewPortDim = this.viewPortDim();
          if( _.isObject(viewPortDim) && !_.isUndefined(viewPortDim.width) ) {
            var computedWidth = Math.floor( viewPortDim.width / 2.66 );
            var logoBasedWidth = 9000;
            if( this.viewPortSmall() ) {
              logoBasedWidth = this.logoWidth() + 10;
            }
            return (computedWidth < logoBasedWidth ? computedWidth : logoBasedWidth);
          }
          return 0;
        }, this).broadcastAs('maxWidth');
        this.columnWidth = fw.computed(function() {
          var configMaxWidth = this.paneMaxWidth(),
              maxWidth = this.maxWidth();

          if( (this.viewPortLayoutMode() !== 'desktop' && this.viewPortLayoutMode() !== 'tablet') || this.viewPortSmall() ) {
            return maxWidth + 'px';
          }

          if( maxWidth ) {
            return ( maxWidth <= configMaxWidth && this.configReflowing() === false ? maxWidth : configMaxWidth ) + 'px';
          }
          return 9000;
        }, this).broadcastAs('columnWidth');
        this.shouldBeCollapsed = fw.computed(function() {
          return this.viewPortSmall();
        }, this).broadcastAs('shouldBeCollapsed');
        this.narrow = fw.computed(function() {
          if( this.viewPortLayoutMode() === 'desktop' || this.viewPortLayoutMode() === 'tablet' ) {
            return parseInt(this.columnWidth(), 10) - this.logoWidth() - (this.paneAccentPadding() * 2) <= this.linksMinWidth();
          }

          return true;
        }, this).broadcastAs('narrow');
        this.collapsed = this.paneCollapsed;
        this.dragging = fw.observable(false).broadcastAs('dragging', true);
        this.dragOffset = fw.observable(0).broadcastAs('dragOffset', true);
        this.moving = fw.computed(function() {
          return this.movingTimer() === true && _.isUndefined(this.transition());
        }, this).broadcastAs('moving');
        this.scrolling = fw.observable(false).extend({
          autoDisable: 500,
        }).broadcastAs('scrolling', true);
        this.transition = fw.observable(undefined).broadcastAs('transition', true);
        this.width = fw.computed(function() {
          if( this.overlapPane() === true ) {
            return this.viewPortDim().width - this.paneAccentPadding() + 'px';
          }

          return this.columnWidth();
        }, this).broadcastAs('width');
        this.contentMaxHeight = fw.computed(function() {
          var viewPortDim = this.viewPortDim();
          var headerVisibleHeight = parseInt( this.headerVisibleHeight(), 10 );
          var topRowHeight = 50;
          var heightOffset = topRowHeight;

          if( this.headerClosed() === false ) {
            heightOffset = heightOffset + headerVisibleHeight;
          }
          if( this.viewPortLayoutMode() === 'mobile' || this.narrow() === true ) {
            heightOffset = heightOffset + 30; // mobile menu selection height
          }

          if( !_.isUndefined(viewPortDim) ) {
            return viewPortDim.height - heightOffset;
          }
          
          return 0;
        }, this).broadcastAs('contentMaxHeight');
        this.animate3d = fw.computed(function() {
          return this.viewPortHas3dTransforms() === true && this.overlapPane() === true;
        }, this).broadcastAs('animate3d');

        this.viewPortLayoutMode.subscribe(function(mode) {
          if( mode === 'mobile' ) {
            this.movingTimer.triggerDelay = 300;
          } else {
            this.movingTimer.triggerDelay = 500;
          }
        }, this);

        this.collapsed.subscribe(function() {
          if( this.dragging() === false ) {
            this.movingTimer(true);
          }
        }, this);

        this.topOffset = fw.computed(function() {
          if( this.animate3d() === true ) {
            return '0px';
          }
          if( this.headerClosed() === false ) {
            return ( parseInt(this.headerVisibleHeight(), 10) + parseInt(this.headerTopOffset(), 10) ) + 'px';
          }
          return '0px';
        }, this);

        this.trueLeftOffset = fw.computed(function() {
          var offset = 0;
          if( this.collapsed() === true ) {
            offset = ( parseInt(this.width(), 10) - parseInt(this.paneAccentPadding(), 10) );
          }

          if( this.dragging() === true ) {
            offset = offset + this.dragOffset();
          }

          return offset + 'px';
        }, this).broadcastAs('trueLeftOffset');

        this.leftOffset = fw.computed(function() {
          if( this.animate3d() === true ) {
            return '0px';
          }
          return '-' + this.trueLeftOffset();
        }, this).broadcastAs('leftOffset');

        this.transform = fw.computed(function() {
          var xTranslation, yTranslation;

          if( this.animate3d() === true ) {
            yTranslation = parseInt(this.headerVisibleHeight(), 10);
            xTranslation = parseInt(this.trueLeftOffset(), 10);

            if( this.headerClosed() === true ) {
              yTranslation = 0;
            }
            return 'translate3d(-' + xTranslation + 'px,' + yTranslation + 'px,0px)';
          }
          return 'none';
        }, this).broadcastAs('transform');

        this.leftTransform = fw.computed(function() {
          if( this.animate3d() === true ) {
            return 'translate3d(-' + this.trueLeftOffset() + ',0px,0px)';
          }
          return 'none';
        }, this).broadcastAs('leftTransform');
      }
    });
  }
);