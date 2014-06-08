define([ "knockout-footwork", "lodash" ],
  function( ko, _ ) {
    return ko.model({
      namespace: 'ConfigManagement',
      factory: function() {
        var Configuration = ko.namespace('Configuration');

        this.config = {
          transitionsEnabled: ko.observable().receiveFrom('Configuration', 'transitionsEnabled'),
          helpDialog: ko.observable({}).receiveFrom('Configuration', 'helpDialog'),
          noticeDialog: ko.observable({}).receiveFrom('Configuration', 'noticeDialog'),
          autoHideHeader: ko.observable(false).receiveFrom('Configuration', 'autoHideHeader'),
          savePulse: ko.observable().receiveFrom('Configuration', 'savePulse'),
          paneCollapsed: ko.observable().receiveFrom('Configuration', 'paneCollapsed'),
          saveSession: ko.observable().receiveFrom('Configuration', 'saveSession'),
          visible: ko.observable().receiveFrom('Configuration', 'visible')
        };
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

        this.pulse = this.config.savePulse;
        this.helpVisible = this.config.helpDialog;

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
          return this.config.autoHideHeader() ? 'checked' : 'unchecked';
        }, this);

        this.paneState = ko.computed(function() {
          return this.config.paneCollapsed() ? 'checked' : 'unchecked';
        }, this);

        this.transitionState = ko.computed(function() {
          return this.config.transitionsEnabled() ? 'checked' : 'unchecked';
        }, this);

        this.saveSessionState = ko.computed(function() {
          return this.config.saveSession() === true ? 'partial' : 'unchecked';
        }, this);

        this.togglePane = function() {
          this.config.paneCollapsed( !this.config.paneCollapsed() );
        };

        this.toggleTransitions = function() {
          this.config.transitionsEnabled( !this.config.transitionsEnabled() );
        };

        this.toggleConfiguration = function() {
          this.config.visible( !this.config.visible() );
        }.bind( this );

        this.toggleSaveSession = function() {
          this.config.saveSession( !this.config.saveSession() );
        }.bind( this );

        this.toggleAutoHideHeader = function() {
          if( this.config.autoHideHeader() === true ) {
            this.headerClosed(false);
          } else if( this.pastHeaderClosePoint() ) {
            this.headerClosed(true);
          }
          this.config.autoHideHeader( !this.config.autoHideHeader() );
        };

        this.reset = function() {
          Configuration.publish('reset');
        }.bind( this );

        return this;
      }
    });
  }
);