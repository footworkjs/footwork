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
    var modules = {
      _: _,
      ko: ko,
      Apollo: Apollo
    }, extract;
    
    var module = undefined,
        exports = undefined,
        define = undefined;

    extract = function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }
    extract.call(modules);

    extract = function() {
      //import("../../bower_components/conduitjs/lib/conduit.js");
    }
    extract.call(modules);

    extract = function() {
      //import("../../bower_components/postal.js/lib/postal.js");
    }
    extract.call(modules);

    return modules;
  }

  console.log('modules', getModules());

  //import("../footwork.js");
}));