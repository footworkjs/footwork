(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'));
  } else {
    root.fw = factory(root._, root.ko);
  }
}(this, function (_, ko) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    //import("helpers/root-masks.js");
    //import("helpers/bind-poly.js");

    _.extend(root, {
      _: _,
      ko: ko
    });

    (function() {
      //import("../../bower_components/reqwest/reqwest.js");
    }).call(root);

    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    (function() {
      //import("../../bower_components/postal.js/lib/postal.js");
    }).call(root);

    if(root._.isUndefined(root.postal.preserve)) {
      (function() {
        //import("../../bower_components/postal.preserve/lib/postal.preserve.js");
      }).call(root);
    }

    (function(window) {
      //import("../../bower_components/console-polyfill/index.js");
    }).call(root, windowObject);

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ 'riveter', 'postal', 'reqwest' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, reqwest) {
      var ajax = reqwest.compat;
      //import("../footwork.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.reqwest );
  })();
}));
