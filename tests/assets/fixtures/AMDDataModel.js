define(['footwork'], function(fw) {
  return fw.dataModel.create({
    namespace: 'AMDDataModel',
    initialize: registerEntity('AMDDataModel', function() {
      console.log('AMDDataModel registered');
    })
  });
});
