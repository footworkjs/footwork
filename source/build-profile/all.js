(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ko = factory();
  }
}(this, function () {
  //import("helpers/root-for-loaders.js");
  (function() {
    //import("../../bower_components/lodash/dist/lodash.underscore.js");
  }).call(root);

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

  /**
   * Knockout double-wraps their module so we can't lie about the window/root object to it.
   * As a result we just let knockout (ko) bind to (ahem, pollute) the window object directly (unforunately).
   * I am unsure of the workaround for this. Pull requests encouraged!
   */
  //import("../../bower_components/knockoutjs/dist/knockout.js");
  root.ko = ko; // ick...

  return (function footwork(_, ko, postal, Apollo, riveter) {
    //import("../main.js");
    return ko;
  })(root._, root.ko, root.postal, root.Apollo, root.riveter);
}));