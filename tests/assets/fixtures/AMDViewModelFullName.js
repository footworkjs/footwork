define(['footwork'], function(fw) {
  return fw.viewModel.create({
    initialize: function() {
      window.AMDViewModelFullNameWasLoaded = true;
    }
  });
});
