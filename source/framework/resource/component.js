// framework/resource/component.js
// ------------------

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );

fw.components.register = function(componentName, options) {
  var viewModel = options.viewModel || options.dataModel || options.router;

  if( !isString(componentName) ) {
    throw new Error('Components must be provided a componentName.');
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || noop,
    template: options.template
  });
};

function getComponentExtension(componentName, fileType) {
  var componentExtensions = fw.components.fileExtensions();
  var fileExtension = '';

  if( isFunction(componentExtensions) ) {
    fileExtension = componentExtensions(componentName)[fileType];
  } else if( isObject(componentExtensions) ) {
    if( isFunction(componentExtensions[fileType]) ) {
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

  if(fw.components.isRegistered(componentName)) {
    return null;
  }

  if(fw.components.locationIsRegistered(componentName)) {
    var registeredLocation = fw.components.getLocation(componentName);
    if(!isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType])) {
      if(isString(registeredLocation[fileType])) {
        // full filename was supplied, lets return that
        fileName = last(registeredLocation[fileType].split('/'));
      } else {
        return null;
      }
    }
  }

  return fileName + (fileExtension !== getFilenameExtension(fileName) ? ('.' + fileExtension) : '');
};

fw.components.defaultLocation = function(location) {
  if( isString(location) ) {
    defaultComponentLocation = extend({}, baseComponentLocation, {
      viewModel: location,
      template: location
    });
  } else if(isObject(location)) {
    defaultComponentLocation = extend({}, baseComponentLocation, location);
  }

  return defaultComponentLocation;
};

fw.components.registerLocation = function(componentName, componentLocation, folderOffset) {
  if(isArray(componentName)) {
    each(componentName, function(name) {
      fw.components.registerLocation(name, componentLocation);
    });
  }

  if(isString(componentLocation)) {
    componentLocation = extend({}, baseComponentLocation, {
      viewModel: componentLocation,
      template: componentLocation,
      folderOffset: !!folderOffset
    });
  } else if(isObject(componentLocation)) {
    componentLocation.folderOffset = !!folderOffset;
  }

  fw.components.resourceLocations[componentName] = extend({}, baseComponentLocation, forceViewModelComponentConvention(componentLocation));
};

fw.components.getRegisteredLocation = function(componentName) {
  return reduce(fw.components.resourceLocations, function(registeredLocation, location, registeredComponentName) {
    if(!registeredLocation) {
      if(!isNull(registeredComponentName.match(regExpMatch)) && !isNull(componentName.match(registeredComponentName.replace(regExpMatch, '')))) {
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
  if( isUndefined(componentName) ) {
    return fw.components.resourceLocations;
  }
  return omit(fw.components.getRegisteredLocation(componentName) || defaultComponentLocation, isNull);
};
