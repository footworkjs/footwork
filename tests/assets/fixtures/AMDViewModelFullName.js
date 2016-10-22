define(['footwork'], function(fw) {
  return function() {
    registerFootworkEntity(fw.viewModel.boot(this, {
      namespace: 'AMDViewModelFullName'
    }));
  };
});
