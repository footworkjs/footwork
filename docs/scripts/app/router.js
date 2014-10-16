define([ "jquery", "footwork", "lodash" ],
  function( $, fw, _ ) {
    var $pageNamespace = fw.namespace('Page');
    var $pageSectionNamespace = fw.namespace('PageSection');
    var $paneElementsNamespace = fw.namespace('PaneElements');
    var scrollPosition = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
    var maxScrollResetPosition = fw.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
    var pageLoading = fw.observable().broadcastAs({ name: 'pageLoading', namespace: 'mainRouter' });
    var viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');

    function initPage(metaData) {
      $pageNamespace.publish( 'initMeta', metaData );
    }

    function getPageLoadPromise() {
      var pagePromise = $.Deferred();
      pageLoading(true);
      pagePromise.done(function(metaData) {
        var maxScrollResetPos = maxScrollResetPosition();
        if( metaData.length ) {
          metaData = JSON.parse(metaData);
          initPage(metaData);
        }

        if( viewPortLayoutMode() !== 'mobile' ) {
          $paneElementsNamespace.publish('hideAll');
        }
        if( scrollPosition() > maxScrollResetPos ) {
          window.scrollTo( 0, maxScrollResetPos );
        }

        if( location.hash.length ) {
          $pageSectionNamespace.publish( 'scrollToSection', location.hash.slice( location.hash.indexOf('#') + 1 ) );
        }

        pageLoading(false);
      });

      $pageNamespace.publish('loadingPage', pagePromise);
      return pagePromise;
    }

    function resolvePage(pageLoadPromise) {
      pageLoadPromise.resolve( $('#metaData').text() );
    }

    return {
      relativeToParent: false,
      routes: [
        {
          route: '/',
          title: 'footworkjs',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'index-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/annotated',
          title: 'footworkjs - Annotated Source',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'annotated-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/blog',
          title: 'blog - staticty.pe',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'blog-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code',
          title: 'Code Page',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'code-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code/floaties.js',
          title: 'floaties.js - staticty.pe',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'floaties-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code/stylesheet.js',
          title: 'stylesheet.js - staticty.pe',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'stylesheet-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code/proximity.js',
          title: 'proximity.js - staticty.pe',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'proximity-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }
      ],
      unknownRoute: function($routeParams) {
        this.$outlet('mainContent', 'not-found-page', _.bind(resolvePage, this, getPageLoadPromise()));
      }
    };
  }
);
