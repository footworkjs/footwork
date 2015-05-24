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

// https://github.com/knockout/knockout/issues/1786#issuecomment-104353852
var originalGetBindingHandler = ko.getBindingHandler;
ko.getBindingHandler = function(bindingKey) {
  var bindingHandler = originalGetBindingHandler(bindingKey);
  if(!bindingHandler) {
    if(isObject(windowObject.console) && isFunction(windowObject.console.warn)) {
      windowObject.console.warn('Could not locate binding "' + bindingKey + '"');
    }
  } else {
    return bindingHandler;
  }
}

each(runPostInit, function(runTask) {
  runTask();
});
