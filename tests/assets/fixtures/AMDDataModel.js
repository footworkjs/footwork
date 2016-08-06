define(['footwork'], function(fw) {
  return fw.dataModel.create({
    namespace: 'AMDDataModel',
    initialize: registerFootworkEntity()
  });
});
