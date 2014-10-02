define([ "jquery", "lodash", "footwork" ],
  function( $, _, ko ) {
    var protocol = 'http://';
    var host = 'footworkjs.com';
    var releaseAddressPostfix = '-docs.' + host;
    var startsWithNumber = RegExp('^[0-9]+');
    var isRunningLocally = true;

    ko.observable(false).receiveFrom('Configuration', 'initialized').subscribe(function(isInitialized) {
      if(isInitialized) {
        isRunningLocally = ko.namespace().request('isRunningLocally');

        if(!isRunningLocally) {
          host = window.location.hostname.match('(.+)-docs\.([0-9a-zA-Z\-\.]+)')[2];
          releaseAddressPostfix = '-docs.' + host;
        }
      }
    });

    return ko.viewModel({
      namespace: 'Releases',
      initialize: function() {
        this.thisRelease = ('v' + window.footworkBuild.version);
        this.headerContentHeight = ko.observable().receiveFrom('Header', 'contentHeight');
        this.releaseList = ko.observableArray(['latest']);
        this.myURL = ko.observable(protocol + window.footworkBuild.version + releaseAddressPostfix);
        this.releases = ko.computed(function() {
          return _.reduce(this.releaseList(), function(releaseList, release) {
            releaseList.push({
              version: (startsWithNumber.test(release) ? 'v' : '') + release,
              href: protocol + release + releaseAddressPostfix,
              myRelease: release === window.footworkBuild.version
            });
            return releaseList;
          }, []);
        }, this);

        if( !isRunningLocally ) {
          $.get((isRunningLocally ? ('http://latest-docs.' + host) : '') + '/release/listAll').done(function(releaseList) {
            this.releaseList(releaseList);
          }.bind(this));
        }
      }
    });
  }
);