define(['footwork'], function(fw) {
  return fw.component({
    viewModel: fw.viewModel.create({
      namespace: 'registered-combined-component-location',
      initialize: registerFootworkEntity
    }),
    template: '<div></div>'
  });
});
