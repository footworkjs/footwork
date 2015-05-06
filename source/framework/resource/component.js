// framework/resource/component.js
// ------------------

fw.components.resourceLocations = {};

fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );

fw.components.register = function(componentName, options) {
  var viewModel = options.initialize || options.viewModel;

  if( !isString(componentName) ) {
    throw new Error('Components must be provided a componentName.');
  }

  if( isFunction(viewModel) && !isEntityCtor(viewModel) ) {
    options.namespace = componentName;
    viewModel = fw.viewModel(options);
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

  if( fw.components.isRegistered(componentName) ) {
    return null;
  }

  if( !isUndefined( fw.components.resourceLocations[componentName] ) ) {
    var registeredLocation = fw.components.resourceLocations[componentName];
    if( !isUndefined(registeredLocation[fileType]) && !isPath(registeredLocation[fileType]) ) {
      if( isString(registeredLocation[fileType]) ) {
        // full filename was supplied, lets return that
        fileName = last( registeredLocation[fileType].split('/') );
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
      combined: location
    });
  } else if(isObject(location)) {
    defaultComponentLocation = extend({}, baseComponentLocation, location);
  }

  return defaultComponentLocation;
};

fw.components.registerLocation = function(componentName, componentLocation) {
  if( isArray(componentName) ) {
    each(componentName, function(name) {
      fw.components.registerLocation(name, componentLocation);
    });
  }

  if( isString(componentLocation) ) {
    componentLocation = extend({}, baseComponentLocation, {
      combined: componentLocation
    });
  }

  fw.components.resourceLocations[ componentName ] = extend({}, baseComponentLocation, componentLocation);
};

fw.components.locationIsRegistered = function(componentName) {
  return !isUndefined(fw.components.resourceLocations[componentName]);
};

// Return the component resource definition for the supplied componentName
fw.components.getLocation = function(componentName) {
  if( isUndefined(componentName) ) {
    return fw.components.resourceLocations;
  }
  return _.omit(fw.components.resourceLocations[componentName] || defaultComponentLocation, _.isNull);
};
