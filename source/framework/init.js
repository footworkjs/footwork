// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

fw.viewModel = {};
fw.dataModel = {};
fw.router = {};
fw.outlet = {};
fw.settings = {};

var runPostInit = [];
var internalComponents = [];
var entityDescriptors = [];
var entityMixins = [];

var entityClass = 'fw-entity';
var entityAnimateClass = 'fw-entity-animate';
var minimumAnimationDelay = 20;
var defaultAnimationSequenceInterval = 20;
var isEntityCtor;
var isEntity;
var isDataModel;
var isDataModelCtor;
var isRouter;
var activeOutlets = fw.observableArray();
var DefaultViewModel;

runPostInit.unshift(function() {
  DefaultViewModel = fw.viewModel.create({
    namespace: '_DefaultNamespace',
    autoIncrement: true,
    initialize: function(params) {
      if(isObject(params) && isObject(params.$viewModel)) {
        extend(this, params.$viewModel);
      }
    },
    sequenceAnimations: function() {
      return fw.settings.sequenceAnimations || defaultAnimationSequenceInterval;
    }
  });
});
