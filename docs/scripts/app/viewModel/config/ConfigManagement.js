define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'ConfigManagement',
      initialize: function() {
        var Configuration = fw.namespace('Configuration');

        this.transitionsEnabled = fw.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.helpDialog = fw.observable({}).receiveFrom('Configuration', 'helpDialog');
        this.noticeDialog = fw.observable({}).receiveFrom('Configuration', 'noticeDialog');
        this.autoHideHeader = fw.observable(false).receiveFrom('Configuration', 'autoHideHeader');
        this.savePulse = fw.observable().receiveFrom('Configuration', 'savePulse');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.saveSession = fw.observable().receiveFrom('Configuration', 'saveSession');
        this.configVisible = fw.observable().receiveFrom('Configuration', 'visible');
        this.headerControlMutable = fw.observable().receiveFrom('LayoutControl', 'headerMutable');
        this.visibleHeaderHeight = fw.observable(60).receiveFrom('Header', 'visibleHeight');
        this.headerFixed = fw.observable(60).receiveFrom('Header', 'fixed');
        this.headerClosed = fw.observable(60).receiveFrom('Header', 'closed');
        this.pastHeaderClosePoint = fw.observable(false).receiveFrom('Header', 'pastClosePoint');
        this.headerMoving = fw.observable(false).receiveFrom('Header', 'moving');
        this.headerTopOffset = fw.observable().receiveFrom('Header', 'topOffset');
        this.headerClosedTransform = fw.observable().receiveFrom('Header', 'closedTransform');
        this.navReflowing = fw.observable(false).receiveFrom('Navigation', 'reflowing');
        this.columnWidth = fw.observable(0).receiveFrom('Pane', 'columnWidth');
        this.viewScrolling = fw.observable(false).receiveFrom('ViewPort', 'scrolling');

        this.pulse = this.savePulse;
        this.helpVisible = this.helpDialog;

        this.noTransition = fw.computed(function() {
          return (this.viewScrolling() || this.navReflowing()) && this.headerMoving() === false;
        }, this);

        this.containerTop = fw.computed(function() {
          return ( parseInt(this.visibleHeaderHeight(), 10) + parseInt(this.headerTopOffset(), 10) ) + 'px';
        }, this);

        this.containerMarginLeft = fw.computed(function() {
          return ( parseInt(this.columnWidth(), 10) + 5 ) + 'px';
        }, this);

        this.autoHideHeaderState = fw.computed(function() {
          return this.autoHideHeader() ? 'checked' : 'unchecked';
        }, this);

        this.paneState = fw.computed(function() {
          return this.paneCollapsed() ? 'checked' : 'unchecked';
        }, this);

        this.transitionState = fw.computed(function() {
          return this.transitionsEnabled() ? 'checked' : 'unchecked';
        }, this);

        this.saveSessionState = fw.computed(function() {
          return this.saveSession() === true ? 'partial' : 'unchecked';
        }, this);

        this.togglePane = function() {
          this.paneCollapsed( !this.paneCollapsed() );
        };

        this.toggleTransitions = function() {
          this.transitionsEnabled( !this.transitionsEnabled() );
        };

        this.toggleConfiguration = function() {
          this.configVisible( !this.configVisible() );
        }.bind( this );

        this.toggleSaveSession = function() {
          this.saveSession( !this.saveSession() );
        }.bind( this );

        this.toggleAutoHideHeader = function() {
          if( this.autoHideHeader() === true ) {
            this.headerClosed(false);
          } else if( this.pastHeaderClosePoint() ) {
            this.headerClosed(true);
          }
          this.autoHideHeader( !this.autoHideHeader() );
        };

        this.reset = function() {
          Configuration.publish('reset');
        }.bind( this );

        return this;
      }
    });
  }
);