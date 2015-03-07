// resource.js
// ------------------

function isRegistered(resourceName) {
  return !isUndefined( this[resourceName] );
};

function getRegistered(resourceName) {
  return this[resourceName];
};

function register(resourceName, resource) {
  this[resourceName] = resource;
};

//import("resource/component.js");
//import("resource/viewModel.js");
//import("resource/router.js");
