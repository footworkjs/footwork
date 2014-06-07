(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ko = factory();
  }
}(this, function () {
  var modules = (function getModules() {
    // define our own root object to supply to the modules as an attachment point
    var root = {};

    // supply our root for modules that directly check for the window object (lodash does this)
    var window = root;

    // hide node.js or browserified from the modules (CommonJS environment)
    var module = undefined,
        exports = undefined,
        global = undefined;

    // hide requirejs from the modules (AMD environment)
    var define = undefined;

    (function() {
      //import("../../bower_components/apollo/dist/apollo.js");
    }).call(root);

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

    /**
     * Knockout double-wraps their module so we can't lie about the window/root object to it.
     * As a result we just let knockout (ko) bind to (ahem, pollute) the window object directly (unforunately).
     * I am unsure of the workaround for this. Pull requests encouraged!
     */
    //import("../../bower_components/knockoutjs/dist/knockout.js");
    root.ko = ko; // ick...

    return root;
  }());

  return (function (_, ko, riveter, postal, Apollo) {
    //import("../main.js");
  })(modules._, modules.ko, modules.riveter, modules.postal, modules.Apollo);
}));