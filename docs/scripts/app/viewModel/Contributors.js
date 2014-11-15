define([ "footwork", "lodash" ],
  function( fw, _ ) {
    return fw.viewModel({
      namespace: 'Contributors',
      initialize: function() {
        this.contributors = _.map(footworkBuild.contributors, function(contributor) {
          contributor.contribution = (_.isArray(contributor.contribution) ? contributor.contribution.join(', ') : contributor.contribution);
          return contributor;
        });
      }
    });
  }
);