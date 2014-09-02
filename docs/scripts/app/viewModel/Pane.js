define([ "footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'Pane',
      afterBinding: function() {
        ko.namespace('PaneDragManager').trigger('PaneInitialized', true, false);
      },
      initialize: function() {
        this.paneMaxWidth = ko.observable().receiveFrom('Configuration', 'paneMaxWidth');
        this.paneCollapsed = ko.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.paneAccentPadding = ko.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.linksMinWidth = ko.observable().receiveFrom('Configuration', 'linksMinWidth');
        this.configReflowing = ko.observable().receiveFrom('Configuration', 'reflowing');
        this.viewPortDim = ko.observable({}).receiveFrom('ViewPort', 'dimensions');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortSmall = ko.observable().receiveFrom('ViewPort', 'isSmall');
        this.logoWidth = ko.observable(161).receiveFrom('ViewPort', 'logoWidth');
        this.viewPortHas3dTransforms = ko.observable(true).receiveFrom('ViewPort', 'has3dTransforms');
        this.headerVisibleHeight = ko.observable().receiveFrom('Header', 'visibleHeight');
        this.headerClosed = ko.observable().receiveFrom('Header', 'closed');
        this.headerTopOffset = ko.observable().receiveFrom('Header', 'topOffset');
        this.headerClosedTopOffset = ko.observable().receiveFrom('Header', 'closedTopOffset');
        this.overlapPane = ko.observable().receiveFrom('Body', 'overlapPane');

        this.movingTimer = ko.observable(false).extend({ autoDisable: 400 }).broadcastAs('movingTimer', true);
        this.maxWidth = ko.computed(function() {
          var viewPortDim = this.viewPortDim();
          if( viewPortDim !== undefined && viewPortDim.width !== undefined ) {
            return Math.floor( viewPortDim.width / 2.66 );
          }
          return 0;
        }, this).broadcastAs('maxWidth');
        this.columnWidth = ko.computed(function() {
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
        this.shouldBeCollapsed = ko.computed(function() {
          return this.viewPortSmall();
        }, this).broadcastAs('shouldBeCollapsed');
        this.narrow = ko.computed(function() {
          if( this.viewPortLayoutMode() === 'desktop' || this.viewPortLayoutMode() === 'tablet' ) {
            return parseInt(this.columnWidth(), 10) - this.logoWidth() - (this.paneAccentPadding() * 2) <= this.linksMinWidth();
          }

          return true;
        }, this).broadcastAs('narrow');
        this.collapsed = this.paneCollapsed.broadcastAs('collapsed', true);
        this.dragging = ko.observable(false).broadcastAs('dragging', true);
        this.dragOffset = ko.observable(0).broadcastAs('dragOffset', true);
        this.moving = ko.computed(function() {
          return this.movingTimer() === true && this.transition() === undefined;
        }, this).broadcastAs('moving');
        this.scrolling = ko.observable(false).extend({
          autoDisable: 500,
        }).broadcastAs('scrolling', true);
        this.transition = ko.observable(undefined).broadcastAs('transition', true);
        this.width = ko.computed(function() {
          if( this.overlapPane() === true ) {
            return this.viewPortDim().width - this.paneAccentPadding() + 'px';
          }

          return this.columnWidth();
        }, this).broadcastAs('width');
        this.contentMaxHeight = ko.computed(function() {
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

          if( viewPortDim !== undefined ) {
            return viewPortDim.height - heightOffset;
          }
          
          return 0;
        }, this).broadcastAs('contentMaxHeight');
        this.animate3d = ko.computed(function() {
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

        this.topOffset = ko.computed(function() {
          if( this.animate3d() === true ) {
            return '0px';
          }
          if( this.headerClosed() === false ) {
            return ( parseInt(this.headerVisibleHeight(), 10) + parseInt(this.headerTopOffset(), 10) ) + 'px';
          }
          return '0px';
        }, this);

        this.trueLeftOffset = ko.computed(function() {
          var offset = 0;
          if( this.collapsed() === true ) {
            offset = ( parseInt(this.width(), 10) - parseInt(this.paneAccentPadding(), 10) );
          }

          if( this.dragging() === true ) {
            offset = offset + this.dragOffset();
          }

          return offset + 'px';
        }, this).broadcastAs('trueLeftOffset');

        this.leftOffset = ko.computed(function() {
          if( this.animate3d() === true ) {
            return '0px';
          }
          return '-' + this.trueLeftOffset();
        }, this).broadcastAs('leftOffset');

        this.transform = ko.computed(function() {
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

        this.leftTransform = ko.computed(function() {
          if( this.animate3d() === true ) {
            return 'translate3d(-' + this.trueLeftOffset() + ',0px,0px)';
          }
          return 'none';
        }, this).broadcastAs('leftTransform');
      }
    });
  }
);