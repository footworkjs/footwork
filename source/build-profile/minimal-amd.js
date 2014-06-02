(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('underscore'), require('knockout'));
  } else {
    root.ko = factory(_, ko);
  }
}(this, function (_, ko) {
  //import("../../deps/apollo.js");

  function getModules() {
    var module = undefined;
    var exports = undefined;
    var define = undefined;
    var modules = {
      _: _,
      ko: ko,
      Apollo: Apollo
    };

    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(modules);

    (function() {
      //import("../../bower_components/conduitjs/lib/conduit.js");
    }).call(modules);

    (function() {
      //import("../../bower_components/postal.js/lib/postal.js");
    }).call(modules);

    return modules;
  }

  var modules = getModules();

  return (function (_, ko, riveter, postal) {
    //import("../footwork.js");
  })(modules._, modules.ko, modules.riveter, modules.postal);
}));