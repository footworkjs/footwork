define(['footwork'], function(fw) {
  return fw.component({
    viewModel: function() {
      registerFootworkEntity(fw.viewModel.boot(this, {
        namespace: 'registered-combined-component-location'
      }));
    },
    template: '<div></div>'
  });
});
