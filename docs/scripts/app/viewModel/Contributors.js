define([ "footwork" ],
  function( ko ) {
    return ko.viewModel({
      namespace: 'Contributors',
      initialize: function() {
        this.contributors = footworkBuild.contributors;
      }
    });
  }
);