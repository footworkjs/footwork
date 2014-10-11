define([ "jquery", "lodash", "footwork", "LoadState" ],
  function( $, _, ko, LoadState ) {
    return ko.viewModel({
      namespace: 'Navigation',
      initialize: function() {
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.configVisible = ko.observable().receiveFrom('Configuration', 'visible');
        this.headerMaxHeight = ko.observable().receiveFrom('Configuration', 'headerMaxHeight');
        this.paneCollapsed = ko.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.transitionsEnabled = ko.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.defaultHeaderMaxHeight = ko.observable().receiveFrom('Configuration', 'defaultHeaderMaxHeight');
        this.configReflowing = ko.observable().receiveFrom('Configuration', 'reflowing');
        this.headerFixed = ko.observable().receiveFrom('Header', 'fixed');
        this.headerContentHeight = ko.computed(function() {
          return (parseInt( this.headerContentHeight(), 10 ) - 1 + 'px');
        }, { headerContentHeight: ko.observable().receiveFrom('Header', 'contentHeight') });
        this.toggleButtonMinHeight = ko.observable().receiveFrom('Header', 'sourceLinkVisibleMinHeight');
        this.sourceLinkVisible = ko.observable().receiveFrom('Header', 'sourceLinkVisible');
        this.loadBarTopPos = ko.observable(0).receiveFrom('Header', 'visibleHeight');
        this.headerMoving = ko.observable(false).receiveFrom('Header', 'moving');
        this.offsetMargin = ko.observable().receiveFrom('Pane', 'columnWidth');
        this.paneAnimate3d = ko.observable().receiveFrom('Pane', 'animate3d');
        this.paneMoving = ko.observable().receiveFrom('Pane', 'moving');
        this.overlapPane = ko.observable().receiveFrom('Body', 'overlapPane');
        this.pageLoading = ko.observable().receiveFrom('mainRouter', 'pageLoading');
        this.reflowing = ko.observable(false).broadcastAs('reflowing');
        this.headerOpen = ko.observable(false);

        this.loader = new LoadState({ ignoreStatus: 404 });

        this.$globalNamespace.subscribe('configReset', function() {
          this.headerOpen(false);
        }).withContext(this);

        var pageNamespace = ko.namespace('Page');
        pageNamespace.subscribe('loadingPage', function(promise) {
          this.loader.watch( promise, (this.viewPortLayoutMode() === 'mobile' ? 400 : 300), function() {
            this.$globalNamespace.publish( 'refreshDocSize' );
          }.bind(this)).fail(function(xhr) {
            if(xhr.status === 404) {
              this.loader.setState('ready');
            }
          }.bind(this));
        }).withContext(this);

        this.toggleConfigView = function() {
          this.configVisible( !this.configVisible() );
          if( this.configVisible() && this.paneCollapsed() ) {
            this.paneCollapsed(false);
          }
        }.bind( this );

        this.toggleHeader = function() {
          if( ( (this.paneAnimate3d() === true && this.paneMoving() === true) ||
               this.configReflowing() === true || this.headerMoving() === true ) === false ) {
            this.headerOpen( !this.headerOpen() );
          }
        }.bind(this);

        this.$namespace.subscribe('toggleHeader', function() {
          this.toggleHeader();
        }.bind(this));

        this.dropHidden = ko.computed(function() {
          return this.overlapPane() && this.paneCollapsed() === false;
        }, this);
        
        this.headerDropVisible = ko.computed(function() {
          if( (this.headerFixed() === true && this.reflowing() === false) || (this.overlapPane() && this.paneCollapsed() === false) ) {
            return false;
          }
          return this.sourceLinkVisible() === false || this.headerOpen();
        }, this);

        this.headerOpen.subscribe(function( headerOpenState ) {
          var minHeight = this.toggleButtonMinHeight();
          var duration = ( this.transitionsEnabled() ? 1000 : 0 );
          var startHeight, endHeight;

          if( this._headerAnimation ) {
            this._oldHeaderHeight = this.defaultHeaderMaxHeight();
            this._headerAnimation.stop();
          }

          this.reflowing(true);
          if( headerOpenState ) {
            this._oldHeaderHeight = this.headerMaxHeight();
            startHeight = this._oldHeaderHeight;
            endHeight = minHeight;
          } else {
            startHeight = this.headerMaxHeight();
            endHeight = this._oldHeaderHeight;
          }

          this._headerAnimation = $({ height: startHeight }).animate({
            height: endHeight
          }, {
            duration: duration,
            specialEasing: {
              height: "easeOutElastic"
            },
            step: function(height) {
              this.headerMaxHeight(height);
            }.bind(this),
            complete: function() {
              this.reflowing(false);
            }.bind(this)
          });
        }.bind(this));

        this.arrowIcon = ko.computed(function() {
          return this.headerOpen() && 'icon-arrow-up' || 'icon-arrow-down';
        }, this);

        this.dropInfoText = ko.computed(function() {
          if( this.headerOpen() ) {
            return 'Click to <strong>collapse</strong> the header. <span class="shortcut">ctrl + x</span>';
          }
          return 'Click to <strong>expand</strong> the header. <span class="shortcut">ctrl + x</span>';
        }, this);
      }
    });
  }
);