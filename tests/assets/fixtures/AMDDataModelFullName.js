define(['footwork'], function(fw) {
  return function() {
    registerFootworkEntity(fw.dataModel.boot(this, {
      namespace: 'AMDDataModelFullName'
    }));
  };
});
