var fw = require('../../bower_components/knockoutjs/dist/knockout');
var _ = require('../misc/lodash');

var isPath = require('../misc/util').isPath;
var DefaultViewModel = require('../misc/config').DefaultViewModel;

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable({
  combined: '.js',
  viewModel: '.js',
  template: '.html'
});

var originalComponentRegisterFunc = fw.components.register;
fw.components.register = function(componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if (!_.isString(componentName)) {
    throw new Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || DefaultViewModel,
    template: options.template
  });
};

function getComponentExtension(componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions();
  var fileExtension = '';

  if (_.isFunction(componentExtensions)) {
    fileExtension = componentExtensions(componentName)[fileType];
  } else if(_.isObject(componentExtensions)) {
    if (_.isFunction(componentExtensions[fileType])) {
      fileExtension = componentExtensions[fileType](componentName);
    } else {
      fileExtension = componentExtensions[fileType] || '';
    }
  }

  return fileExtension.replace(/^\./, '') || '';
}

fw.components.getFileName = function(componentName, fileType) {
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
      } else {
        return null;
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

fw.components.registerLocation = function(componentName, componentLocation, folderOffset) {
  if (_.isArray(componentName)) {
    each(componentName, function(name) {
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

fw.components.getRegisteredLocation = function(componentName) {
  return reduce(fw.components.resourceLocations, function(registeredLocation, location, registeredComponentName) {
    if (!registeredLocation) {
      if (!_.isNull(registeredComponentName.match(regExpMatch)) && !_.isNull(componentName.match(registeredComponentName.replace(regExpMatch, '')))) {
        registeredLocation = location;
      } else if(componentName === registeredComponentName) {
        registeredLocation = location;
      }
    }
    return registeredLocation;
  }, undefined);
};

fw.components.locationIsRegistered = function(componentName) {
  return !!fw.components.getRegisteredLocation(componentName);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function(componentName) {
  if (_.isUndefined(componentName)) {
    return fw.components.resourceLocations;
  }
  return _.omitBy(fw.components.getRegisteredLocation(componentName), _.isNull);
};
