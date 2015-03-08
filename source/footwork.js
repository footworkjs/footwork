// main.js
// -----------

// Map ko to the variable 'fw' internally to make it clear this is the 'footwork' flavored version of knockout we are dealing with.
// Footwork will also map itself to 'fw' on the global object when no script loader is used.
var fw = ko;

//import("misc/utility.js");
//import("misc/lodashExtract.js");
//import("misc/core-init.js");
//import("namespace/module.js");
//import("resource/module.js");
//import("broadcastable-receivable/module.js");
//import("router/module.js");
//import("model/module.js");
//import("component/module.js");
//import("component/builtIn.js");
//import("misc/extenders.js");
//import("misc/specialTags.js");

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

// 'start' up footwork at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  assessHistoryState();
  targetElement = targetElement || windowObject.document.body;
  originalApplyBindings({}, targetElement);
};
