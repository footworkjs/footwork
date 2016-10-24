var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../misc/util');
var isPath = util.isPath;
var getFilenameExtension = util.getFilenameExtension;
var regExpMatch = /^\/|\/$/g;

require('./component-binding-init');

// Custom loader used to locate or load component resources (viewModel/template)
require('./component-resource-loader');

// Custom loader used to wrap components with the $lifecycle binding
require('./component-lifecycle-loader');

var getComponentExtension = require('../misc/resource-tools').getComponentExtension;

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable({
  combined: '.js',
  viewModel: '.js',
  template: '.html'
});

var originalComponentRegisterFunc = fw.components.register;
fw.components.register = function (componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if (!_.isString(componentName)) {
    throw new Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || require('../misc/config').DefaultViewModel,
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
  var fileName = componentName;
  var fileExtension = getComponentExtension(componentName, fileType);

  if (fw.components.isRegistered(componentName)) {
    return null;
  }

  if (fw.components.locationIsRegistered(componentName)) {
    var registeredLocation = fw.components.getLocation(componentName);
    if (!_.isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType])) {
      if (_.isString(registeredLocation[fileType])) {
        // full filename was supplied, lets return that
        fileName = _.last(registeredLocation[fileType].split('/'));
      }
    }
  }

  return fileName + (fileExtension !== getFilenameExtension(fileName) ? ('.' + fileExtension) : '');
};

var baseComponentLocation = {
  combined: null,
  viewModel: null,
  template: null
};

fw.components.registerLocation = function (componentName, componentLocation, folderOffset) {
  if (_.isArray(componentName)) {
    _.each(componentName, function (name) {
      fw.components.registerLocation(name, componentLocation, folderOffset);
    });
  }

  if (_.isString(componentLocation)) {
    componentLocation = _.extend({}, baseComponentLocation, {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: !!folderOffset
    });
  } else if (_.isObject(componentLocation)) {
    componentLocation.folderOffset = !!folderOffset;
  }

  fw.components.resourceLocations[componentName] = _.extend({}, baseComponentLocation, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function (componentName) {
  return _.reduce(fw.components.resourceLocations, function (registeredLocation, location, registeredComponentName) {
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
    return fw.components.resourceLocations;
  }
  return _.omitBy(fw.components.getRegisteredLocation(componentName), _.isNull);
};


var entityDescriptors = require('../entities/entity-descriptors');

fw.components.getComponentNameForNode = function (node) {
  var tagName = _.isString(node.tagName) && node.tagName.toLowerCase();

  if (fw.components.isRegistered(tagName)
     || fw.components.locationIsRegistered(tagName)
     || entityDescriptors.tagNameIsPresent(tagName)
     || tagName === 'outlet') {
    return tagName;
  }

  return null;
};
