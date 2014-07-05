define([ "knockout-footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'Body',
      afterBinding: function() {
        this.initialized( true );
      },
      initialize: function() {
        this.initialized = ko.observable(false);
        this.configVisible = ko.observable().receiveFrom('Configuration', 'visible');
        this.configReflowing = ko.observable().receiveFrom('Configuration', 'reflowing');
        this.paneAccentPadding = ko.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.paneMinWidth = ko.observable().receiveFrom('Configuration', 'paneMinWidth');
        this.transitionsEnabled = ko.observable(false).receiveFrom('ViewPort', 'transitionsEnabled');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortIsTablet = ko.observable().receiveFrom('ViewPort', 'isTablet');
        this.viewPortSmall = ko.observable().receiveFrom('ViewPort', 'isSmall');
        this.viewPortDim = ko.observable().receiveFrom('ViewPort', 'dimensions');
        this.scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.maxScrollResetPosition = ko.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
        this.viewPortHas3dTransforms = ko.observable(true).receiveFrom('ViewPort', 'has3dTransforms');
        this.mainContentTopOffset = ko.observable(0).receiveFrom('Header', 'height');
        this.visibleHeaderHeight = ko.observable(0).receiveFrom('Header', 'visibleHeight');
        this.headerHeight = ko.observable(0).receiveFrom('Header', 'height');
        this.headerReflowing = ko.observable(false).receiveFrom('Header', 'reflowing');
        this.headerMoving = ko.observable(false).receiveFrom('Header', 'moving');
        this.headerTopOffset = ko.observable().receiveFrom('Header', 'topOffset');
        this.headerClosed = ko.observable().receiveFrom('Header', 'closed');
        this.visibleFooterHeight = ko.observable(0).receiveFrom('Footer', 'visibleHeight');
        this.footerHeight = ko.observable(0).receiveFrom('Footer', 'height');
        this.transform = ko.observable().receiveFrom('Pane', 'transform');
        this.paneWidth = ko.observable(0).receiveFrom('Pane', 'width');
        this.narrowPane = ko.observable(true).receiveFrom('Pane', 'narrow');
        this.paneCollapsed = ko.observable(false).receiveFrom('Pane', 'collapsed');
        this.paneMoving = ko.observable(false).receiveFrom('Pane', 'moving');
        this.paneAnimate3d = ko.observable(false).receiveFrom('Pane', 'animate3d');
        this.paneDragging = ko.observable(false).receiveFrom('Pane', 'dragging');
        this.paneDragOffset = ko.observable(0).receiveFrom('Pane', 'dragOffset');
        this.paneTransition = ko.observable(undefined).receiveFrom('Pane', 'transition');
        this.pageLoading = ko.observable(false).receiveFrom('Page', 'loading');
        this.paneColumnWidth = ko.observable().receiveFrom('Pane', 'columnWidth');
        this.controlEnabled = ko.observable(false).receiveFrom('LayoutControl', 'enabled');
        this.currentControl = ko.observable().receiveFrom('LayoutControl', 'currentControl');

        this.width = ko.computed(function() {
          if( typeof this.viewPortDim() === 'object' ) {
            return this.viewPortDim().width - this.paneWidth() + 'px';
          }

          return '0px';
        }, this).broadcastAs('width');
        this.overlapPane = ko.computed(function() {
          return this.viewPortSmall() || this.viewPortLayoutMode() === 'mobile';
        }, this).broadcastAs('overlapPane');
        this.height = ko.observable().broadcastAs('height', true);

        this.bodyState = ko.computed(function() {
          var currentControl = this.currentControl();
          return this.viewPortLayoutMode() + ( currentControl ? (' ' + currentControl + '-control') : '' );
        }, this);

        this.isSmallViewport = ko.computed(function() {
          return parseInt( this.paneColumnWidth(), 10 ) < parseInt( this.paneMinWidth(), 10 );
        }, this);

        this.transitionsDisabled = ko.computed(function() {
          return this.transitionsEnabled() === false;
        }, this);

        this.layoutTransitionsDisabled = ko.computed(function() {
          return this.transitionsDisabled() || this.controlEnabled() || this.configReflowing();
        }, this);

        this.isMobile = ko.computed(function() {
          return this.viewPortLayoutMode() === 'mobile';
        }, this);

        this.isTablet = ko.computed(function() {
          return this.viewPortIsTablet();
        }, this);

        this.mainContentOffset = ko.computed(function() {
          return parseInt( this.paneWidth(), 10 ) + 'px';
        }, this);

        this.calculatedOffset = ko.computed(function() {
          var offset = parseInt(this.paneWidth(), 10);

          if( this.paneCollapsed() === true ) {
            offset = parseInt(this.paneAccentPadding(), 10);
          }

          if( this.paneDragging() === true ) {
            offset = offset - this.paneDragOffset();
          }

          return offset;
        }, this);

        this.leftOffset = ko.computed(function() {
          if( this.paneAnimate3d() === false ) {
            return this.calculatedOffset() + 'px';
          }
          return '0px';
        }, this);

        this.topOffset = ko.computed(function() {
          if( this.headerClosed() ) {
            return '0px';
          }
          return parseInt(this.visibleHeaderHeight(), 10) + 'px';
        }, this);

        this.transform = ko.computed(function() {
          var xTranslation = 0;

          if( this.paneAnimate3d() === true ) {
            xTranslation = this.calculatedOffset();
          }
          return 'translate3d(' + xTranslation + 'px,0px,0px)';
        }, this);

        this.minHeight = ko.computed(function() {
          var scrollPosition = this.scrollPosition(),
              maxScrollResetPosition = this.maxScrollResetPosition(),
              viewPortDim = this.viewPortDim(),
              minHeight;

          if( parseInt(this.visibleHeaderHeight(), 10) === parseInt(this.headerHeight(), 10) &&
              parseInt(this.visibleFooterHeight(), 10) === parseInt(this.footerHeight(), 10) ) {
            return '';
          }

          if( viewPortDim ) {
            if( scrollPosition >= maxScrollResetPosition ) {
              minHeight = viewPortDim.height + maxScrollResetPosition;
            } else {
              minHeight = viewPortDim.height + scrollPosition;
            }

            minHeight = minHeight + 'px';
          }

          return minHeight;
        }, this);

        this.minHeight.extend({ throttle: 150 })
          .subscribe(function() {
            this._viewModel.globalNamespace.publish('refreshDocSize');
          }, this);

        this.uiState = ko.computed(function() {
          return {
            initialized: this.initialized(),
            loading: this.pageLoading(),
            tablet: this.isTablet(),
            narrow: this.narrowPane(),
            verySmall: this.isSmallViewport(),
            collapsed: this.paneCollapsed(),
            paneMoving: this.paneMoving(),
            overlapPane: this.overlapPane(),
            headerMoving: this.headerMoving(),
            headerReflowing: this.headerReflowing(),
            transitionsDisabled: this.transitionsDisabled(),
            layoutTransitionsDisabled: this.layoutTransitionsDisabled()
          };
        }, this);

        this.togglePaneCollapse = function() {
          this.paneCollapsed( !this.paneCollapsed() );
        }.bind( this );
        this.namespace.subscribe('togglePane', this.togglePaneCollapse);
      }
    });
  }
);