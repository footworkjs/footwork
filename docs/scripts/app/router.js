define([ "jquery", "footwork", "lodash" ],
  function( $, ko, _ ) {
    var $pageNamespace = ko.namespace('Page');
    var $pageSectionNamespace = ko.namespace('PageSection');
    var $paneElementsNamespace = ko.namespace('PaneElements');
    var scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
    var maxScrollResetPosition = ko.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
    var pageLoading = ko.observable().broadcastAs({ name: 'pageLoading', namespace: 'mainRouter' });
    var viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
    var isInitialRun = true;

    function initPage(metaData) {
      $pageNamespace.publish( 'initMeta', metaData );
    }

    function getPageLoadPromise() {
      var pagePromise = $.Deferred();
      pageLoading(true);
      var pageLoadingComplete = _.debounce(function() { pageLoading(false) }, 200);
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
          title: 'Index Page',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'index-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/about',
          title: 'about - staticty.pe',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'about-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/blog',
          title: 'blog - staticty.pe',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'blog-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code',
          title: 'Code Page',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'code-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code/floaties.js',
          title: 'floaties.js - staticty.pe',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'floaties-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code/stylesheet.js',
          title: 'stylesheet.js - staticty.pe',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'stylesheet-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/code/proximity.js',
          title: 'proximity.js - staticty.pe',
          controller: function($routeParams) {
            pageLoading(true);
            this.$outlet('mainContent', 'proximity-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }
      ],
      unknownRoute: function($routeParams) {
        if(isInitialRun && this.$globalNamespace.request('isRunningLocally')) {
          isInitialRun = false;
          this.setState('/');
        } else {
          pageLoading(true);
          this.$outlet('mainContent', 'not-found-page', _.bind(resolvePage, this, getPageLoadPromise()));
        }
      }
    };
  }
);
