define([ "jquery", "lodash", "knockout-footwork" ],
  function( $, _, ko ) {
    var Entry = ko.model({
      namespace: 'PaneElements',
      initialize: function(entryData) {
        this.visible = ko.observable( null ).extend({ autoEnable: _.random( 200, 600 ) });
        this.labelText = ko.observable( entryData.label );
        this.url = ko.observable( entryData.url );

        this.namespace.subscribe('hideAll', function() {
          this.visible( false );
        }).withContext(this);

        this.visible( false );
      }
    });

    return ko.model({
      namespace: 'MainMenu',
      initialize: function() {
        this.paneWidth = ko.observable().receiveFrom('Pane', 'width');
        this.currentSelection = ko.observable().receiveFrom('PaneLinks', 'currentSelection');
        this.paneContentMaxHeight = ko.observable().receiveFrom('Pane', 'contentMaxHeight').extend({ units: 'px' });

        this.mobileWidth = ko.computed(function() {
          return (parseInt(this.paneWidth(), 10) - 20) + 'px';
        }, this);
        this.visible = ko.observable(false);
        this.entries = ko.observableArray([
          new Entry({ label: 'code()', url: '/code' }),
          new Entry({ label: 'blog', url: '/blog' }),
          new Entry({ label: 'about', url: '/about' }),
        ]);

        this.visible = ko.computed(function() {
          return this.currentSelection() === this.getNamespaceName();
        }, this);
      }
    });
  }
);