// framework/namespace/entityMixins.js
// ----------------

// mixin provided to viewModels which enables namespace capabilities including pub/sub, cqrs, etc
entityMixins.push({
  runBeforeInit: true,
  _preInit: function( options ) {
    var $configParams = this.__private('configParams');
    var mainNamespace = $configParams.namespace || $configParams.name || uniqueId('namespace');
    this.$namespace = enterNamespaceName( indexedNamespaceName(mainNamespace, $configParams.autoIncrement) );
    this.$rootNamespace = fw.namespace(mainNamespace);
    this.$globalNamespace = fw.namespace();
  },
  mixin: {
    getNamespaceName: function() {
      return this.$namespace.getName();
    }
  },
  _postInit: function( options ) {
    exitNamespace();
  }
});
