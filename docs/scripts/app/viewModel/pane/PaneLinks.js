define([ "footwork", "lodash", "jquery" ],
  function( fw, _, $ ) {
    return fw.viewModel({
      namespace: 'PaneLinks',
      initialize: function(params) {
        var paneElementsNamespace = fw.namespace('PaneElements');

        this.linksMinWidth = fw.observable().receiveFrom('Configuration', 'linksMinWidth');
        this.linksMaxWidth = fw.observable().receiveFrom('Configuration', 'linksMaxWidth');
        this.paneAccentPadding = fw.observable().receiveFrom('Configuration', 'paneAccentPadding');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
        this.logoWidth = fw.observable(161).receiveFrom('ViewPort', 'logoWidth');
        this.pageHasSections = fw.observable().receiveFrom('PageSections', 'hasSections');
        this.headerContentHeight = fw.observable().receiveFrom('Header', 'contentHeight');
        this.narrowPane = fw.observable().receiveFrom('Pane', 'narrow');
        this.columnWidth = fw.observable(null);
        this.inHeader = fw.observable(params.inHeader);
        if(params.inHeader === true) {
          this.columnWidth = fw.observable().receiveFrom('Pane', 'columnWidth');
        }

        this.height = fw.computed(function() {
          if(params.inHeader === true) {
            return this.headerContentHeight();
          }
          return null;
        }, this);

        this.defaultSelection = fw.computed(function() {
          if( this.viewPortLayoutMode() === 'mobile' ) {
            return 'NavMenu';
          }
          return 'PageSections';
        }, this).broadcastAs('defaultSelection');

        this.currentSelection = fw.observable( this.defaultSelection() ).broadcastAs('currentSelection', true);
        this.$namespace.request.handler('currentSelection', function() {
          return this.currentSelection();
        });

        this.width = fw.computed(function() {
          var width = parseInt( this.columnWidth(), 10) - this.paneAccentPadding();
          var linksMinWidth = this.linksMinWidth();
          var linksMaxWidth = this.linksMaxWidth();
          width = ( width >= linksMinWidth ? width : linksMinWidth );
          width = ( width <= linksMaxWidth ? width : linksMaxWidth );

          return width + 'px';
        }, this);

        this.headerWidth = fw.computed(function() {
          if(params.inHeader === true) {
            return parseInt( this.columnWidth(), 10) - this.logoWidth() - (this.paneAccentPadding() * 2) + 'px';
          }
          return null;
        }, this);

        this.chooseSection = function( model, event ) {
          var target = event.target.getAttribute('data-section');
          if( _.isNull(target) ) {
            target = $(event.target).parents('[data-section]')[0].getAttribute('data-section');
          }
          this.currentSelection( target || this.defaultSelection() );
          paneElementsNamespace.publish('hideAll');
        }.bind( this );
      }
    });
  }
);