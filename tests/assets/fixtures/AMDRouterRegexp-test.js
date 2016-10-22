define(['footwork'], function(fw) {
  return function() {
    registerFootworkEntity(fw.router.boot(this, {
      namespace: 'AMDRouterRegexp-test'
    }));
  };
});
