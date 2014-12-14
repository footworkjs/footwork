define([ "jquery", "footwork", "lodash", "highlight", "jquery.collapsible", "history" ],
  function( $, fw, _ ) {
    var $pageNamespace = fw.namespace('Page');
    var $pageSectionsNamespace = fw.namespace('PageSections');
    var $pageSectionNamespace = fw.namespace('PageSection');
    var $pageSubSectionNamespace = fw.namespace('PageSubSection');
    var $paneElementsNamespace = fw.namespace('PaneElements');
    var scrollPosition = fw.observable().receiveFrom('ViewPort', 'scrollPosition');
    var maxScrollResetPosition = fw.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
    var pageLoading = fw.observable().broadcastAs({ name: 'pageLoading', namespace: 'mainRouter' });
    var viewPortLayoutMode = fw.observable().receiveFrom('ViewPort', 'layoutMode');
    var currentPageSection = fw.observable().receiveFrom('PageSections', 'currentSection');
    var initialLoad = fw.observable().receiveFrom('ViewPort', 'initialLoad');
    var firstLoad = true;

    fw.routers.html5History(true);

    function initPage(metaData) {
      $pageNamespace.publish( 'initMeta', metaData );
    }

    History.Adapter.bind(window, 'popstate', function() {
      $pageSectionNamespace.trigger('resetURL');
      $pageSubSectionNamespace.trigger('resetURL');
    });

    function getPageLoadPromise() {
      var pagePromise = $.Deferred();
      pageLoading(true);
      pagePromise.done(function(metaData, article) {
        var maxScrollResetPos = maxScrollResetPosition();
        var $article = $(article);

        if( metaData.length ) {
          metaData = JSON.parse(metaData);
          initPage(metaData);
        }

        if( viewPortLayoutMode() !== 'mobile' ) {
          $paneElementsNamespace.publish('hideAll');
        }
        if( scrollPosition() > maxScrollResetPos && !firstLoad ) {
          window.scrollTo( 0, maxScrollResetPos );
        } else {
          firstLoad = false;
        }

        var $collapsible = $article.find('.collapsible');
        if( $collapsible.length ) {
          $collapsible.collapsible();
        }

        $article.find('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });

        if(window.location.hash.length) {
          $pageSectionsNamespace.command('goToSection', window.location.hash.substring(1));
        }
        pageLoading(false);
        initialLoad(false);
      });

      $pageNamespace.publish('loadingPage', pagePromise);
      return pagePromise;
    }

    function resolvePage(pageLoadPromise, element) {
      pageLoadPromise.resolve( $('#metaData').text(), element.children[0] );
    }

    return {
      relativeToParent: false,
      routes: [
        {
          route: '/',
          title: 'footwork.js',
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
          route: '/api',
          title: 'footworkjs',
          controller: function($routeParams) {
            console.info('/api route');
            this.$outlet('mainContent', 'api-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/api/viewModel',
          title: 'footworkjs - viewModel',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'api-viewModel-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/api/namespacing',
          title: 'footworkjs - Namespacing',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'api-namespacing-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/api/components',
          title: 'footworkjs - Components',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'api-components-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/api/broadcastable-receivable',
          title: 'footworkjs - Broadcastable / Receivable',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'api-broadcastable-receivable-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/api/routing',
          title: 'footworkjs - Routing',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'api-routing-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/tutorials',
          title: 'footworkjs - Tutorials',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'tutorials-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }, {
          route: '/tutorials/TodoMVC',
          title: 'footworkjs - Tutorials - TodoMVC',
          controller: function($routeParams) {
            this.$outlet('mainContent', 'todomvc-tutorial-page', _.bind(resolvePage, this, getPageLoadPromise()));
          }
        }
      ],
      unknownRoute: {
        title: '404 not found',
        controller: function($routeParams) {
          this.$outlet('mainContent', 'not-found-page', _.bind(resolvePage, this, getPageLoadPromise()));
        }
      }
    };
  }
);
