(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'q', 'delegate', 'Apollo', 'Qajax'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('q'), require('delegate'), require('Apollo'), require('Qajax'));
  } else {
    root.ko = factory(_, ko, postal, Q, delegate, Apollo, Qajax);
  }
}(this, function (_, ko, postal, Q, delegate, Apollo, Qajax) {
  var windowObject = window;
  
  return (function() {
    //import("helpers/root-masks.js");
    _.extend(root, {
      _: _,
      ko: ko,
      postal: postal,
      delegate: delegate,
      Apollo: Apollo,
      Q: Q,
      Qajax: Qajax
    });

    /**
     * Riveter still embedded in 'bare' build as it is problematic when used as a module compared to the other dependencies. It depends on
     * underscore as opposed to lodash...meaning both lodash and underscore would be required if lodash was not substituted for underscore
     * in riveter.
     */
    (function() {
      //import("../../bower_components/riveter/lib/riveter.js");
    }).call(root);

    // list of dependencies to 'export' inside the library as .embed properties
    var embeddedDependencies = [ 'riveter' ];

    return (function footwork(embedded, _, ko, postal, Apollo, riveter, delegate, Q, Qajax) {
      //import("../main.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.Q, root.Qajax );
  })();
}));