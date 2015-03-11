//import("init.js");
//import("utility.js");

//import("namespace/module.js");
//import("resource/module.js");
//import("broadcastable-receivable/module.js");
//import("model/module.js");
//import("router/module.js");
//import("component/module.js");
//import("specialTags/module.js");

// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  assessHistoryState();
  targetElement = targetElement || windowObject.document.body;
  originalApplyBindings({}, targetElement);
};

each(runPostInit, function(runTask) {
  runTask();
});
