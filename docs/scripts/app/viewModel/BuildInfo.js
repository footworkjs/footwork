define([ "footwork", "lodash" ],
  function( ko, _ ) {
    return ko.viewModel({
      namespace: 'BuildInfo',
      initialize: function() {
        _.extend(this, window.footworkBuild);
      }
    });
  }
);