define(['footwork'], function(fw) {
  return function() {
    registerFootworkEntity(fw.dataModel.boot(this, {
      namespace: 'registered-datamodel-component-location'
    }));
  };
});
