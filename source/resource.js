// resource.js
// ------------------

var isRegistered = function(resourceName) {
  return !isUndefined( this[resourceName] );
};

var getRegistered = function(resourceName) {
  return this[resourceName];
};

var register = function(resourceName, resource) {
  this[resourceName] = resource;
};

// component resource section
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


// viewModel resource section
var defaultViewModelFileExtensions = '.js';
var viewModelFileExtensions = fw.viewModels.fileExtensions = fw.observable( defaultViewModelFileExtensions );

function getViewModelExtension(viewModelName) {
  var viewModelExtensions = viewModelFileExtensions();
  var fileExtension = '';

  if( isFunction(viewModelExtensions) ) {
    fileExtension = viewModelExtensions(viewModelName);
  } else if( isString(viewModelExtensions) ) {
    fileExtension = viewModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

var getViewModelFileName = fw.viewModels.getFileName = function(viewModelName) {
  var fileName = viewModelName + '.' + getViewModelExtension(viewModelName);

  if( !isUndefined( viewModelResourceLocations[viewModelName] ) ) {
    var registeredLocation = viewModelResourceLocations[viewModelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
};

var defaultViewModelLocation = '/viewModel/';
var viewModelResourceLocations = fw.viewModels.resourceLocations = {};
var viewModelDefaultLocation = fw.viewModels.defaultLocation = function(path, updateDefault) {
  var viewModelLocation = defaultViewModelLocation;

  if( isString(path) ) {
    viewModelLocation = path;
  }

  if(isUndefined(updateDefault) || updateDefault) {
    defaultViewModelLocation = viewModelLocation;
  }

  return viewModelLocation;
};

var registeredViewModels = {};
var registerViewModel = fw.viewModels.register = register.bind(registeredViewModels);
var isRegisteredViewModel = fw.viewModels.isRegistered = isRegistered.bind(registeredViewModels);
var getRegisteredViewModel = fw.viewModels.getRegistered = getRegistered.bind(registeredViewModels);

var registerLocationOfViewModel = fw.viewModels.registerLocation = function(viewModelName, viewModelLocation) {
  if( isArray(viewModelName) ) {
    each(viewModelName, function(name) {
      registerLocationOfViewModel(name, viewModelLocation);
    });
  }
  viewModelResourceLocations[ viewModelName ] = viewModelDefaultLocation(viewModelLocation, false);
};

var locationIsRegisteredForViewModel = fw.viewModels.locationIsRegistered = function(viewModelName) {
  return !isUndefined(viewModelResourceLocations[viewModelName]);
};

// Return the viewModel resource definition for the supplied viewModelName
var getViewModelResourceLocation = fw.viewModels.getResourceLocation = function(viewModelName) {
  if( isUndefined(viewModelName) ) {
    return viewModelResourceLocations;
  }
  return viewModelResourceLocations[viewModelName] || defaultViewModelLocation;
};


// router resource section
var defaultRouterFileExtensions = '.js';
var routerFileExtensions = fw.viewModels.fileExtensions = fw.observable( defaultRouterFileExtensions );

var getRouterFileName = fw.routers.getFileName = function(moduleName) {
  var routerExtensions = routerFileExtensions();
  var fileName = moduleName;

  if( isFunction(routerExtensions) ) {
    fileName += routerExtensions(moduleName);
  } else if( isString(routerExtensions) ) {
    fileName += routerExtensions;
  }

  if( !isUndefined( routerResourceLocations[moduleName] ) ) {
    var registeredLocation = routerResourceLocations[moduleName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
};

var defaultRouterLocation = '/';
var routerResourceLocations = fw.routers.resourceLocations = {};
var routerDefaultLocation = fw.routers.defaultLocation = function(path, updateDefault) {
  var routerLocation = defaultRouterLocation;

  if( isString(path) ) {
    routerLocation = path;
  }

  if(isUndefined(updateDefault) || updateDefault) {
    defaultRouterLocation = routerLocation;
  }

  return routerLocation;
};

var registeredRouters = {};
var registerRouter = fw.routers.register = register.bind(registeredRouters);
var isRegisteredRouter = fw.routers.isRegistered = isRegistered.bind(registeredRouters);
var getRegisteredRouter = fw.routers.getRegistered = getRegistered.bind(registeredRouters);

var registerLocationOfRouter = fw.routers.registerLocation = function(moduleName, routerLocation) {
  if( isArray(moduleName) ) {
    each(moduleName, function(name) {
      registerLocationOfRouter(name, routerLocation);
    });
  }
  routerResourceLocations[ moduleName ] = routerDefaultLocation(routerLocation, false);
};

var locationIsRegisteredForRouter = fw.routers.locationIsRegistered = function(moduleName) {
  return !isUndefined(routerResourceLocations[moduleName]);
};

// Return the viewModel resource definition for the supplied moduleName
var getRouterResourceLocation = fw.routers.getResourceLocation = function(moduleName) {
  if( isUndefined(moduleName) ) {
    return routerResourceLocations;
  }
  return routerResourceLocations[moduleName] || defaultRouterLocation;
};
