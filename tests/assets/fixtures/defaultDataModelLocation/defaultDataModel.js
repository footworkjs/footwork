define(['footwork'], function(fw) {
  return fw.dataModel.create({
    namespace: 'defaultDataModel',
    initialize: registerFootworkEntity()
  });
});
