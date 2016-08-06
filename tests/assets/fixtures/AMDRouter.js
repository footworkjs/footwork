define(['footwork'], function(fw) {
  return fw.router.create({
    namespace: 'AMDRouter',
    initialize: registerFootworkEntity
  });
});
