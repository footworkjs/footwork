var fw = ko;
//import("../build-profile/helpers/lodash-extract.js");

//import("init.js");
//import("utility.js");

//import("namespace/module.js");
//import("broadcastable-receivable/module.js");
//import("entities/module.js");
//import("resource/module.js");
//import("component/module.js");
//import("collection/module.js");

// 'start' up the framework at the targetElement (or document.body by default)
fw.start = function(targetElement) {
  targetElement = targetElement || windowObject.document.body;
  fw.applyBindings({}, targetElement);
};

each(runPostInit, function(runTask) {
  runTask();
});
