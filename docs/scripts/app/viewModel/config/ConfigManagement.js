define([ "footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'ConfigManagement',
      initialize: function() {
        var Configuration = ko.namespace('Configuration');

        this.transitionsEnabled = ko.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.helpDialog = ko.observable({}).receiveFrom('Configuration', 'helpDialog');
        this.noticeDialog = ko.observable({}).receiveFrom('Configuration', 'noticeDialog');
        this.autoHideHeader = ko.observable(false).receiveFrom('Configuration', 'autoHideHeader');
        this.savePulse = ko.observable().receiveFrom('Configuration', 'savePulse');
        this.paneCollapsed = ko.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.saveSession = ko.observable().receiveFrom('Configuration', 'saveSession');
        this.configVisible = ko.observable().receiveFrom('Configuration', 'visible');
        this.headerControlMutable = ko.observable().receiveFrom('LayoutControl', 'headerMutable');
        this.visibleHeaderHeight = ko.observable(60).receiveFrom('Header', 'visibleHeight');
        this.headerFixed = ko.observable(60).receiveFrom('Header', 'fixed');
        this.headerClosed = ko.observable(60).receiveFrom('Header', 'closed');
        this.pastHeaderClosePoint = ko.observable(false).receiveFrom('Header', 'pastClosePoint');
        this.headerMoving = ko.observable(false).receiveFrom('Header', 'moving');
        this.headerTopOffset = ko.observable().receiveFrom('Header', 'topOffset');
        this.headerClosedTransform = ko.observable().receiveFrom('Header', 'closedTransform');
        this.navReflowing = ko.observable(false).receiveFrom('Navigation', 'reflowing');
        this.columnWidth = ko.observable(0).receiveFrom('Pane', 'columnWidth');
        this.viewScrolling = ko.observable(false).receiveFrom('ViewPort', 'scrolling');

        this.pulse = this.savePulse;
        this.helpVisible = this.helpDialog;

        this.noTransition = ko.computed(function() {
          return (this.viewScrolling() || this.navReflowing()) && this.headerMoving() === false;
        }, this);

        this.containerTop = ko.computed(function() {
          return ( parseInt(this.visibleHeaderHeight(), 10) + parseInt(this.headerTopOffset(), 10) ) + 'px';
        }, this);

        this.containerMarginLeft = ko.computed(function() {
          return ( parseInt(this.columnWidth(), 10) + 5 ) + 'px';
        }, this);

        this.autoHideHeaderState = ko.computed(function() {
          return this.autoHideHeader() ? 'checked' : 'unchecked';
        }, this);

        this.paneState = ko.computed(function() {
          return this.paneCollapsed() ? 'checked' : 'unchecked';
        }, this);

        this.transitionState = ko.computed(function() {
          return this.transitionsEnabled() ? 'checked' : 'unchecked';
        }, this);

        this.saveSessionState = ko.computed(function() {
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