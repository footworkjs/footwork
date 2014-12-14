define([ "jquery", "lodash", "footwork" ],
  function( $, _, fw ) {
    var viewPortIsMobile = fw.observable().receiveFrom('ViewPort', 'isMobile');

    var Entry = fw.viewModel({
      namespace: 'PaneElements',
      initialize: function(entryData) {
        this.headerContentHeight = fw.observable().receiveFrom('Header', 'contentHeight');
        this.visible = fw.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed').extend({ debounce: { timeout: 200, when: function(collapsed) { return collapsed === false; } } });
        this.labelText = fw.observable( entryData.label );
        this.url = fw.observable( entryData.url );
        this.options = entryData || {};
        this.subMenuItems = entryData.subMenu;
        this.hasSubMenu = _.isArray(entryData.subMenu) && !!entryData.subMenu.length;
        this.target = entryData.target;
        this.menuActive = fw.observable(false);
        this.$globalNamespace.subscribe('clear', _.bind(function() {
          this.menuActive(false);
        }, this));

        this.stopPropagation = function(viewModel, event) {
          if(event.which !== 2) {
            event.preventDefault();
            event.stopPropagation();
            return false;
          }
          return true;
        };

        this.clickHandler = function(event, url) {
          var routeToURL = false;
          var $target = $(event.target);
          var stopHere = false;

          if( this.hasSubMenu && !viewPortIsMobile() ) {
            this.menuActive(!this.menuActive());
            stopHere = true;
          } else {
            if(!viewPortIsMobile() || !this.paneCollapsed()) {
              routeToURL = true;
            }
            if( !fw.isFullURL(url) && event.which !== 2 ) {
              stopHere = true;
            } else if(event.which === 2) {
              routeToURL = false;
            }
            this.$namespace.publish('collapseSubMenu');
          }

          if(stopHere) {
            event.preventDefault();
            event.stopPropagation();
          }
          return routeToURL;
        };

        this.$namespace.subscribe('collapseSubMenu', function() {
          this.menuActive(false);
        }).context(this);

        this.$namespace.subscribe('hideAll', function() {
          this.visible(false);
        }).context(this);

        this.visible(false);
      }
    });

    return fw.viewModel({
      namespace: 'NavMenu',
      initialize: function(params) {
        this.visible = fw.observable(false);
        this.paneWidth = fw.observable().receiveFrom('Pane', 'width');
        this.currentSelection = fw.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = fw.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });
        this.headerContentHeight = fw.observable().receiveFrom('Header', 'contentHeight');
        this.configVisible = fw.observable().receiveFrom('Configuration', 'visible');
        this.paneCollapsed = fw.observable().receiveFrom('Configuration', 'paneCollapsed');
        this.inHeader = !!params.inHeader;

        this.toggleConfigView = function() {
          this.configVisible( !this.configVisible() );
          if( this.configVisible() && this.paneCollapsed() ) {
            this.paneCollapsed(false);
          }
        }.bind( this );

        this.mobileWidth = fw.computed(function() {
          return (parseInt(this.paneWidth(), 10) - 20) + 'px';
        }, this);
        this.visible = fw.observable(false);
        this.entries = fw.observableArray([
          new Entry({ label: 'API Docs', url: '/api', subMenu: [
            new Entry({ label: 'viewModel', url: '/api/viewModel' }),
            new Entry({ label: 'Components', url: '/api/components' }),
            new Entry({ label: 'Namespacing', url: '/api/namespacing' }),
            new Entry({ label: 'Broadcastable / Receivable', url: '/api/broadcastable-receivable' }),
            new Entry({ label: 'Routing', url: '/api/routing' })
          ] }),
          new Entry({ label: 'Tutorials', url: '/tutorials' }),
          new Entry({ label: 'Annotated Source', url: '/annotated' })
        ]);

        this.checkSelection = function(newSelection) {
          newSelection = newSelection || this.currentSelection();
          this.visible( newSelection === this.getNamespaceName() );
        };
        this.currentSelection.subscribe(this.checkSelection, this);
        
        this.checkSelection();
      }
    });
  }
);