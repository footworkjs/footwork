define([ "jquery", "lodash", "knockout-footwork" ],
  function( $, _, ko ) {
    return ko.viewModel({
      namespace: 'ViewPort',
      afterCreating: function() {
        this.initialLoad(false);

        if( this.isMobile() === true ) {
          this.config.paneCollapsed(true);
        }
      },
      initialize: function() {
        this.config = {
          transitionsEnabled: ko.observable().receiveFrom('Configuration', 'transitionsEnabled'),
          paneAccentPadding: ko.observable().receiveFrom('Configuration', 'paneAccentPadding'),
          paneCollapsed: ko.observable().receiveFrom('Configuration', 'paneCollapsed'),
          isMobile: ko.observable().receiveFrom('Configuration', 'isMobile'),
          visible: ko.observable(false).receiveFrom('Configuration', 'visible')
        };
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
            this._viewModel.globalNamespace.publish( 'refreshDocSize' );
          }.bind( this )
        }).broadcastAs('dimensions', true);
        this.isTablet = ko.observable( window.isTablet ).broadcastAs('isTablet', true);
        this.isMobile = this.config.isMobile.broadcastAs('isMobile', true);
        this.noTransitions = ko.observable(false).broadcastAs('noTransitions', true);
        this.closedOffset = ko.computed(function() {
          return this.dimensions().width - ( parseInt(this.config.paneAccentPadding(), 10) * 2 );
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
        this.isSmall = ko.computed(function() {
          if( this.dimensions().width !== null ) {
            return this.dimensions().width <= 768;
          }
          return null;
        }, this).broadcastAs('isSmall');
        this.logoWidth = ko.observable(161).broadcastAs('logoWidth');
        this.transitionsEnabled = ko.computed(function() {
          return !this.initialLoad() && !this.resizing() && this.config.transitionsEnabled() && !this.noTransitions();
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
              this.config.paneCollapsed( isSmall );
            }
          } else if( this.initialLoad() ) {
            this.config.paneCollapsed( true );
          }
          if( (isSmall || this.initialLoad() === false) && this.layoutMode() === 'desktop' ) {
          }
        }, this);
      }
    });
  }
);