// framework/main.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

// initialize base objects which are not present in knockout
fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};
fw.outlets = {};

var noComponentSelected = '_noComponentSelected';
var hasHTML5History;
var assessHistoryState;
var originalApplyBindings;

var runPostInit = [];
var nativeComponents = [];
var specialTagDescriptors = [];

// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  assessHistoryState();
  targetElement = targetElement || windowObject.document.body;
  originalApplyBindings({}, targetElement);
};

//import("utility.js");
//import("namespace/module.js");
//import("resource/module.js");
//import("broadcastable-receivable/module.js");
//import("model/module.js");
//import("router/module.js");
//import("component/module.js");
//import("specialTags/module.js");

runPostInit.forEach(Function.prototype.call, Function.prototype.call);
