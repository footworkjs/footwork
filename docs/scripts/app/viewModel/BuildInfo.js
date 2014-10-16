define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'BuildInfo',
      initialize: function() {
        _.extend(this, window.footworkBuild);
      }
    });
  }
);