(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ko = factory();
  }
}(this, function () {
  //import("../../bower_components/knockoutjs/dist/knockout.js");
  //import("../../bower_components/lodash/dist/lodash.underscore.js");
  //import("../../bower_components/riveter/lib/riveter.js");
  //import("../../bower_components/conduitjs/lib/conduit.js");
  //import("../../bower_components/postal.js/lib/postal.js");

  //import("../footwork.js");
}));