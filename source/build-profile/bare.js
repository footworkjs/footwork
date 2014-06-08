(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout', 'postal'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'), require('postal'));
  } else {
    root.ko = factory(_, ko, postal);
  }
}(this, function (_, ko, postal) {
  //import("helpers/root-masks.js");
  _.extend(root, { _: _, ko: ko, postal: postal });

  /**
   * apollo is small and considered unlikely to be an independent dependency and so is embedded
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

  return (function footwork(_, ko, postal, Apollo, riveter) {
    //import("../main.js");
    return ko;
  })(root._, root.ko, root.postal, root.Apollo, root.riveter);
}));