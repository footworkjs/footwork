var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../entities/entity-descriptors');

/**
 * This component loader wraps viewModel/dataModel/router declarative element contents with the
 * $life binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 */
fw.components.loaders.unshift(fw.components.entityLifecycleLoader = {
  getConfig: function(componentName, callback) {
    var configOptions = null;
    var descriptor = entityDescriptors.getDescriptor(componentName);

    if(descriptor) {
      // this component is a viewModel/dataModel/router entity
      var moduleName = _.last(require('./component-registry'));
      var viewModelOrLocation = descriptor.resource.getResourceOrLocation(moduleName);

      if(_.isString(viewModelOrLocation)) {
        viewModelOrLocation = { require: viewModelOrLocation + descriptor.resource.getFileName(moduleName) };
      }

      callback({
        viewModel: viewModelOrLocation,
        template: '<!-- ko $life, template: { nodes: $componentTemplateNodes, data: $data } --><!-- /ko -->'
      });
    } else {
      callback(null);
    }
  }
});
