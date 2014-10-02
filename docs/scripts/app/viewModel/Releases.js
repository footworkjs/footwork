define([ "jquery", "lodash", "footwork" ],
  function( $, _, ko ) {
    var releaseAddressPostfix = '-docs.footworkjs.com';
    var startsWithNumber = RegExp('^[0-9]+');
    var isRunningLocally = ko.namespace().request('isRunningLocally');

    return ko.viewModel({
      namespace: 'Releases',
      initialize: function() {
        this.thisRelease = ('v' + window.footworkBuild.version);
        this.headerContentHeight = ko.observable().receiveFrom('Header', 'contentHeight');
        this.releaseList = ko.observableArray(['latest']);
        this.releases = ko.computed(function() {
          return _.reduce(this.releaseList(), function(releaseList, release) {
            releaseList.push({
              version: (startsWithNumber.test(release) ? 'v' : '') + release,
              href: 'http://' + release + releaseAddressPostfix
            });
            return releaseList;
          }, []);
        }, this);

        if( !isRunningLocally ) {
          $.get('/release/listAll').done(function(releaseList) {
            this.releaseList(releaseList);
          }.bind(this));
        }
      }
    });
  }
);