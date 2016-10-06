var resultBound = require('./util').resultBound;
var isCollection = require('../collection/collection-tools').isCollection;

// Map from CRUD to HTTP for our default `fw.sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch':  'PATCH',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http[s]*:\/\/[a-zA-Z0-9:\.]*)*([\/]{0,1}[\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/g;

function noURLError() {
  throw new Error('A "url" property or function must be specified');
};

module.exports = function sync(action, concern, params) {
  throw new Error('TODO: This needs to be refactored with fetch()');
  // params = params || {};
  // action = action || 'noAction';

  // if(!isDataModel(concern) && !isCollection(concern)) {
  //   throw new Error('Must supply a dataModel or collection to fw.sync()');
  // }

  // var configParams = concern.__private('configParams');
  // var options = _.extend({
  //   type: methodMap[action],
  //   dataType: 'json',
  //   url: null,
  //   data: null,
  //   headers: {},
  //   emulateHTTP: fw.settings.emulateHTTP,
  //   emulateJSON: fw.settings.emulateJSON
  // }, resultBound(configParams, 'ajaxOptions', concern, [params]) || {}, params);

  // if(!_.isString(options.type)) {
  //   throw new Error('Invalid action (' + action + ') specified for sync operation');
  // }

  // var url = options.url;
  // if(_.isNull(url)) {
  //   url = configParams.url;
  //   if(_.isFunction(url)) {
  //     url = url.call(concern, action);
  //   } else if(!_.isString(url)) {
  //     var thing = (isDataModel(concern) && 'dataModel') || (isCollection(concern) && 'collection') || 'UNKNOWN';
  //     throw new Error('Must provide a URL for/on a ' + thing + ' configuration in order to call .sync() on it');
  //   }

  //   if(isDataModel(concern)) {
  //     var pkIsSpecifiedByUser = !_.isNull(url.match(':' + configParams.idAttribute));
  //     var hasQueryString = !_.isNull(url.match(/\?/));
  //     if(_.includes(['read', 'update', 'patch', 'delete'], action) && configParams.useKeyInUrl && !pkIsSpecifiedByUser && !hasQueryString) {
  //       // need to append /:id to url
  //       url = url.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute;
  //     }
  //   }
  // }

  // var urlPieces = (url || noURLError()).match(parseURLRegex);
  // if(!_.isNull(urlPieces)) {
  //   var baseURL = urlPieces[1] || '';
  //   options.url = baseURL + _.last(urlPieces);
  // } else {
  //   options.url = url;
  // }

  // if(isDataModel(concern)) {
  //   // replace any interpolated parameters
  //   var urlParams = options.url.match(parseParamsRegex);
  //   if(urlParams) {
  //     _.each(urlParams, function(param) {
  //       options.url = options.url.replace(param, concern.get(param.substr(1)));
  //     });
  //   }
  // }

  // if(_.isNull(options.data) && concern && _.includes(['create', 'update', 'patch'], action)) {
  //   options.contentType = 'application/json';
  //   options.data = JSON.stringify(options.attrs || concern.get());
  // }

  // // For older servers, emulate JSON by encoding the request into an HTML-form.
  // if(options.emulateJSON) {
  //   options.contentType = 'application/x-www-form-urlencoded';
  //   options.data = options.data ? { model: options.data } : {};
  // }

  // // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // // And an `X-HTTP-Method-Override` header.
  // if(options.emulateHTTP && _.includes(['PUT', 'DELETE', 'PATCH'], options.type)) {
  //   options.type = 'POST';

  //   if(options.emulateJSON) {
  //     options.data._method = options.type;
  //   }
  //   _.extend(options.headers, { 'X-HTTP-Method-Override': options.type });
  // }

  // // Don't process data on a non-GET request.
  // if(options.type !== 'GET' && !options.emulateJSON) {
  //   options.processData = false;
  // }

  // // Pass along `textStatus` and `errorThrown` from jQuery.
  // var error = options.error;
  // options.error = function(xhr, textStatus, errorThrown) {
  //   options.textStatus = textStatus;
  //   options.errorThrown = errorThrown;
  //   if (error) error.call(options.context, xhr, textStatus, errorThrown);
  // };

  // var xhr = options.xhr = fw.ajax(options);
  // concern.$namespace.publish('_.request', { dataModel: concern, xhr: xhr, options: options });
  // return xhr;
};
