define([ "jquery", "lodash", "footwork" ],
  function( $, _, fw ) {
    return fw.viewModel({
      namespace: 'Page',
      initialize: function() {
        this.$pageSections = fw.namespace('PageSections');
        this.defaultTitle = fw.observable('staticty.pe');
        this.transitionsEnabled = fw.observable(false).receiveFrom('ViewPort', 'transitionsEnabled');
        this.scrollPosition = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.maxScrollResetPosition = fw.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
        this.viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');

        this.shortTitle = fw.observable().broadcastAs('shortTitle', true);
        this.baseURL = fw.observable().broadcastAs('baseURL');
        this.hashURL = fw.observable().broadcastAs('hashURL', true);

        this.loadPageMeta = function( metaData ) {
          if( !_.isUndefined(metaData) ) {
            this.$pageSections.publish( 'pageMetaData', metaData );
            pageMetaData = metaData;
            this.shortTitle(metaData.title);
          }
        }.bind(this);

        this.$namespace.subscribe( 'initMeta', function( metaData ) {
          this.loadPageMeta( metaData );
        }).context( this );

        var pageMetaData;
        this.$namespace.request.handler('metaData', function() {
          return pageMetaData;
        });
      }
    });
  }
);