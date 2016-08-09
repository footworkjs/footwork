(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'reqwest'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('reqwest'));
  } else {
    root.fw = factory(root._, root.ko, root.postal, root.reqwest);
  }
}(this, function (_, ko, postal, reqwest) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    //import("tools/root-masks.js");

    _.extend(root, {
      _: _,
      ko: ko,
      postal: postal,
      reqwest: reqwest
    });

    /**
     * Riveter still embedded in 'bare' build as it is problematic when used as a module compared to the other dependencies. It depends on
     * underscore as opposed to lodash...meaning both lodash and underscore would be required if lodash was not substituted for underscore
     * in riveter.
     */
    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    (function() {
      //import("../../bower_components/conduitjs/lib/conduit.js");
    }).call(root);

    (function() {
      //import("../../bower_components/D.js/lib/D.js");
    }).call(root);

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ 'riveter', 'Conduit', 'D' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, reqwest, Conduit, D) {
      var ajax = reqwest.compat;
      var Deferred = D;
      //import("../../build/footwork-core.js");
      return fw;
    })(root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.reqwest, root.Conduit, root.D);
  })();
}));
