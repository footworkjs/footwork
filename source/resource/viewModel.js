// resource/viewModel.js
// ------------------

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
