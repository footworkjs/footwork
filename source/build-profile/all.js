(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ko = factory();
  }
}(this, function () {
  var windowObject = window;

  // Cross-browser console log() function
  // http://patik.github.io/console.log-wrapper/
  //import("../../bower_components/consolelog/consolelog.js");

  return (function() {
    //import("helpers/root-masks.js");

    (function() {
      //import("../../bower_components/lodash/dist/lodash.underscore.js");
    }).call(root);

    (function() {
      //import("../../bower_components/apollo/dist/apollo.js");
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

    (function(window) {
      //import("../../bower_components/history.js/scripts/bundled-uncompressed/html4+html5/native.history.js");
    }).call(root, windowObject);

    (function() {
      //import("../../bower_components/matches.js/matches.js");
    }).call(root);

    (function() {
      //import("../../bower_components/delegate.js/delegate.js");
    }).call(root);

    (function() {
      //import("../../bower_components/qajax/src/qajax.js");
    }).call(root);

    /**
     * Q.js doesn't have a proper UMD wrapper and doesn't reference 'this' as global (so we can't lie to it).
     * Unfortunately that means polluting the actual global object.
     */
    //import("../../bower_components/q/q.js");
    root.Q = Q; // ick...

    /**
     * Knockout double-wraps their module so we can't lie about the window/root object to it. As a result
     * knockout pollutes the global object.
     */
    //import("../../bower_components/knockoutjs/dist/knockout.js");
    root.ko = ko; // ick...

    // list of dependencies to 'export' inside the library as .embed properties
    var embeddedDependencies = [ '_', 'Apollo', 'riveter', 'Conduit', 'postal', 'matches', 'delegate', 'Qajax' ];

    return (function footwork(embedded, _, ko, postal, Apollo, riveter, delegate, Q, Qajax) {
      //import("../main.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.Q, root.Qajax );
  })();
}));