define([ "jquery", "footwork" ],
  function( $, ko ) {
    return ko.viewModel({
      namespace: 'Releases',
      initialize: function() {
        this.thisRelease = window.footworkBuild.version;
        this.releases = ko.observableArray();

        $.get('/release/listAll').done(function(releaseList) {
          this.releases(releaseList);
        }.bind(this));
      }
    });
  }
);