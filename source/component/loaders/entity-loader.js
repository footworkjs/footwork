var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

/**
 * This component loader has two functions:
 * 1. wraps viewModel/dataModel/router declarative element contents with the $life binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 * 2. provides either the entity constructor itself or the require path to get the entity
 */
fw.components.loaders.unshift(fw.components.entityLoader = {
  getConfig: function (componentName, callback) {
    var configOptions = null;
    var descriptor = require('../../entities/entity-descriptors').getDescriptor(componentName);

    if (descriptor) {
      // this component is a viewModel/dataModel/router entity
      var moduleName = require('../flight-tracker').get().moduleName;
      var viewModelOrLocation = descriptor.resource.getResourceOrLocation(moduleName);

      if (_.isString(viewModelOrLocation)) {
        // assume string is a location/path, append the filename to it and set it as a require dependency
        viewModelOrLocation = { require: viewModelOrLocation + descriptor.resource.getFileName(moduleName) };
      }

      callback({
        viewModel: viewModelOrLocation,
        template: '<!-- ko $life, template: { nodes: $componentTemplateNodes, data: $data } --><!-- /ko -->'
      });

      // ensure that getConfig is called again when another declaration is encountered
      fw.components.clearCachedDefinition(componentName);
    } else {
      callback(null);
    }
  }
});
