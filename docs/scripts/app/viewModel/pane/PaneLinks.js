define([ "footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'PaneLinks',
      initialize: function(params) {
        var paneElementsNamespace = ko.namespace('PaneElements');

        this.linksMinWidth = ko.observable().receiveFrom('Configuration', 'linksMinWidth');
        this.linksMaxWidth = ko.observable().receiveFrom('Configuration', 'linksMaxWidth');
        this.paneAccentPadding = ko.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.logoWidth = ko.observable(161).receiveFrom('ViewPort', 'logoWidth');
        this.pageHasSections = ko.observable().receiveFrom('PageSections', 'hasSections');
        this.headerContentHeight = ko.observable().receiveFrom('Header', 'contentHeight');
        this.narrowPane = ko.observable().receiveFrom('Pane', 'narrow');
        this.columnWidth = ko.observable(null);
        if(params.inHeader === true) {
          this.columnWidth = ko.observable().receiveFrom('Pane', 'columnWidth');
        }

        this.height = ko.computed(function() {
          if(params.inHeader === true) {
            return this.headerContentHeight();
          }
          return null;
        }, this);

        this.defaultSelection = ko.computed(function() {
          if( this.viewPortLayoutMode() === 'mobile' ) {
            return 'MainMenu';
          }
          return 'PageSections';
        }, this).broadcastAs('defaultSelection');

        this.currentSelection = ko.observable( this.defaultSelection() ).broadcastAs('currentSelection', true);
        this.$namespace.request.handler('currentSelection', function() {
          return this.currentSelection();
        });

        this.width = ko.computed(function() {
          var width = parseInt( this.columnWidth(), 10) - this.paneAccentPadding();
          var linksMinWidth = this.linksMinWidth();
          var linksMaxWidth = this.linksMaxWidth();
          width = ( width >= linksMinWidth ? width : linksMinWidth );
          width = ( width <= linksMaxWidth ? width : linksMaxWidth );

          return width + 'px';
        }, this);

        this.headerWidth = ko.computed(function() {
          if(params.inHeader === true) {
            var linksMaxWidth = this.linksMaxWidth();
            var width = (parseInt( this.columnWidth(), 10) - this.logoWidth()) - (this.paneAccentPadding() * 2);
            width = ( width < linksMaxWidth ? width : linksMaxWidth );
            return width + 'px';
          }
          return null;
        }, this);

        this.chooseSection = function( model, event ) {
          this.currentSelection( event.target.getAttribute('data-section') || this.defaultSelection() );
          paneElementsNamespace.publish('hideAll');
        }.bind( this );
      }
    });
  }
);