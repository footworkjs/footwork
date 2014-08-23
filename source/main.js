// main.js
// -----------

// Record the footwork version as of this build.
ko._footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
ko.embed = embedded;

// misc regex patterns
var hasTrailingSlash = /\/$/i;
var endsInDotJS = /\.js$/;

// misc utility functions
var noop = function() { };

var isObservable = ko.isObservable;

var isPath = function(pathOrLocation) {
  return hasTrailingSlash.test(pathOrLocation) === true;
};

var isFunction = _.isFunction;
var isObject = _.isObject;
var isString = _.isString;
var isBoolean = _.isBoolean;
var isNumber = _.isNumber;
var isUndefined = _.isUndefined;
var isArray = _.isArray;
var isNull = _.isNull;

// Registry which stores the mixins that are automatically added to each viewModel
var viewModelMixins = [];

// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors / problems only
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(1);

//import("namespace.js");
//import("broadcast-receive.js");
//import("router.js");
//import("viewModel.js");
//import("resource.js");
//import("component.js");
//import("extenders.js");