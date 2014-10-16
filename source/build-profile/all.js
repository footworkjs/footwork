(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.fw = factory();
  }
}(this, function () {
  var windowObject = window;
  
  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    //import("helpers/root-masks.js");

    (function() {
      //import("../../bower_components/lodash/dist/lodash.underscore.js");
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

    if(typeof root.postal.preserve === 'undefined') {
      (function() {
        //import("../../bower_components/postal.preserve/lib/postal.preserve.js");
      }).call(root);
    }

    /**
     * Knockout needs to know about requirejs if present, and also double wraps their module so we can't lie about
     * the root object to it. For those reasons we embed it here.
     */
    //import("../../bower_components/knockoutjs/dist/knockout.js");
    root.ko = ko; // ick...

    // list of dependencies to export from the library as .embed properties
    var embeddedDependencies = [ '_', 'ko', 'riveter', 'Conduit', 'postal' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter) {
      //import("../main.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter );
  })();
}));