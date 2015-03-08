// resource/dataModel.js
// ------------------

var defaultDataModelFileExtensions = '.js';
var dataModelFileExtensions = fw.dataModels.fileExtensions = fw.observable( defaultDataModelFileExtensions );

function getDataModelExtension(dataModelName) {
  var dataModelExtensions = dataModelFileExtensions();
  var fileExtension = '';

  if( isFunction(dataModelExtensions) ) {
    fileExtension = dataModelExtensions(dataModelName);
  } else if( isString(dataModelExtensions) ) {
    fileExtension = dataModelExtensions;
  }

  return fileExtension.replace(/^\./, '') || '';
}

var dataModelResourceLocations = fw.dataModels.resourceLocations = {};
var getDataModelFileName = fw.dataModels.getFileName = function(dataModelName) {
  var fileName = dataModelName + '.' + getDataModelExtension(dataModelName);

  if( !isUndefined( dataModelResourceLocations[dataModelName] ) ) {
    var registeredLocation = dataModelResourceLocations[dataModelName];
    if( isString(registeredLocation) && !isPath(registeredLocation) ) {
      // full filename was supplied, lets return that
      fileName = last( registeredLocation.split('/') );
    }
  }

  return fileName;
};

var defaultDataModelLocation = '/dataModel/';
var dataModelDefaultLocation = fw.dataModels.defaultLocation = function(path, updateDefault) {
  var dataModelLocation = defaultDataModelLocation;

  if( isString(path) ) {
    dataModelLocation = path;
  }

  if(isUndefined(updateDefault) || updateDefault) {
    defaultDataModelLocation = dataModelLocation;
  }

  return dataModelLocation;
};

var registeredDataModels = {};
var registerDataModel = fw.dataModels.register = register.bind(registeredDataModels);
var isRegisteredDataModel = fw.dataModels.isRegistered = isRegistered.bind(registeredDataModels);
var getRegisteredDataModel = fw.dataModels.getRegistered = getRegistered.bind(registeredDataModels);

var registerLocationOfDataModel = fw.dataModels.registerLocation = function(dataModelName, dataModelLocation) {
  if( isArray(dataModelName) ) {
    each(dataModelName, function(name) {
      registerLocationOfDataModel(name, dataModelLocation);
    });
  }
  dataModelResourceLocations[ dataModelName ] = dataModelDefaultLocation(dataModelLocation, false);
};

var locationIsRegisteredForDataModel = fw.dataModels.locationIsRegistered = function(dataModelName) {
  return !isUndefined(dataModelResourceLocations[dataModelName]);
};

// Return the viewModel resource definition for the supplied dataModelName
var getDataModelResourceLocation = fw.dataModels.getResourceLocation = function(dataModelName) {
  if( isUndefined(dataModelName) ) {
    return dataModelResourceLocations;
  }
  return dataModelResourceLocations[dataModelName] || defaultDataModelLocation;
};
