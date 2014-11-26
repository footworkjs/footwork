define([ "footwork", "lodash", "router" ],
  function( fw, _, router ) {
    return fw.viewModel({
      namespace: 'Body',
      router: router,
      afterBinding: function() {
        this.initialized( true );
      },
      initialize: function() {
        if( this.$globalNamespace.request('isRunningLocally') ) {
          this.$router.disableHistory = true;
          this.$router.setState('/');
        }

        this.initialized = fw.observable(false);
        this.configIsInitialized = fw.observable(false).receiveFrom('Configuration', 'initialized');
        this.configVisible = fw.observable().receiveFrom('Configuration', 'visible');
        this.configReflowing = fw.observable().receiveFrom('Configuration', 'reflowing');
        this.paneAccentPadding = fw.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.paneMinWidth = fw.observable().receiveFrom('Configuration', 'paneMinWidth');
        this.transitionsEnabled = fw.observable(false).receiveFrom('ViewPort', 'transitionsEnabled');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortIsTablet = fw.observable().receiveFrom('ViewPort', 'isTablet');
        this.viewPortSmall = fw.observable().receiveFrom('ViewPort', 'isSmall');
        this.viewPortDim = fw.observable().receiveFrom('ViewPort', 'dimensions');
        this.scrollPosition = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.maxScrollResetPosition = fw.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
        this.viewPortHas3dTransforms = fw.observable(true).receiveFrom('ViewPort', 'has3dTransforms');
        this.mainContentTopOffset = fw.observable(0).receiveFrom('Header', 'height');
        this.visibleHeaderHeight = fw.observable(0).receiveFrom('Header', 'visibleHeight');
        this.headerHeight = fw.observable(0).receiveFrom('Header', 'height');
        this.headerReflowing = fw.observable(false).receiveFrom('Header', 'reflowing');
        this.headerMoving = fw.observable(false).receiveFrom('Header', 'moving');
        this.headerTopOffset = fw.observable().receiveFrom('Header', 'topOffset');
        this.headerClosed = fw.observable().receiveFrom('Header', 'closed');
        this.visibleFooterHeight = fw.observable(0).receiveFrom('Footer', 'visibleHeight');
        this.footerHeight = fw.observable(0).receiveFrom('Footer', 'height');
        this.transform = fw.observable().receiveFrom('Pane', 'transform');
        this.paneWidth = fw.observable(0).receiveFrom('Pane', 'width');
        this.narrowPane = fw.observable(false).receiveFrom('Pane', 'narrow');
        this.paneCollapsed = fw.observable(false).receiveFrom('Configuration', 'paneCollapsed');
        this.paneMoving = fw.observable(false).receiveFrom('Pane', 'moving');
        this.paneAnimate3d = fw.observable(false).receiveFrom('Pane', 'animate3d');
        this.paneDragging = fw.observable(false).receiveFrom('Pane', 'dragging');
        this.paneDragOffset = fw.observable(0).receiveFrom('Pane', 'dragOffset');
        this.paneTransition = fw.observable(undefined).receiveFrom('Pane', 'transition');
        this.pageLoading = fw.observable().receiveFrom('mainRouter', 'pageLoading');
        this.paneColumnWidth = fw.observable().receiveFrom('Pane', 'columnWidth');
        this.controlEnabled = fw.observable(false).receiveFrom('LayoutControl', 'enabled');
        this.currentControl = fw.observable().receiveFrom('LayoutControl', 'currentControl');
        this.$paneTouchManagerNamespace = fw.namespace('PaneTouchManager');

        this.width = fw.computed(function() {
          if( typeof this.viewPortDim() === 'object' ) {
            return this.viewPortDim().width - this.paneWidth() + 'px';
          }

          return '0px';
        }, this).broadcastAs('width');
        this.overlapPane = fw.computed(function() {
          return this.viewPortSmall() || this.viewPortLayoutMode() === 'mobile';
        }, this).broadcastAs('overlapPane');
        this.height = fw.observable().broadcastAs('height', true);

        this.bodyState = fw.computed(function() {
          var currentControl = this.currentControl();
          return this.viewPortLayoutMode() + ( currentControl ? (' ' + currentControl + '-control') : '' );
        }, this);

        this.isSmallViewport = fw.computed(function() {
          return parseInt( this.paneColumnWidth(), 10 ) < parseInt( this.paneMinWidth(), 10 );
        }, this);

        this.transitionsDisabled = fw.computed(function() {
          return this.configIsInitialized() === false || this.transitionsEnabled() === false;
        }, this);

        this.layoutTransitionsDisabled = fw.computed(function() {
          return this.transitionsDisabled() || this.controlEnabled() || this.configReflowing();
        }, this);

        this.isMobile = fw.computed(function() {
          return this.viewPortLayoutMode() === 'mobile';
        }, this);

        this.isTablet = fw.computed(function() {
          return this.viewPortIsTablet();
        }, this);

        this.mainContentOffset = fw.computed(function() {
          return parseInt( this.paneWidth(), 10 ) + 'px';
        }, this);

        this.calculatedOffset = fw.computed(function() {
          var offset = parseInt(this.paneWidth(), 10);

          if( this.paneCollapsed() === true ) {
            offset = parseInt(this.paneAccentPadding(), 10);
          }

          if( this.paneDragging() === true ) {
            offset = offset - this.paneDragOffset();
          }

          return offset;
        }, this);

        this.leftOffset = fw.computed(function() {
          if( this.paneAnimate3d() === false ) {
            return this.calculatedOffset() + 'px';
          }
          return '0px';
        }, this);

        this.topOffset = fw.computed(function() {
          if( this.headerClosed() ) {
            return '0px';
          }
          return parseInt(this.visibleHeaderHeight(), 10) + 'px';
        }, this);

        this.transform = fw.computed(function() {
          var xTranslation = 0;

          if( this.paneAnimate3d() === true ) {
            xTranslation = this.calculatedOffset();
          }
          return 'translate3d(' + xTranslation + 'px,0px,0px)';
        }, this);

        this.minHeight = fw.computed(function() {
          var scrollPosition = this.scrollPosition();
          var maxScrollResetPosition = this.maxScrollResetPosition();
          var viewPortDim = this.viewPortDim();
          var minHeight;

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
            this.$globalNamespace.publish('refreshDocSize');
          }, this);

        this.uiState = fw.computed(function() {
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

        this.bodyClick = function() {
          this.$globalNamespace.publish('clear');
          return true;
        };

        this.togglePaneCollapse = function() {
          if( _.isUndefined(this.$paneTouchManagerNamespace.request('ping')) || !this.isMobile() ) {
            this.paneCollapsed( !this.paneCollapsed() );
          }
        }.bind( this );
        this.$namespace.subscribe('togglePane', this.togglePaneCollapse);

        // ensure the pane is in the correct state when a new page is loaded via the $router
        this.$router.$outlet('mainContent').subscribe(function() {
          if( this.overlapPane() === true && this.paneCollapsed() === false ) {
            this.paneCollapsed(true);
          }
        }.bind(this));
      }
    });
  }
);