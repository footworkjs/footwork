define(['footwork'], function(fw) {
  return fw.viewModel.create({
    initialize: function() {
      console.log('defaultComponentLocationLoaded');
      window.defaultComponentLocationLoaded = true;
    }
  });
});
