// main.js
// -----------

// Record the footwork version as of this build.
ko._footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
ko.embed = embedded;

// misc regex patterns
var hasTrailingSlash = /\/$/i;

// misc utility functions
var noop = function() { };

var isObservable = ko.isObservable;

var isPath = function(pathOrLocation) {
  return hasTrailingSlash.test(pathOrLocation) === true;
};

// Pull out lodash utility function references for better minification and easier implementation swap
var isFunction = _.isFunction;
var isObject = _.isObject;
var isString = _.isString;
var isBoolean = _.isBoolean;
var isNumber = _.isNumber;
var isUndefined = _.isUndefined;
var isArray = _.isArray;
var isNull = _.isNull;
var contains = _.contains;
var extend = _.extend;
var pick = _.pick;
var each = _.each;
var filter = _.filter;
var bind = _.bind;
var invoke = _.invoke;
var clone = _.clone;
var reduce = _.reduce;
var has = _.has;
var where = _.where;
var result = _.result;
var uniqueId = _.uniqueId;
var map = _.map;
var find = _.find;
var omit = _.omit;
var indexOf = _.indexOf;
var values = _.values;
var reject = _.reject;
var findWhere = _.findWhere;

// Registry which stores the mixins that are automatically added to each viewModel
var viewModelMixins = [];

// Initialize the debugLevel observable, this controls
// what level of debug statements are logged to the console
// 0 === off
// 1 === errors / problems only
// 2 === notices (very noisy)
ko.debugLevel = ko.observable(1);

//import("namespace.js");

var $globalNamespace = makeNamespace();

//import("broadcast-receive.js");
//import("router.js");
//import("viewModel.js");
//import("component.js");
//import("resource.js");
//import("extenders.js");