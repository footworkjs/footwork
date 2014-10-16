define([ "footwork" ],
  function( fw ) {
    return fw.viewModel({
      namespace: 'Contributors',
      initialize: function() {
        this.contributors = footworkBuild.contributors;
      }
    });
  }
);