define([ "jquery", "lodash", "footwork", "history" ],
  function( $, _, ko ) {
    return ko.viewModel({
      namespace: 'Page',
      afterInit: function() {
        if( location.hash.length ) {
          ko.namespace('PageSection').publish( 'scrollToSection', location.hash.slice( location.hash.indexOf('#') + 1 ) );
        }
      },
      initialize: function() {
        this.$pageSections = ko.namespace('PageSections');
        this.defaultTitle = ko.observable('staticty.pe');
        this.transitionsEnabled = ko.observable(false).receiveFrom('ViewPort', 'transitionsEnabled');
        this.scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.maxScrollResetPosition = ko.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');

        this.shortTitle = ko.observable().broadcastAs('shortTitle', true);
        this.baseURL = ko.observable().broadcastAs('baseURL');
        this.hashURL = ko.observable().broadcastAs('hashURL', true);

        this.loadPageMeta = function( metaData ) {
          if( !_.isUndefined(metaData) ) {
            this.$pageSections.publish( 'pageMetaData', metaData );
            pageMetaData = metaData;
            this.shortTitle(metaData.title);
          }
        }.bind(this);

        this.$namespace.subscribe( 'initMeta', function( metaData ) {
          this.loadPageMeta( metaData );
        }).withContext( this );

        var pageMetaData;
        this.$namespace.request.handler('metaData', function() {
          return pageMetaData;
        });
      }
    });
  }
);