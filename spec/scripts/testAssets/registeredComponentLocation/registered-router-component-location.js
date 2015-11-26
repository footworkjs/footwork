define(['footwork'], function(fw) {
  return fw.router.create({
    initialize: function() {
      window.registeredComponentLocationLoaded = true;
    }
  });
});
