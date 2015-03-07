// dataModel.js
// ------------------

// Duck type function for determining whether or not something is a footwork viewModel constructor function
function isDataModelCtor(thing) {
  return isFunction(thing) && !!thing.__isDataModelCtor;
}

// Duck type function for determining whether or not something is a footwork dataModel
function isDataModel(thing) {
  return isObject(thing) && !!thing.__isDataModel;
}

fw.dataModels = {};

var defaultDataModelConfigParams = {
  namespace: undefined,
  autoRegister: false,
  autoIncrement: false,
  mixins: undefined,
  initialize: noop,
  afterBinding: noop,
  onDispose: noop
};

// var createDataModel = fw.dataModel = function(configParams) {
//   configParams = configParams || {};
//   var ctor = noop;
//   var parentViewModel = configParams.parent;

//   if( !isUndefined(configParams) ) {
//     ctor = configParams.initialize || noop;
//   }
//   configParams = extend({}, defaultDataModelConfigParams, configParams);

//   var initDataModelMixin = {
//     mixin: {
//       __isViewModel: true,
//       $params: result(configParams, 'params'),
//       __getConfigParams: function() {
//         return configParams;
//       },
//       dispose: function() {
//         if( !this._isDisposed ) {
//           this._isDisposed = true;
//           if( configParams.onDispose !== noop ) {
//             configParams.onDispose.call(this);
//           }
//           each(this, propertyDisposal);
//         }
//       }
//     },
//     _postInit: function() {
//       if( this.__assertPresence !== false ) {
//         this.$globalNamespace.request.handler('__model_reference', function(options) {
//           if( !this.__isOutlet || (isObject(options) && options.includeOutlets) ) {
//             if( isString(options.namespaceName) || isArray(options.namespaceName) ) {
//               if(isArray(options.namespaceName) && indexOf(options.namespaceName, this.getNamespaceName()) !== -1) {
//                 return this;
//               } else if(isString(options.namespaceName) && options.namespaceName === this.getNamespaceName()) {
//                 return this;
//               }
//             } else {
//               return this;
//             }
//           }
//         }.bind(this));
//       }
//     }
//   };

//   if( !isDataModelCtor(ctor) ) {
//     var composure = [ ctor ];
//     var afterInitMixins = reject(viewModelMixins, beforeInitMixins);
//     var beforeInitMixins = filter(viewModelMixins, beforeInitMixins);

//     if( beforeInitMixins.length ) {
//       composure = composure.concat(beforeInitMixins);
//     }
//     composure = composure.concat(initDataModelMixin);
//     if( afterInitMixins.length ) {
//       composure = composure.concat(afterInitMixins);
//     }

//     if( !isUndefined(configParams.mixins) ) {
//       composure = composure.concat(configParams.mixins);
//     }

//     var model = riveter.compose.apply( undefined, composure );
//     model.__isDataModelCtor = true;
//     model.__configParams = configParams;
//   } else {
//     // user has specified another dataModel constructor as the 'initialize' function, we extend it with the current constructor to create an inheritance chain
//     model = ctor;
//   }

//   if( !isUndefined(parentViewModel) ) {
//     model.inherits(parentViewModel);
//   }

//   if( configParams.autoRegister ) {
//     var namespace = configParams.namespace;
//     if( isRegisteredViewModel(namespace) ) {
//       if( getRegisteredViewModel(namespace) !== model ) {
//         throw 'namespace [' + namespace + '] already registered using a different viewModel, autoRegister failed.';
//       }
//     } else {
//       registerViewModel(namespace, model);
//     }
//   }

//   return model;
// };
