define([ "jquery", "lodash", "footwork", "LoadState" ],
  function( $, _, fw, LoadState ) {
    return fw.viewModel({
      namespace: 'Navigation',
      initialize: function() {
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.configVisible = fw.observable().receiveFrom('Configuration', 'visible');
        this.headerMaxHeight = fw.observable().receiveFrom('Configuration', 'headerMaxHeight');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.transitionsEnabled = fw.observable().receiveFrom('Configuration', 'transitionsEnabled');
        this.defaultHeaderMaxHeight = fw.observable().receiveFrom('Configuration', 'defaultHeaderMaxHeight');
        this.configReflowing = fw.observable().receiveFrom('Configuration', 'reflowing');
        this.headerFixed = fw.observable().receiveFrom('Header', 'fixed');
        this.headerContentHeight = fw.computed(function() {
          return (parseInt( this.headerContentHeight(), 10 ) - 1 + 'px');
        }, { headerContentHeight: fw.observable().receiveFrom('Header', 'contentHeight') });
        this.toggleButtonMinHeight = fw.observable().receiveFrom('Header', 'sourceLinkVisibleMinHeight');
        this.sourceLinkVisible = fw.observable().receiveFrom('Header', 'sourceLinkVisible');
        this.loadBarTopPos = fw.observable(0).receiveFrom('Header', 'visibleHeight');
        this.headerMoving = fw.observable(false).receiveFrom('Header', 'moving');
        this.offsetMargin = fw.observable().receiveFrom('Pane', 'columnWidth');
        this.paneAnimate3d = fw.observable().receiveFrom('Pane', 'animate3d');
        this.paneMoving = fw.observable().receiveFrom('Pane', 'moving');
        this.overlapPane = fw.observable().receiveFrom('Body', 'overlapPane');
        this.pageLoading = fw.observable().receiveFrom('mainRouter', 'pageLoading');
        this.reflowing = fw.observable(false).broadcastAs('reflowing');
        this.headerOpen = fw.observable(false);

        this.loader = new LoadState({ ignoreStatus: 404 });

        this.$globalNamespace.subscribe('configReset', function() {
          this.headerOpen(false);
        }).context(this);

        var pageNamespace = fw.namespace('Page');
        pageNamespace.subscribe('loadingPage', function(promise) {
          this.loader.watch( promise, (this.viewPortLayoutMode() === 'mobile' ? 400 : 300), function() {
            this.$globalNamespace.publish( 'refreshDocSize' );
          }.bind(this)).fail(function(xhr) {
            if(xhr.status === 404) {
              this.loader.setState('ready');
            }
          }.bind(this));
        }).context(this);

        this.toggleHeader = function() {
          if( ( (this.paneAnimate3d() === true && this.paneMoving() === true) ||
               this.configReflowing() === true || this.headerMoving() === true ) === false ) {
            this.headerOpen( !this.headerOpen() );
          }
        }.bind(this);

        this.$namespace.subscribe('toggleHeader', function() {
          this.toggleHeader();
        }.bind(this));

        this.dropHidden = fw.computed(function() {
          return this.overlapPane() && this.paneCollapsed() === false;
        }, this);
        
        this.headerDropVisible = fw.computed(function() {
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

        this.arrowIcon = fw.computed(function() {
          return this.headerOpen() && 'icon-arrow-up' || 'icon-arrow-down';
        }, this);

        this.dropInfoText = fw.computed(function() {
          if( this.headerOpen() ) {
            return 'Click to <strong>collapse</strong> the header. <span class="shortcut">ctrl + x</span>';
          }
          return 'Click to <strong>expand</strong> the header. <span class="shortcut">ctrl + x</span>';
        }, this);
      }
    });
  }
);