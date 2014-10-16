define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'Footer',
      initialize: function() {
        this.viewPortDim = fw.observable().receiveFrom('ViewPort', 'dimensions');
        this.bottomScrollPosition = fw.observable().receiveFrom('ViewPort', 'bottomScrollPosition');
        this.headerClosed = fw.observable().receiveFrom('Header', 'closed');
        this.columnWidth = fw.observable(0).receiveFrom('Pane', 'columnWidth');
        this.bodyHeight = fw.observable(0).receiveFrom('Body', 'height');
        this.viewPortIsMobile = fw.observable().receiveFrom('Configuration', 'isMobile');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortNoTransitions = fw.observable().receiveFrom('ViewPort', 'noTransitions');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.paneShouldBeCollapsed = fw.observable(false).receiveFrom('Pane', 'shouldBeCollapsed');
        this.paneDefaultSelection = fw.observable().receiveFrom('PaneLinks', 'defaultSelection');
        this.paneCurrentSelection = fw.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.forceMobileLayout = fw.observable(0).receiveFrom('ViewPort', 'forceMobileLayout');

        this.height = fw.observable(70).broadcastAs('height');
        this.visibleHeight = fw.computed(function() {
          var viewPortDim = this.viewPortDim();
          var bodyHeight = this.bodyHeight();
          var bottomScrollPosition = this.bottomScrollPosition();

          if( !_.isUndefined(viewPortDim) && !_.isUndefined(bottomScrollPosition) &&
              bottomScrollPosition >= bodyHeight - this.height() ) {
            return bottomScrollPosition - (bodyHeight - this.height());
          }

          return 0;
        }, this).broadcastAs('visibleHeight');

        this.setMode = function( viewModel, event ) {
          if(!this.forceMobileLayout()) {
            this.viewPortNoTransitions(true);
            var newMode = event.target.getAttribute('data-mode');
            if( newMode === 'mobile' ) {
              this.paneCurrentSelection( 'NavMenu' );
              this.viewPortIsMobile(true);
              this.paneCollapsed(true);
            } else {
              if( this.viewPortLayoutMode() === 'mobile' && (this.paneCurrentSelection() === 'NavMenu' || _.isUndefined(this.paneCurrentSelection()) ) ) {
                this.paneCurrentSelection( 'PageSections' );
              }
              this.paneCollapsed( this.paneShouldBeCollapsed() );
              this.viewPortIsMobile(false);
              this.headerClosed(false);
            }

            this._modeChanging && clearTimeout( this._modeChanging );
            this._modeChanging = setTimeout(function() {
              this.viewPortNoTransitions(false);
            }.bind(this), 50);
          }
        };
      }
    });
  }
);