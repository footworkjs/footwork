define(['footwork'], function(fw) {
  return fw.component({
    viewModel: fw.viewModel.create({
      initialize: function() {
        window.registeredComponentLocationLoaded = true;
      }
    }),
    template: '<div>combined component</div>'
  });
});
