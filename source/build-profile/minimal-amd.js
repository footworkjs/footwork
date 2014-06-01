(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('knockout'));
  } else {
    root.ko = factory(_, ko);
  }
}(this, function (_, ko) {
  //import("../../bower_components/riveter/lib/riveter.js");
  //import("../../bower_components/conduitjs/lib/conduit.js");
  //import("../../bower_components/postal.js/lib/postal.js");

  //import("../footwork.js");
}));