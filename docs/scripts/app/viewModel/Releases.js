define([ "jquery", "lodash", "footwork" ],
  function( $, _, fw ) {
    var protocol = 'http://';
    var host = 'footworkjs.com';
    var releaseAddressPostfix = '-docs.' + host;
    var startsWithNumber = RegExp('^[0-9]+');
    var isRunningLocally = true;

    fw.observable(false).receiveFrom('Configuration', 'initialized').subscribe(function(isInitialized) {
      if(isInitialized) {
        isRunningLocally = fw.namespace().request('isRunningLocally');

        if(!isRunningLocally) {
          host = window.location.hostname.match('(.+)-docs\.([0-9a-zA-Z\-\.]+)')[2];
          releaseAddressPostfix = '-docs.' + host;
        }
      }
    });

    return fw.viewModel({
      namespace: 'Releases',
      initialize: function() {
        this.menuActive = fw.observable(false);
        this.thisRelease = ('v' + window.footworkBuild.version);
        this.headerContentHeight = fw.observable().receiveFrom('Header', 'contentHeight');
        this.releaseList = fw.observableArray(['latest']);
        this.myURL = fw.observable(protocol + window.footworkBuild.version + releaseAddressPostfix);
        this.releases = fw.computed(function() {
          return _.reduce(this.releaseList(), function(releaseList, release) {
            releaseList.push({
              version: (startsWithNumber.test(release) ? 'v' : '') + release,
              href: protocol + release + releaseAddressPostfix,
              myRelease: release === window.footworkBuild.version
            });
            return releaseList;
          }, []);
        }, this);

        this.toggleMenu = function(viewModel, event) {
          this.menuActive(!this.menuActive());
          event.stopPropagation();
          var $parent = $(event.currentTarget).parent();
          if( !$parent.hasClass('aside') && !$parent.hasClass('drop-down') ) {
            return true;
          }
        };
        this.$globalNamespace.subscribe('clear', _.bind(function() {
          this.menuActive(false);
        }, this));

        if( !isRunningLocally ) {
          $.get('/release/listAll').done(function(releaseList) {
            this.releaseList(releaseList);
          }.bind(this));
        }
      }
    });
  }
);