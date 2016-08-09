(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('jquery'));
  } else {
    root.fw = factory(root._, root.ko, root.postal, root.jQuery);
  }
}(this, function (_, ko, postal, jQuery) {
  var windowObject = window;

  window.require = typeof require !== 'undefined' ? require : undefined;
  window.define = typeof define !== 'undefined' ? define : undefined;

  return (function() {
    //import("tools/root-masks.js");

    _.extend(root, {
      _: _,
      ko: ko,
      postal: postal,
      jQuery: jQuery
    });

    /* istanbul ignore next */
    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    /* istanbul ignore next */
    (function() {
      //import("../../bower_components/conduitjs/lib/conduit.js");
    }).call(root);

    var embeddedDependencies = [ 'riveter', 'Conduit' ];

    return (function footwork(embedded, windowObject, _, ko, postal, riveter, jQuery, Conduit) {
      var ajax = jQuery.ajax;
      var Deferred = jQuery.Deferred;
      //import("../../build/footwork-core.js");
      return fw;
    })(root._.pick(root, embeddedDependencies), windowObject, root._, root.ko, root.postal, root.riveter, root.jQuery, root.Conduit);
  })();
}));
