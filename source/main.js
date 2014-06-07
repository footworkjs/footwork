ko._footworkVersion = 'FOOTWORK_VERSION';

var applyBindings = ko.applyBindings;
ko.applyBindings = function(model, element) {
  applyBindings(model, element);
  if(typeof model.startup === 'function' && model._options !== undefined) {
    if(model._options.startup !== false) {
      model.startup();
    }
    if(typeof model._modelOptions.afterBinding === 'function') {
      model._modelOptions.afterBinding.call(model);
    }
  }
};

//import("model-namespace.js");
//import("broadcast-receive.js");
//import("bindingHandlers.js");
//import("extenders.js");