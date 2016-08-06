define(['footwork'], function(fw) {
  return fw.router.create({
    namespace: 'defaultRouter',
    initialize: registerFootworkEntity
  });
});
