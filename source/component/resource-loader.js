// framework/component/loader.js
// ------------------

var fw = require('../../bower_components/knockoutjs/dist/knockout');
var Conduit = require('../../bower_components/conduitjs/lib/conduit');
var _ = require('../misc/lodash');
var DefaultViewModel = require('../misc/config').DefaultViewModel;

var util = require('../misc/util');
var isPath = util.isPath;
var getFilenameExtension = util.getFilenameExtension;

var entityTools = require('../entities/entity-tools');
var nearestEntity = entityTools.nearestEntity;
var isEntity = entityTools.isEntity;

var getComponentExtension = require('../resource/component-resource').getComponentExtension;
var isOutletViewModel = require('../entities/router/router-tools').isOutletViewModel;

fw.components.loaders.push(fw.components.requireLoader = {
  getConfig: function(componentName, callback) {
    var combinedFile = fw.components.getFileName(componentName, 'combined');
    var viewModelFile = fw.components.getFileName(componentName, 'viewModel');
    var templateFile = fw.components.getFileName(componentName, 'template');
    var componentLocation = fw.components.getLocation(componentName);
    var folderOffset = componentLocation.folderOffset || '';
    var configOptions = null;
    var viewModelPath;
    var templatePath;
    var combinedPath;
    var viewModelConfig;

    if (folderOffset !== '') {
      folderOffset = componentName + '/';
    }

    if (_.isFunction(require)) {
      // load component using knockouts native support for requirejs
      if(require.specified(componentName)) {
        // component already cached, lets use it
        configOptions = {
          require: componentName
        };
      } else if (_.isString(componentLocation.combined)) {
        combinedPath = componentLocation.combined;

        if(isPath(combinedPath)) {
          combinedPath = combinedPath + folderOffset + combinedFile;
        }

        configOptions = {
          require: require.toUrl(combinedPath)
        };
      } else {
        // check to see if the requested component is template only and should not request a viewModel (we supply a dummy object in its place)
        if (!_.isString(componentLocation.viewModel)) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = DefaultViewModel;
        } else {
          viewModelPath = componentLocation.viewModel;

          if(isPath(viewModelPath)) {
            viewModelPath = viewModelPath + folderOffset + viewModelFile;
          }

          if(getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel')) {
            viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
          }

          viewModelConfig = { require: require.toUrl(viewModelPath) };
        }

        templatePath = componentLocation.template;
        if (isPath(templatePath)) {
          templatePath = templatePath + folderOffset + templateFile;
        }

        if (getFilenameExtension(templatePath) !== getComponentExtension(componentName, 'template')) {
          templatePath += '.' + getComponentExtension(componentName, 'template');
        }

        templatePath = 'text!' + templatePath;

        configOptions = {
          viewModel: viewModelConfig,
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});

fw.components.loaders.unshift(fw.components.requireResolver = {
  loadComponent: function(componentName, config, callback) {
    possiblyGetConfigFromAmd(config, function(loadedConfig) {
      // TODO: Provide upstream patch which clears out loadingSubscribablesCache when load fails so that
      // subsequent requests will re-run require

      var origCallback = callback;
      callback = new Conduit.Sync({ target: callback });
      callback.before(function(config) {
        config.createViewModel = new Conduit.Sync({ target: config.createViewModel });
        config.createViewModel.after(function(viewModel, params, componentInfo) {
          var $flightTracker = componentInfo.element.$flightTracker;
          var $context = fw.contextFor(componentInfo.element);
          var $nearestOutlet = nearestEntity($context, isOutletViewModel);
          var $nearestEntity = nearestEntity($context);
          var $parentsInFlightChildren;
          var $outletsInFlightChildren;

          if($nearestEntity) {
            $parentsInFlightChildren = $nearestEntity.__private('inFlightChildren');
          }
          if($nearestOutlet) {
            $outletsInFlightChildren = $nearestOutlet.inFlightChildren;
          }

          if (isEntity(viewModel)) {
            var resolveFlightTracker =  noop;

            if ($flightTracker) {
              resolveFlightTracker = function(addAnimationClass) {
                var wasResolved = false;
                function resolveThisEntityNow(isResolved) {
                  function finishResolution() {
                    addAnimationClass();
                    if(fw.isObservable($parentsInFlightChildren) && _.isFunction($parentsInFlightChildren.remove)) {
                      $parentsInFlightChildren.remove($flightTracker);
                    }
                    if(fw.isObservable($outletsInFlightChildren) && _.isFunction($outletsInFlightChildren.remove)) {
                      $outletsInFlightChildren.remove($flightTracker);
                    }
                  }

                  if (!wasResolved) {
                    wasResolved = true;
                    if (isResolved === true) {
                      finishResolution();
                    } else if(isPromise(isResolved) || (_.isArray(isResolved) && _.every(isResolved, isPromise))) {
                      var promises = [].concat(isResolved);
                      var checkPromise = function(promise) {
                        (promise.done || promise.then).call(promise, function() {
                          if(_.every(promises, promiseIsResolvedOrRejected)) {
                            finishResolution();
                          }
                        });
                      };

                      _.each(promises, checkPromise);
                    }
                  }
                }

                function maybeResolve() {
                  viewModel.__private('configParams').afterResolving.call(viewModel, resolveThisEntityNow);
                }

                var $inFlightChildren = viewModel.__private('inFlightChildren');
                // if no children then resolve now, otherwise subscribe and wait till its 0
                if ($inFlightChildren().length === 0) {
                  maybeResolve();
                } else {
                  viewModel.disposeWithInstance($inFlightChildren.subscribe(function(inFlightChildren) {
                    inFlightChildren.length === 0 && maybeResolve();
                  }));
                }
              };
            }

            viewModel.__private('resolveFlightTracker', resolveFlightTracker);
          }
        });
      });

      resolveConfig(componentName, loadedConfig, callback);
    });
  }
});

function possiblyGetConfigFromAmd(config, callback) {
  if(_.isString(config['require'])) {
    if(_.isFunction(require)) {
      require([config['require']], callback, function() {
        _.each(activeOutlets(), function(outlet) {
          (outlet().onFailure || noop)();
        });
      });
    } else {
      throw new Error('Uses require, but no AMD loader is present');
    }
  } else {
    callback(config);
  }
}

// Note that this is a direct lift from the knockoutjs source
function resolveConfig(componentName, config, callback) {
  var result = {};
  var makeCallBackWhenZero = 2;
  var tryIssueCallback = function() {
    if (--makeCallBackWhenZero === 0) {
      callback(result);
    }
  };
  var templateConfig = config['template'];
  var viewModelConfig = config['viewModel'];

  if (templateConfig) {
    possiblyGetConfigFromAmd(templateConfig, function(loadedConfig) {
      getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
        result['template'] = resolvedTemplate;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }

  if (viewModelConfig) {
    possiblyGetConfigFromAmd(viewModelConfig, function(loadedConfig) {
      getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
        result['createViewModel'] = resolvedViewModel;
        tryIssueCallback();
      });
    });
  } else {
    tryIssueCallback();
  }
}

// Note that this is a direct lift from the knockoutjs source
function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
  // On the first call in the stack, start with the full set of loaders
  if(!candidateLoaders) {
    candidateLoaders = fw.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
  }

  // Try the next candidate
  var currentCandidateLoader = candidateLoaders.shift();
  if (currentCandidateLoader) {
    var methodInstance = currentCandidateLoader[methodName];
    if (methodInstance) {
      var wasAborted = false;
      var synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
        if (wasAborted) {
          callback(null);
        } else if (result !== null) {
          // This candidate returned a value. Use it.
          callback(result);
        } else {
          // Try the next candidate
          getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
        }
      }));

      // Currently, loaders may not return anything synchronously. This leaves open the possibility
      // that we'll extend the API to support synchronous return values in the future. It won't be
      // a breaking change, because currently no loader is allowed to return anything except undefined.
      if (synchronousReturnValue !== undefined) {
        wasAborted = true;

        // Method to suppress exceptions will remain undocumented. This is only to keep
        // KO's specs running tidily, since we can observe the loading got aborted without
        // having exceptions cluttering up the console too.
        if (!currentCandidateLoader['suppressLoaderExceptions']) {
          throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
        }
      }
    } else {
      // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
      getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
    }
  } else {
    // No candidates returned a value
    callback(null);
  }
}

// Note that this is a direct lift from the knockoutjs source
function resolveTemplate(templateConfig, callback) {
  if (typeof templateConfig === 'string') {
    // Markup - parse it
    callback(fw.utils.parseHtmlFragment(templateConfig));
  } else if (templateConfig instanceof Array) {
    // Assume already an array of DOM nodes - pass through unchanged
    callback(templateConfig);
  } else if (isDocumentFragment(templateConfig)) {
    // Document fragment - use its child nodes
    callback(fw.utils.makeArray(templateConfig.childNodes));
  } else if (templateConfig['element']) {
    var element = templateConfig['element'];
    if (isDomElement(element)) {
      // Element instance - copy its child nodes
      callback(cloneNodesFromTemplateSourceElement(element));
    } else if (typeof element === 'string') {
      // Element ID - find it, then copy its child nodes
      var elemInstance = document.getElementById(element);
      if (elemInstance) {
        callback(cloneNodesFromTemplateSourceElement(elemInstance));
      } else {
        throw new Error('Cannot find element with ID ' + element);
      }
    } else {
      throw new Error('Unknown element type: ' + element);
    }
  } else {
    throw new Error('Unknown template value: ' + templateConfig);
  }
}

// Note that this is a direct lift from the knockoutjs source
function cloneNodesFromTemplateSourceElement(elemInstance) {
  switch (fw.utils.tagNameLower(elemInstance)) {
    case 'script':
      return fw.utils.parseHtmlFragment(elemInstance.text);
    case 'textarea':
      return fw.utils.parseHtmlFragment(elemInstance.value);
    case 'template':
      // For browsers with proper <template> element support (i.e., where the .content property
      // gives a document fragment), use that document fragment.
      if (isDocumentFragment(elemInstance.content)) {
        return fw.utils.cloneNodes(elemInstance.content.childNodes);
      }
  }

  // Regular elements such as <div>, and <template> elements on old browsers that don't really
  // understand <template> and just treat it as a regular container
  return fw.utils.cloneNodes(elemInstance.childNodes);
}
