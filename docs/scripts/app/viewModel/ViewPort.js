define([ "jquery", "lodash", "footwork" ],
  function( $, _, fw ) {
    return fw.viewModel({
      namespace: 'ViewPort',
      initialize: function() {
        this.configTransitionsEnabled = fw.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.paneAccentPadding = fw.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.configIsMobile = fw.observable().receiveFrom('Configuration', 'isMobile');
        this.visible = fw.observable(false).receiveFrom('Configuration', 'visible');
        this.mobileWidthCutoff = fw.observable(0).receiveFrom('Configuration', 'mobileWidthCutoff');
        this.headerHeight = fw.observable().receiveFrom('Header', 'height');
        this.headerMinHeight = fw.observable().receiveFrom('Header', 'minHeight');
        this.currentSelection = fw.observable().receiveFrom('PaneLinks', 'currentSelection');

        this.resizing = fw.observable( false ).extend({ autoDisable: 200 }).broadcastAs('resizing');
        this.initialLoad = fw.observable( true ).broadcastAs('initialLoad', true);
        this.scrolling = fw.observable(false).extend({ autoDisable: 100 }).broadcastAs('scrolling');
        this.scrollPosition = fw.observable(0).broadcastAs('scrollPosition', true);
        this.dimensions = fw.observable( { width: null, height: null } ).extend({
          write: function( observable, value ) {
            this.resizing( true );
            observable( value );
            this.$globalNamespace.publish( 'refreshDocSize' );
          }.bind( this )
        }).broadcastAs('dimensions', true);
        this.isTablet = fw.observable( window.isTablet ).broadcastAs('isTablet', true);
        this.forceMobileLayout = fw.computed(function() {
          return (this.dimensions().width || 9000) < this.mobileWidthCutoff();
        }, this).broadcastAs('forceMobileLayout');
        this.isMobile = fw.computed(function() {
          return this.configIsMobile() || this.forceMobileLayout();
        }, this).broadcastAs('isMobile');
        this.noTransitions = fw.observable(false).broadcastAs('noTransitions', true);
        this.closedOffset = fw.computed(function() {
          return this.dimensions().width - ( parseInt(this.paneAccentPadding(), 10) * 2 );
        }, this).broadcastAs('closedOffset');
        this.openOffset = fw.computed(function() {
          return -1 * this.closedOffset();
        }, this).broadcastAs('openOffset');

        this.bottomScrollPosition = fw.computed(function() {
          return this.scrollPosition() + this.dimensions().height;
        }, this).broadcastAs('bottomScrollPosition');
        this.has3dTransforms = fw.observable( window.Modernizr.csstransforms3d ).broadcastAs('has3dTransforms');

        this.layoutMode = fw.computed(function() {
          if( this.isMobile() ) {
            return 'mobile';
          } else if( this.isTablet() ) {
            return 'tablet';
          }
          return 'desktop';
        }, this).broadcastAs('layoutMode');

        var wasMobile = false;
        this.isMobile.subscribe(function(isMobile) {
          if(wasMobile && !isMobile) {
            if(this.currentSelection() === 'NavMenu') {
              this.currentSelection('PageSections');
            }
            if(this.paneCollapsed() === false) {
              this.paneCollapsed(true);
            }
          } else if(!wasMobile && isMobile) {
            if(this.paneCollapsed() === false) {
              this.paneCollapsed(true);
            }
            this.currentSelection('NavMenu');
          }
          wasMobile = isMobile;
        }, this);

        this.$namespace.request.handler('layoutMode', function() {
          return this.layoutMode();
        }, this);

        this.isSmall = fw.computed(function() {
          if( _.isNull(this.dimensions().width) === false ) {
            return this.dimensions().width <= 768;
          }
          return null;
        }, this).broadcastAs('isSmall');
        this.logoWidth = fw.observable(161).broadcastAs('logoWidth');
        this.transitionsEnabled = fw.computed(function() {
          return !this.initialLoad() && !this.resizing() && this.configTransitionsEnabled() && !this.noTransitions();
        }, this).broadcastAs('transitionsEnabled');
        this.maxScrollResetPosition = fw.computed(function() {
          return parseInt( this.headerHeight(), 10 ) - this.headerMinHeight();
        }, this).broadcastAs('maxScrollResetPosition');

        this.scrollPosition.subscribe(function() {
          this.scrolling(true);
        }, this);

        this.isSmall.subscribe(function(isSmall) {
          if( this.layoutMode() === 'desktop' || this.layoutMode() === 'tablet' ) {
            if( isSmall || this.initialLoad() === false ) {
              this.paneCollapsed( isSmall );
            }
          } else if( this.initialLoad() ) {
            this.paneCollapsed( true );
          }
          if( (isSmall || this.initialLoad() === false) && this.layoutMode() === 'desktop' ) {
          }
        }, this);
      }
    });
  }
);