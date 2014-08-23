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
var isObservable = ko.isObservable;
var isPath = function(pathOrLocation) {
  return pathOrLocation.match(/\/$/i) !== null;
};


// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors / problems only
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(1);

// Preserve the original applyBindings method for later use
var originalApplyBindings = ko.applyBindings;

// Override the original applyBindings method to provide and enable 'viewModel' life-cycle hooks/events.
var doNotSetContextOnRouter = false;
var setContextOnRouter = true;
var applyBindings = ko.applyBindings = function(viewModel, element, shouldSetContext) {
  originalApplyBindings(viewModel, element);
  shouldSetContext = _.isUndefined(shouldSetContext) === true ? setContextOnRouter : shouldSetContext;

  if( isViewModel(viewModel) === true ) {
    var $configParams = viewModel.__getConfigParams();
    
    if( _.isFunction($configParams.afterBinding) === true ) {
      $configParams.afterBinding.call(viewModel, element);
    }

    if( shouldSetContext === setContextOnRouter && isRouter( viewModel.$router ) === true ) {
      viewModel.$router.context( ko.contextFor(element) );
    }
    
    if( _.isUndefined(element) === false ) {
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        viewModel.__shutdown();
      });
    }
  }
};

// This stores the mixins which are automatically added to each viewModel
var viewModelMixins = [];

//import("namespace.js");
//import("broadcast-receive.js");
//import("router.js");
//import("viewModel.js");
//import("resource.js");
//import("component.js");
//import("bindingHandlers.js");
//import("extenders.js");