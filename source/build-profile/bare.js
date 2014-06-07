(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'));
  } else {
    root.ko = factory(_, ko, postal);
  }
}(this, function (_, ko, postal) {
  var modules = (function getModules() {
    // define our own root object to supply to the modules as an attachment point
    var root = {
      _: _,
      ko: ko,
      postal: postal
    };

    // supply our root for modules that directly check for the window object
    var window = root;

    // hide node.js or browserified from the modules (CommonJS environment)
    var module = undefined,
        exports = undefined,
        global = undefined;

    // hide requirejs from the modules (AMD environment)
    var define = undefined;

    /**
     * apollo is considered unlikely to be an independent dependency and so is embedded
     * in the 'bare' build.
     */
    (function() {
      //import("../../bower_components/apollo/dist/apollo.js");
    }).call(root);

    /**
     * riveter.js is included in the 'bare' build because it requires 'underscore', while
     * postal requires lodash. Lodash is the preferred, and riveter is the smaller source
     * so we manually inject _ for riveter by embedding it as a dependency and supplying
     * lodash. Also, riveter is considered unlikely to be an independent dependency.
     */
    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    return root;
  }());

  return (function (_, ko, riveter, postal, Apollo) {
    //import("../main.js");
    return ko;
  })(modules._, modules.ko, modules.riveter, modules.postal, modules.Apollo);
}));