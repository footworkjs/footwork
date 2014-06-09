// main.js
// -----------

// Bindings, initialization, and life-cycle management.

// Record the footwork version as of this build.
ko._footworkVersion = 'FOOTWORK_VERSION';

// Preserve the original applyBindings method for later use
var applyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'model' life-cycle hooks/events.
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