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

var assessHistoryState = noop;
var originalApplyBindings = noop;
var setupContextAndLifeCycle = noop;

var runPostInit = [];
var internalComponents = [];
var entityDescriptors = [];
var entityMixins = [];

var $routerOutlet;
var $globalNamespace;

var isEntityCtor;
var isEntity;
var isDataModel;
var isRouter;
