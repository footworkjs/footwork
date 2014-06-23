// main.js
// -----------

// Record the footwork version as of this build.
ko._footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
ko.embed = embedded;

//polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

// misc utility noop function
var noop = function() { };

// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors / problems only
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(1);

// expose internal logging methods
ko.log = function() {
  if(ko.debugLevel() >= 2) {
    log.apply(null, arguments);
  }
};
ko.logError = function() {
  if(ko.debugLevel() >= 1) {
    log.apply(null, arguments);
  }
};

// Preserve the original applyBindings method for later use
var applyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'model' life-cycle hooks/events.
ko.applyBindings = function(model, element) {
  applyBindings(model, element);

  if(typeof model !== 'undefined' && typeof model.startup === 'function' && typeof model._options !== 'undefined') {
    if(model._options.startup !== false) {
      model.startup();
    }
    if(typeof model._modelOptions.afterBinding === 'function') {
      model._modelOptions.afterBinding.call(model);
    }
  }
};

//import("namespace.js");
//import("model.js");
//import("component.js");
//import("broadcast-receive.js");
//import("bindingHandlers.js");
//import("extenders.js");
//import("router.js");