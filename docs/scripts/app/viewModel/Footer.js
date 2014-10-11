define([ "footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'Footer',
      initialize: function() {
        this.viewPortDim = ko.observable().receiveFrom('ViewPort', 'dimensions');
        this.bottomScrollPosition = ko.observable().receiveFrom('ViewPort', 'bottomScrollPosition');
        this.headerClosed = ko.observable().receiveFrom('Header', 'closed');
        this.columnWidth = ko.observable(0).receiveFrom('Pane', 'columnWidth');
        this.bodyHeight = ko.observable(0).receiveFrom('Body', 'height');
        this.viewPortIsMobile = ko.observable().receiveFrom('Configuration', 'isMobile');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.viewPortNoTransitions = ko.observable().receiveFrom('ViewPort', 'noTransitions');
        this.paneCollapsed = ko.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.paneShouldBeCollapsed = ko.observable(false).receiveFrom('Pane', 'shouldBeCollapsed');
        this.paneDefaultSelection = ko.observable().receiveFrom('PaneLinks', 'defaultSelection');
        this.paneCurrentSelection = ko.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.forceMobileLayout = ko.observable(0).receiveFrom('ViewPort', 'forceMobileLayout');

        this.height = ko.observable(70).broadcastAs('height');
        this.visibleHeight = ko.computed(function() {
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
              this.paneCurrentSelection( 'MainMenu' );
              this.viewPortIsMobile(true);
              this.paneCollapsed(true);
            } else {
              if( this.viewPortLayoutMode() === 'mobile' && (this.paneCurrentSelection() === 'MainMenu' || _.isUndefined(this.paneCurrentSelection()) ) ) {
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