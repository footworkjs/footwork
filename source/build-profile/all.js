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

  /**
   * Knockout needs to know about requirejs if present, and also double wraps their module so we can't lie about
   * the root object to it. For those reasons we embed it out here.
   */
  //import("../../bower_components/knockoutjs/dist/knockout.js");

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
      //import("../../bower_components/reqwest/reqwest.js");
    }).call(root);

    root.ko = ko; // ick...

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ '_', 'ko', 'Apollo', 'riveter', 'Conduit', 'postal', 'matches', 'delegate', 'reqwest' ];

    return (function footwork(embedded, _, ko, postal, Apollo, riveter, delegate, reqwest) {
      //import("../main.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.reqwest );
  })();
}));