var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../../misc/util');
var isAmdResolved = util.isAmdResolved;
var isPath = util.isPath;

var bindingElement = require('../../binding/binding-element');

/**
 * This component loader has two functions:
 * 1. wraps viewModel/dataModel/router declarative element contents with the $lifecycle binding which enables the lifecycle hooks (afterBinding/afterRender/onDispose).
 * 2. provides either the entity constructor itself or the require path to get the entity
 */
fw.components.loaders.unshift(fw.components.entityLoader = {
  getConfig: function (componentName, callback) {
    var configOptions = null;
    var descriptor = require('../../entities/entity-descriptors').getDescriptor(componentName);

    if (descriptor) {
      // this component is a viewModel/dataModel/router entity
      var moduleName = require('../loading-tracker').get().moduleName;
      var viewModelOrLocation = descriptor.resource.getResourceOrLocation(moduleName);

      if (_.isString(viewModelOrLocation)) {
        // assume string is a location/path, append the filename to it and set it as a require dependency
        if (isPath(viewModelOrLocation)) {
          viewModelOrLocation = viewModelOrLocation + descriptor.resource.getFileName(moduleName);
        }

        viewModelOrLocation = {
          require: isAmdResolved(moduleName) ? moduleName : window.require.toUrl(viewModelOrLocation)
        };
      }

      callback({
        viewModel: viewModelOrLocation,
        template: bindingElement.open.prefix + '$lifecycle, template: { nodes: $componentTemplateNodes, data: $data }' + bindingElement.open.postfix + bindingElement.close
      });
    } else {
      callback(null);
    }
  }
});
