// framework/init.js
// ------------------

// Record the footwork version as of this build.
fw.footworkVersion = 'FOOTWORK_VERSION';

// Expose any embedded dependencies
fw.embed = embedded;

fw.viewModels = {};
fw.dataModels = {};
fw.routers = {};
fw.outlets = {};
fw.settings = {};

var runPostInit = [];
var internalComponents = [];
var entityDescriptors = [];
var entityMixins = [];
var footwork = {};

var entityClassName = 'fw-entity';
var bindingClassName = 'fw-entity-bound';
var animationIteration = 20;
var isEntityCtor;
var isEntity;
var isDataModel;
var isDataModelCtor;
var isRouter;
var activeOutlets = fw.observableArray();
