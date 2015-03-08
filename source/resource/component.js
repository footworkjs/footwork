// resource/component.js
// ------------------

var originalComponentRegisterFunc = fw.components.register;
var registerComponent = fw.components.register = function(componentName, options) {
  var viewModel = options.initialize || options.viewModel;

  if( !isString(componentName) ) {
    throw 'Components must be provided a componentName.';
  }

  if( isFunction(viewModel) && !isViewModelCtor(viewModel) ) {
    options.namespace = componentName;
    viewModel = fw.viewModel(options);
  }

  originalComponentRegisterFunc(componentName, {
    viewModel: viewModel || fw.viewModel(),
    template: options.template
  });
};

var defaultComponentFileExtensions = {
  combined: '.js',
  viewModel: '.js',
  template: '.html'
};

var componentFileExtensions = fw.components.fileExtensions = fw.observable( clone(defaultComponentFileExtensions) );
var componentIsRegistered = fw.components.isRegistered;

function getComponentExtension(componentName, fileType) {
  var componentExtensions = componentFileExtensions();
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

var getComponentFileName = fw.components.getFileName = function(componentName, fileType) {
  var fileName = componentName;
  var fileExtension = getComponentExtension(componentName, fileType);

  if( componentIsRegistered(componentName) ) {
    return null;
  }

  switch(fileType) {
    case 'viewModel':
      fileType = 'viewModels';
      break;
    case 'template':
      fileType = 'templates';
      break;
  }

  if( !isUndefined( componentResourceLocations[componentName] ) ) {
    var registeredLocation = componentResourceLocations[componentName];
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

var defaultComponentLocation = {
  combined: null,
  viewModels: '/viewModel/',
  templates: '/component/'
};
var componentResourceLocations = fw.components.resourceLocations = {};
var componentDefaultLocation = fw.components.defaultLocation = function(root, updateDefault) {
  var componentLocation = (isUndefined(updateDefault) || updateDefault === true) ? defaultComponentLocation : clone(defaultComponentLocation);

  if( isObject(root) ) {
    // assume some combination of defaultComponentLocation and normalize the parameters
    extend(componentLocation, reduce(root, function(options, paramValue, paramName) {
      if(paramName === 'viewModel') {
        options.viewModels = paramValue;
        delete options.viewModel;
      } else if(paramName === 'template') {
        options.templates = paramValue;
        delete options.template;
      } else {
        options[paramName] = paramValue;
      }
      return options;
    }, {}));
  } else if( isString(root) ) {
    componentLocation = {
      combined: rootURL,
      viewModels: null,
      templates: null
    };
  }

  return componentLocation;
};

var registerLocationOfComponent = fw.components.registerLocation = function(componentName, componentLocation) {
  if( isArray(componentName) ) {
    each(componentName, function(name) {
      registerLocationOfComponent(name, componentLocation);
    });
  }
  componentResourceLocations[ componentName ] = componentDefaultLocation(componentLocation, false);
};

var locationIsRegisteredForComponent = fw.components.locationIsRegistered = function(componentName) {
  return !isUndefined(componentResourceLocations[componentName]);
};

// Return the component resource definition for the supplied componentName
var getComponentResourceLocation = fw.components.getResourceLocation = function(componentName) {
  if( isUndefined(componentName) ) {
    return componentResourceLocations;
  }
  return componentResourceLocations[componentName] || defaultComponentLocation;
};
