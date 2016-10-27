define(['footwork'], function(fw) {
  return {
    viewModel: function() {
      registerFootworkEntity(fw.viewModel.boot(this, {
        namespace: 'registered-combined-component-location'
      }));
    },
    template: '<div></div>'
  };
});
