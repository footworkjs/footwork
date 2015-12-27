define(['footwork'], function(fw) {
  return fw.viewModel.create({
    initialize: function() {
      window.AMDViewModelRegexpWasLoaded = true;
    }
  });
});
