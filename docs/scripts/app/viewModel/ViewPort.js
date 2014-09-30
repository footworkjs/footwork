define([ "jquery", "lodash", "footwork" ],
  function( $, _, ko ) {
    return ko.viewModel({
      namespace: 'ViewPort',
      initialize: function() {
        ko.observable().receiveFrom('Configuration', 'initialized').subscribe(function(isInitialized) {
          if(isInitialized === true) {
            setTimeout(function() {
              this.initialLoad(false);
            }.bind(this));
          }
        }, this);

        this.configTransitionsEnabled = ko.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.paneAccentPadding = ko.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.paneCollapsed = ko.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.configIsMobile = ko.observable().receiveFrom('Configuration', 'isMobile');
        this.visible = ko.observable(false).receiveFrom('Configuration', 'visible');
        this.mobileWidthCutoff = ko.observable(0).receiveFrom('Configuration', 'mobileWidthCutoff');
        this.headerHeight = ko.observable().receiveFrom('Header', 'height');
        this.headerMinHeight = ko.observable().receiveFrom('Header', 'minHeight');

        this.resizing = ko.observable( false ).extend({ autoDisable: 200 }).broadcastAs('resizing');
        this.initialLoad = ko.observable( true ).broadcastAs('initialLoad');
        this.scrolling = ko.observable(false).extend({ autoDisable: 100 }).broadcastAs('scrolling');
        this.scrollPosition = ko.observable(0).broadcastAs('scrollPosition', true);
        this.dimensions = ko.observable( { width: null, height: null } ).extend({
          write: function( observable, value ) {
            this.resizing( true );
            observable( value );
            this.$globalNamespace.publish( 'refreshDocSize' );
          }.bind( this )
        }).broadcastAs('dimensions', true);
        this.isTablet = ko.observable( window.isTablet ).broadcastAs('isTablet', true);
        this.isMobile = ko.computed(function() {
          return this.configIsMobile() || (this.dimensions().width || 9000) < this.mobileWidthCutoff();
        }, this);
        this.noTransitions = ko.observable(false).broadcastAs('noTransitions', true);
        this.closedOffset = ko.computed(function() {
          return this.dimensions().width - ( parseInt(this.paneAccentPadding(), 10) * 2 );
        }, this).broadcastAs('closedOffset');
        this.openOffset = ko.computed(function() {
          return -1 * this.closedOffset();
        }, this).broadcastAs('openOffset');

        this.bottomScrollPosition = ko.computed(function() {
          return this.scrollPosition() + this.dimensions().height;
        }, this).broadcastAs('bottomScrollPosition');
        this.has3dTransforms = ko.observable( window.Modernizr.csstransforms3d ).broadcastAs('has3dTransforms');

        this.layoutMode = ko.computed(function() {
          if( this.isMobile() ) {
            return 'mobile';
          } else if( this.isTablet() ) {
            return 'tablet';
          }
          return 'desktop';
        }, this).broadcastAs('layoutMode');

        this.$namespace.request.handler('layoutMode', function() {
          return this.layoutMode();
        }, this);

        this.isSmall = ko.computed(function() {
          if( _.isNull(this.dimensions().width) === false ) {
            return this.dimensions().width <= 768;
          }
          return null;
        }, this).broadcastAs('isSmall');
        this.logoWidth = ko.observable(161).broadcastAs('logoWidth');
        this.transitionsEnabled = ko.computed(function() {
          return !this.initialLoad() && !this.resizing() && this.configTransitionsEnabled() && !this.noTransitions();
        }, this).broadcastAs('transitionsEnabled');
        this.maxScrollResetPosition = ko.computed(function() {
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