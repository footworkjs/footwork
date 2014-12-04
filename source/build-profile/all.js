(function (root, factory) {
  /**
   * Knockout does some funky wrapping, this build uses a custom version which removes the wrappings.
   * Also have to give it normal access to the window object, otherwise strange things happen with
   * _some_ bindings (ie: strange behavior I could not track a cause to, fixed by 'brute force').
   */
  var koExports = {};
  //import("../../bower_components/knockoutjs-nowrapper/dist/knockout.js");
  var ko = koExports;

  if (typeof define === 'function' && define.amd) {
    define('knockout', [], function() { return ko; });
    define(['knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(ko);
  } else {
    root.fw = factory(ko);
  }
}(this, function (ko) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    //import("helpers/root-masks.js");
    //import("helpers/bind-poly.js");
    root.ko = ko;

    (function() {
      //import("../../bower_components/lodash/dist/lodash.underscore.js");
    }).call(root);

    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    (function() {
      //import("../../bower_components/postal.js/lib/postal.js");
    }).call(root);

    (function(window) {
      //import("../../bower_components/history.js/scripts/bundled-uncompressed/html4+html5/native.history.js");
    }).call(root, windowObject);

    if(typeof root.postal.preserve === 'undefined') {
      (function() {
        //import("../../bower_components/postal.preserve/lib/postal.preserve.js");
      }).call(root);
    }

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ '_', 'ko', 'riveter', 'postal' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter) {
      //import("../main.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter );
  })();
}));