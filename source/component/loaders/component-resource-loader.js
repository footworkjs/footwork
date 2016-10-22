var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../../misc/util');
var isPath = util.isPath;
var getFilenameExtension = util.getFilenameExtension;

var getComponentExtension = require('../../resource/component-resource').getComponentExtension;

fw.components.loaders.push(fw.components.registeredLocationLoader = {
  getConfig: function (componentName, callback) {
    // this is a normal component
    var configOptions = null;
    var componentLocation = fw.components.getLocation(componentName);

    if (componentLocation) {
      var combinedFile = fw.components.getFileName(componentName, 'combined');
      var viewModelFile = fw.components.getFileName(componentName, 'viewModel');
      var templateFile = fw.components.getFileName(componentName, 'template');
      var folderOffset = componentLocation.folderOffset || '';

      if (folderOffset !== '') {
        folderOffset = componentName + '/';
      }

      if (_.isFunction(window.require)) {
        // load component using knockouts native support for requirejs
        if (window.require.specified(componentName)) {
          // component already cached, lets use it
          configOptions = {
            require: componentName
          };
        } else if (_.isString(componentLocation.combined)) {
          var combinedPath = componentLocation.combined;

          if (isPath(combinedPath)) {
            combinedPath = combinedPath + folderOffset + combinedFile;
          }

          configOptions = {
            require: window.require.toUrl(combinedPath)
          };
        } else {
          var viewModelConfig;

          // check to see if the requested component is template only and should not request a viewModel (we supply a dummy object in its place)
          if (!_.isString(componentLocation.viewModel)) {
            // template-only component, substitute with 'blank' viewModel
            viewModelConfig = require('../../misc/config').DefaultViewModel;
          } else {
            var viewModelPath = componentLocation.viewModel;

            if (isPath(viewModelPath)) {
              viewModelPath = viewModelPath + folderOffset + viewModelFile;
            }

            if (getFilenameExtension(viewModelPath) !== getComponentExtension(componentName, 'viewModel')) {
              viewModelPath += '.' + getComponentExtension(componentName, 'viewModel');
            }

            viewModelConfig = { require: window.require.toUrl(viewModelPath) };
          }

          var templatePath = componentLocation.template;
          if (isPath(templatePath)) {
            templatePath = templatePath + folderOffset + templateFile;
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
    }

    callback(configOptions);
  }
});
