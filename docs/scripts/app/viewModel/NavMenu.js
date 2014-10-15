define([ "jquery", "lodash", "footwork" ],
  function( $, _, ko ) {
    var Entry = ko.viewModel({
      namespace: 'PaneElements',
      initialize: function(entryData) {
        this.headerContentHeight = ko.observable().receiveFrom('Header', 'contentHeight');
        this.visible = ko.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.labelText = ko.observable( entryData.label );
        this.url = ko.observable( entryData.url );
        this.options = entryData;
        this.subMenuItems = entryData.subMenu;
        this.hasSubMenu = _.isArray(entryData.subMenu) && !!entryData.subMenu.length;
        this.target = entryData.target;

        this.$namespace.subscribe('hideAll', function() {
          this.visible( false );
        }).withContext(this);

        this.visible( false );
      }
    });

    return ko.viewModel({
      namespace: 'NavMenu',
      initialize: function() {
        this.visible = ko.observable(false);
        this.paneWidth = ko.observable().receiveFrom('Pane', 'width');
        this.currentSelection = ko.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });
        this.headerContentHeight = ko.observable().receiveFrom('Header', 'contentHeight');
        this.configVisible = ko.observable().receiveFrom('Configuration', 'visible');
        this.paneCollapsed = ko.observable().receiveFrom('Configuration', 'paneCollapsed');

        this.toggleConfigView = function() {
          this.configVisible( !this.configVisible() );
          if( this.configVisible() && this.paneCollapsed() ) {
            this.paneCollapsed(false);
          }
        }.bind( this );

        this.mobileWidth = ko.computed(function() {
          return (parseInt(this.paneWidth(), 10) - 20) + 'px';
        }, this);
        this.visible = ko.observable(false);
        this.entries = ko.observableArray([
          new Entry({ label: 'API Docs', url: '/api', subMenu: [
            new Entry({ label: 'viewModel', url: '/api/viewModel' }),
            new Entry({ label: 'Namespace', url: '/api/namespace' }),
            new Entry({ label: 'Components', url: '/api/component' }),
            new Entry({ label: 'Broadcastable / Receivable', url: '/api/broadcast-receive' }),
            new Entry({ label: 'Routing', url: '/api/routing' }),
          ] }),
          new Entry({ label: 'Tutorial', url: '/tutorial' }),
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