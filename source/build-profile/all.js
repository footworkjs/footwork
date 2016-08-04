(function (root, factory) {
  /**
   * Knockout uses a non-standard UMD wrapping that makes it impossible (I think) to embed it like the
   * other dependencies, the -all build uses a forked version which removes the wrappings.
   *
   * Also have to give it normal access to the window object, otherwise strange things happen with
   * _some_ bindings. (ie: strange behavior I could not track a cause to, fixed here by 'brute force')
   */
  var koExports = {};
  var amdRequire;
  //import("../../bower_components/knockoutjs-nowrapper/dist/knockout.js");

  if (typeof define === 'function' && define.amd) {
    amdRequire = require;
    define('knockout', [], function() { return koExports; });
    define(['knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(koExports);
  } else {
    root.fw = factory(koExports);
  }
}(this, function (ko) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    //import("tools/root-masks.js");
    root.ko = ko;

    //import("../../build/lodash-custom.js");

    (function() {
      //import("../../bower_components/reqwest/reqwest.js");
    }).call(root);

    (function() {
      //import("../../bower_components/D.js/lib/D.js");
    }).call(root);

    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    (function() {
      //import("../../bower_components/conduitjs/lib/conduit.js");
    }).call(root);

    (function() {
      //import("../../bower_components/postal.js/lib/postal.js");
    }).call(root);

    if(root._.isUndefined(root.postal.preserve)) {
      (function() {
        //import("../../bower_components/postal.preserve/lib/postal.preserve.js");
      }).call(root);
    }

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ '_', 'ko', 'riveter', 'postal', 'reqwest', 'Conduit', 'D' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, reqwest, Conduit, D) {
      var ajax = reqwest.compat;
      var Deferred = D;
      //import("../../build/footwork-core.js");
      return fw;
    })(root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.reqwest, root.Conduit, root.D);
  })();
}));
