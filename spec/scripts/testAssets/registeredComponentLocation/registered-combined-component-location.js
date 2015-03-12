define(['footwork'], function(fw) {
  return fw.component({
    viewModel: fw.viewModel({
      initialize: function() {
        window.registeredComponentLocationLoaded = true;
      }
    }),
    template: '<div>combined component</div>'
  });
});
