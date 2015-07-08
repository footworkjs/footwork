//import("utility.js");
//import("sync.js");
//import("mapTo.js");
//import("DataModel.js");

runPostInit.push(function(runTask) {
  fw.ajax = ajax;
  extend(fw.settings, {
    emulateHTTP: false,
    emulateJSON: false
  });
});
