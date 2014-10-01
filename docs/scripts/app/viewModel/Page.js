define([ "jquery", "lodash", "footwork", "history" ],
  function( $, _, ko ) {
    var $pageNamespace = ko.namespace('Page');
    var isRunningLocally = _.isNull(window.location.protocol.match('^http'));

    function noop() {};
    function initPage() {
      $pageNamespace.publish( 'initMeta', window._page.meta );
      ko.applyBindings((window._page.init || noop)(), document.getElementById('js-page'));
    }

    return ko.viewModel({
      namespace: 'Page',
      afterInit: function() {
        var pageSectionNamespace = ko.namespace('PageSection');

        this.url( document.URL );

        if( isRunningLocally ) {
          this.loadState('/');
        }
        
        if( location.hash.length ) {
          pageSectionNamespace.publish( 'scrollToSection', location.hash.slice( location.hash.indexOf('#') + 1 ) );
        }

        _.isObject(window._page) && initPage();
      },
      initialize: function() {
        var pageSectionsNamespace = ko.namespace('PageSections');
        var paneElementsNamespace = ko.namespace('PaneElements');
        var $mainContent = $('.js-main');
        this.$resourceNamespace = ko.namespace('Resource');

        // this.defaultTitle = ko.observable('v' + window.footworkBuild.version);

        this.transitionsEnabled = ko.observable(false).receiveFrom('ViewPort', 'transitionsEnabled');
        this.scrollPosition = ko.observable().receiveFrom('ViewPort', 'scrollPosition');
        this.maxScrollResetPosition = ko.observable().receiveFrom('ViewPort', 'maxScrollResetPosition');
        this.viewPortLayoutMode = ko.observable().receiveFrom('ViewPort', 'layoutMode');
        this.overlapPane = ko.observable().receiveFrom('Body', 'overlapPane');
        this.paneCollapsed = ko.observable().receiveFrom('Pane', 'collapsed');

        this.url = ko.observable().extend({
          write: function( target, url ) {
            var indexOfHash = url.indexOf('#');

            if( indexOfHash !== -1 ) {
              this.baseURL( url.substr( 0, indexOfHash ) );
              this.hashURL( url.substr( indexOfHash + 1 ) );
            } else {
              this.baseURL( url );
              this.hashURL('');
            }

            target( url );
          }.bind( this )
        }).broadcastAs('url');
        this.baseURL = ko.observable().broadcastAs('baseURL');
        this.hashURL = ko.observable().broadcastAs('hashURL', true);
        this.loading = ko.observable().broadcastAs('loading');

        History.Adapter.bind( window, 'statechange', this.loadState = function(state) {
          var url = ( _.isString(state) && state ) || window.location.pathname;
          this.url( url );

          window._page = undefined;
          var pagePromise = $.Deferred();
          
          if( this.$resourceNamespace.request('isPageRegistered', 'text!' + url) !== true ) {
            url = '/404';
          }

          require( ['text!' + url], function(templateContent) {
            pagePromise.resolve(templateContent);
          }, function(response) {
            pagePromise.reject(response.xhr);
          });

          pagePromise
            .done(function(response) {
              var maxScrollResetPos = this.maxScrollResetPosition();

              $mainContent.html(response);
              if( this.viewPortLayoutMode() !== 'mobile' ) {
                paneElementsNamespace.publish('hideAll');
              }
              if( this.scrollPosition() > maxScrollResetPos ) {
                window.scrollTo( 0, maxScrollResetPos );
              }

              _.isObject(window._page) && initPage();
            }.bind(this))
            .fail(function(xhr) {
              $mainContent.html(xhr.responseText);
            }.bind(this))
            .always(function() {
              this.loading(true);
              setTimeout(function() { this.loading(false); }.bind(this), 200);
            }.bind(this));

          this.$namespace.publish('loadingPage', pagePromise);
        }.bind(this));

        var pageMetaData;
        this.$namespace.request.handler('metaData', function() {
          return pageMetaData;
        });

        this.loadMeta = function( metaData ) {
          if( metaData !== undefined ) {
            pageSectionsNamespace.publish( 'loadMetaData', metaData );
            pageMetaData = metaData;
          }
        }.bind(this);

        this.loadURL = function( url, title ) {
          if( History.enabled ) {
            if( History.getState().url.split('').reverse().join('').substring( 0, url.length ) !== url.split('').reverse().join('') ) {
              // user did not click the same page, clear the current PageSections list
              pageSectionsNamespace.publish('clear');
            } else {
              this.loading(true);
              setTimeout(function() { this.loading(false); }.bind(this), 20);
            }

            if( this.overlapPane() === true && this.paneCollapsed() === false ) {
              this.paneCollapsed(true);
            }

            if( isRunningLocally ) {
              this.loadState(url);
            } else {
              History.pushState( null, title || document.title, url );
            }
          } else {
            window.location = url;
            return false;
          }

          return true;
        }.bind( this );

        this.$namespace.subscribe( 'initMeta', function( metaData ) {
          this.loadMeta( metaData );
        }).withContext( this );

        this.$namespace.subscribe( 'loadURL', function( param ) {
          this.loadURL( param.url, param.title );
        }).withContext( this );
      }
    });
  }
);