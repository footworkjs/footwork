define(['footwork'], function(fw) {
  return function() {
    registerFootworkEntity(fw.viewModel.boot(this, {
      namespace: 'registered-regexp-component-location'
    }));
  };
});
