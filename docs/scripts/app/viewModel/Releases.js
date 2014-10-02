define([ "jquery", "lodash", "footwork" ],
  function( $, _, ko ) {
    return ko.viewModel({
      namespace: 'Releases',
      initialize: function() {
        this.thisRelease = ('v' + window.footworkBuild.version);
        this.headerContentHeight = ko.observable().receiveFrom('Header', 'contentHeight');
        this.releaseList = ko.observableArray();
        this.releases = ko.computed(function() {
          return _.reduce(this.releaseList(), function(releaseList, release) {
            releaseList.push({ version: release, href: 'http://' + release + '-docs.footworkjs.com' });
            return releaseList;
          }, []);
        }, this);

        $.get('/release/listAll').done(function(releaseList) {
          this.releaseList(releaseList);
        }.bind(this));
      }
    });
  }
);