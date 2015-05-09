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
  // must initialize require context (https://github.com/jrburke/requirejs/issues/1305#issuecomment-87924865)
  isFunction(require) && require([]);

  assessHistoryState();
  targetElement = targetElement || windowObject.document.body;
  originalApplyBindings({}, targetElement);
};

each(runPostInit, function(runTask) {
  runTask();
});
