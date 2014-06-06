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
    // define our own root object to use
    var root = {};

    // lodash directly checks for the window object before it uses 'this' so we supply our root for that as well
    var window = root;

    // hide from node.js or browserified (CommonJS modules)
    var module = undefined,
        exports = undefined,
        global = undefined;

    // hide from requirejs (AMD modules)
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
     * Knockout double-wraps their module so we can't lie about the window object to it.
     * As a result we just let knockout (ko) bind to the window object directly (unforunately).
     * I am unsure of the workaround for this. Pull requests accepted!
     */
    //import("../../bower_components/knockoutjs/dist/knockout.js");
    root.ko = ko; // ew...

    return root;
  }());

  return (function (_, ko, riveter, postal, Apollo) {
    //import("../footwork.js");
  })(modules._, modules.ko, modules.riveter, modules.postal, modules.Apollo);
}));