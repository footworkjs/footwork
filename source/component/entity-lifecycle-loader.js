var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entities/entity-descriptors');

/**
 * This component loader has two functions:
 * 1. wraps viewModel/dataModel/router declarative element contents with the $life binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 * 2. provides either the entity constructor itself or the require path to get the entity
 */
fw.components.loaders.unshift(fw.components.entityLifecycleLoader = {
  getConfig: function(componentName, callback) {
    var configOptions = null;
    var descriptor = entityDescriptors.getDescriptor(componentName);

    if(descriptor) {
      // this component is a viewModel/dataModel/router entity
      var moduleName = require('./component-registry').pop();
      var viewModelOrLocation = descriptor.resource.getResourceOrLocation(moduleName);

      if(_.isString(viewModelOrLocation)) {
        viewModelOrLocation = { require: viewModelOrLocation + descriptor.resource.getFileName(moduleName) };
      }

      callback({
        viewModel: viewModelOrLocation,
        template: '<!-- ko $life, template: { nodes: $componentTemplateNodes, data: $data } --><!-- /ko -->'
      });

      // ensure that getConfig is called again when a new declaration is encountered
      fw.components.clearCachedDefinition(componentName);
    } else {
      callback(null);
    }
  }
});
