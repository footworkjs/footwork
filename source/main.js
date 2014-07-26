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

// misc utility functions
var noop = function() { };

var isPath = function(pathOrLocation) {
  return pathOrLocation.match(/\/$/i) !== null;
};

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
var originalApplyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'model' life-cycle hooks/events.
var applyBindings = ko.applyBindings = function(model, element) {
  originalApplyBindings(model, element);

  if(isViewModel(model) === true) {
    var $configParams = model.__getConfigParams();
    if(typeof $configParams.afterBinding === 'function') {
      $configParams.afterBinding.call(model);
    }
  }
};

// This stores the mixins which are automatically added to each viewModel
var viewModelMixins = [];

//import("namespace.js");
//import("viewModel.js");
//import("resource.js");
//import("component.js");
//import("broadcast-receive.js");
//import("bindingHandlers.js");
//import("extenders.js");
//import("router.js");