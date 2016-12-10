var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var privateDataSymbol = util.getSymbol('footwork');
var regExpMatch = /^\/|\/$/g;

require('./component-binding-init');

// Custom loader used to locate or load component resources (viewModel/template)
require('./component-resource-loader');

// Custom loader used to wrap components with the $lifecycle binding
require('./component-lifecycle-loader');

fw.components.registeredLocations = {};

fw.components.fileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

var originalComponentRegisterFunc = fw.components.register;
fw.components.register = function (componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if (!_.isString(componentName)) {
    throw Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel,
    template: options.template
  });
};

function forceViewModelComponentConvention (componentLocation) {
  if (_.isObject(componentLocation) && _.isUndefined(componentLocation.viewModel) && _.isUndefined(componentLocation.combined)) {
    return {
      viewModel: componentLocation.dataModel || componentLocation.router,
      template: componentLocation.template
    };
  }
  return componentLocation;
}

fw.components.getFileName = function (componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions;
  var fileExtension = '';

  if (_.isFunction(componentExtensions[fileType])) {
    fileExtension = componentExtensions[fileType](componentName);
  } else {
    fileExtension = componentExtensions[fileType] || '';
  }

  return componentName + '.' + (fileExtension.replace(/^\./, '') || '');
};

fw.components.registerLocation = function (componentName, componentLocation, folderOffset) {
  if (_.isArray(componentName)) {
    _.each(componentName, function (name) {
      fw.components.registerLocation(name, componentLocation, folderOffset);
    });
  }

  if (_.isString(componentLocation)) {
    componentLocation = {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: folderOffset
    };
  } else if (_.isObject(componentLocation)) {
    componentLocation.folderOffset = folderOffset;
  }

  fw.components.registeredLocations[componentName] = _.extend({}, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function (componentName) {
  return _.reduce(fw.components.registeredLocations, function (registeredLocation, location, registeredComponentName) {
    if (!registeredLocation) {
      if (!_.isNull(registeredComponentName.match(regExpMatch)) && !_.isNull(componentName.match(registeredComponentName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if (componentName === registeredComponentName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
};

fw.components.locationIsRegistered = function (componentName) {
  return !!fw.components.getRegisteredLocation(componentName);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function (componentName) {
  if (_.isUndefined(componentName)) {
    return fw.components.registeredLocations;
  }
  return _.omitBy(fw.components.getRegisteredLocation(componentName), _.isNull);
};


var entityDescriptors = require('../entities/entity-descriptors');

fw.components.getComponentNameForNode = function (node) {
  var tagName = _.isString(node.tagName) && node.tagName.toLowerCase();

  if (fw.components.isRegistered(tagName)
     || fw.components.locationIsRegistered(tagName)
     || entityDescriptors.tagNameIsPresent(tagName)) {
    return tagName;
  }

  return null;
};
