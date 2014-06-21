(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'));
  } else {
    root.ko = factory(_, ko, postal);
  }
}(this, function (_, ko, postal) {
  var windowObject = window;
  
  return (function() {
    //import("helpers/root-masks.js");
    _.extend(root, { _: _, ko: ko, postal: postal });

    (function() {
      //import("../../bower_components/apollo/dist/apollo.js");
    }).call(root);

    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    (function() {
      var window = windowObject;
      //import("../../bower_components/history.js/scripts/uncompressed/history.js");
    })();

    return (function footwork(_, ko, postal, Apollo, riveter) {
      //import("../main.js");
      return ko;
    })(root._, root.ko, root.postal, root.Apollo, root.riveter);
  })();
}));