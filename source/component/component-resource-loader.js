var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var getFilenameExtension = util.getFilenameExtension;
var getComponentExtension = require('../misc/resource-tools').getComponentExtension;

/**
 * The component resource loader tells footwork where to load the components assets from. It uses the supplied configuration to use AMD to download
 * them (the viewModel/template) if possible. After downloading these resources its template is then wrapped by the component lifecycle
 * loader and then bootstrapped.
 */
fw.components.loaders.push(fw.components.componentResourceLoader = {
  getConfig: function (componentName, callback) {
    var configOptions = null;
    var componentLocation;

    if (_.isFunction(window.require) && (componentLocation = fw.components.getLocation(componentName))) {
      var folderOffset = componentLocation.folderOffset || '';

      if (folderOffset !== '') {
        folderOffset = componentName + '/';
      }

      if (_.isString(componentLocation.combined)) {
        // combined viewModel + component module
        var combinedPath = componentLocation.combined;

        if (isPath(combinedPath)) {
          combinedPath = combinedPath + folderOffset + fw.components.getFileName(componentName, 'combined');
        }

        configOptions = {
          require: window.require.toUrl(combinedPath)
        };
      } else {
        var viewModelConfig;

        if (!_.isString(componentLocation.viewModel)) {
          // template-only component, substitute with 'blank' viewModel
          viewModelConfig = require('../misc/config').ViewModel;
        } else {
          // user has supplied the location of the viewModel, specify require config to download
          var viewModelPath = componentLocation.viewModel;

          if (isPath(viewModelPath)) {
            viewModelPath = viewModelPath + folderOffset + fw.components.getFileName(componentName, 'viewModel');
          }

          if (getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel')) {
            viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
          }

          viewModelConfig = { require: window.require.toUrl(viewModelPath) };
        }

        var templatePath = componentLocation.template;
        if (isPath(templatePath)) {
          templatePath = templatePath + folderOffset + fw.components.getFileName(componentName, 'template');
        }

        if (getFilenameExtension(templatePath) !== getComponentExtension(componentName, 'template')) {
          templatePath += '.' + getComponentExtension(componentName, 'template');
        }

        templatePath = 'text!' + window.require.toUrl(templatePath);

        configOptions = {
          viewModel: viewModelConfig,
          template: { require: templatePath }
        };
      }
    }

    callback(configOptions);
  }
});
