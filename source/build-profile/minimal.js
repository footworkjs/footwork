(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'));
  } else {
    root.ko = factory(_, ko);
  }
}(this, function (_, ko) {
  var modules = (function getModules() {
    // define our own root object to supply to the modules as an attachment point
    var root = {
      _: _,
      ko: ko
    };

    // supply our root for modules that directly check for the window object
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
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    (function() {
      //import("../../bower_components/conduitjs/lib/conduit.js");
    }).call(root);

    (function() {
      //import("../../bower_components/postal.js/lib/postal.js");
    }).call(root);

    return root;
  }());

  return (function (_, ko, riveter, postal, Apollo) {
    //import("../main.js");
    return ko;
  })(modules._, modules.ko, modules.riveter, modules.postal, modules.Apollo);
}));