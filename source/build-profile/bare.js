(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal', 'Q', 'delegate', 'Apollo'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'), require('Q'), require('delegate'), require('Apollo'));
  } else {
    root.ko = factory(_, ko, postal, Q, delegate, Apollo);
  }
}(this, function (_, ko, postal, Q, delegate, Apollo) {
  var definedModules = [ '_', 'ko', 'postal', 'Q', 'delegate', 'Apollo' ];
  var windowObject = window;
  
  return (function() {
    //import("helpers/root-masks.js");
    _.extend(root, {
      _: _,
      ko: ko,
      postal: postal,
      delegate: delegate,
      Apollo: Apollo,
      Q: Q
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

    return (function footwork(embedded, _, ko, postal, Apollo, riveter, delegate, Q) {
      //import("../main.js");
      return ko;
    })( root._.pick(root, embeddedDependencies), root._, root.ko, root.postal, root.Apollo, root.riveter, root.delegate, root.Q );
  })();
}));