(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['lodash', 'knockout'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('lodash'), require('knockout'));
  } else {
    root.ko = factory(_, ko);
  }
}(this, function (_, ko) {
  //import("helpers/root-masks.js");
  _.extend(root, { _: _, ko: ko });

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

  return (function footwork(_, ko, postal, Apollo, riveter) {
    //import("../main.js");
    return ko;
  })(root._, root.ko, root.postal, root.Apollo, root.riveter);
}));