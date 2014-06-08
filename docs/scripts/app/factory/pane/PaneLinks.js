define([ "knockout-footwork", "lodash" ],
  function( ko, _ ) {
    return ko.model({
      namespace: 'PaneLinks',
      factory: function() {
        var paneElementsNamespace = ko.namespace('PaneElements');

        this.config = {
          linksMinWidth: ko.observable().receiveFrom('Configuration', 'linksMinWidth'),
          linksMaxWidth: ko.observable().receiveFrom('Configuration', 'linksMaxWidth'),
          paneAccentPadding: ko.observable().receiveFrom('Configuration', 'paneAccentPadding')
        };
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.logoWidth = ko.observable(161).receiveFrom('ViewPort', 'logoWidth');
        this.pageHasSections = ko.observable().receiveFrom('PageSections', 'hasSections');
        this.height = ko.observable().receiveFrom('Header', 'contentHeight');
        this.narrowPane = ko.observable().receiveFrom('Pane', 'narrow');
        this.columnWidth = ko.observable().receiveFrom('Pane', 'columnWidth');

        this.defaultSelection = ko.computed(function() {
          if( this.viewPortLayoutMode() === 'mobile' ) {
            return 'MainMenu';
          }
          return 'PageSections';
        }, this).broadcastAs('defaultSelection');
        this.currentSelection = ko.observable().broadcastAs('currentSelection', true);
        this.versionLabel = '<span class="version">v' + ko._footworkVersion + '</span>';

        this.width = ko.computed(function() {
          var width = parseInt( this.columnWidth(), 10) - this.config.paneAccentPadding(),
              linksMinWidth = this.config.linksMinWidth(),
              linksMaxWidth = this.config.linksMaxWidth();
          width = ( width >= linksMinWidth ? width : linksMinWidth );
          width = ( width <= linksMaxWidth ? width : linksMaxWidth );

          return width + 'px';
        }, this);

        this.headerWidth = ko.computed(function() {
          var linksMaxWidth = this.config.linksMaxWidth(),
              paneAccentPadding = this.config.paneAccentPadding();

          var width = (parseInt( this.columnWidth(), 10) - this.logoWidth()) - (paneAccentPadding * 2);
          width = ( width < linksMaxWidth ? width : linksMaxWidth );

          return width + 'px';
        }, this);

        this.chooseSection = function( model, event ) {
          this.currentSelection( event.target.getAttribute('data-section') || this.defaultSelection() );
          paneElementsNamespace.publish('hideAll');
        }.bind( this );
      }
    });
  }
);