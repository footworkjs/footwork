define(['footwork'], function(fw) {
  return fw.dataModel.create({
    initialize: function() {
      window.registeredComponentLocationLoaded = true;
    }
  });
});
