var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('./util');
var resultBound = util.resultBound;
var promiseIsFulfilled = util.promiseIsFulfilled;
var isPromise = util.isPromise;
var privateDataSymbol = util.getSymbol('footwork');

// Map from CRUD to REST for our default implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'delete': 'DELETE',
  'read':   'GET'
};

var parseURLRegex = /^(http[s]*:\/\/[a-zA-Z0-9:\.]*)*([\/]{0,1}[\w\.:\/-]*)$/;
var parseParamsRegex = /(:[\w\.]+)/g;
var trailingSlashRegex = /\/$/;

/**
 * Creates or returns a promise based on the request specified in requestInfo.
 * This function also manages a requestRunning observable on the entity which indicates when the request finishes.
 * Note that there is an optional requestLull which will make the requestRunning observable stay 'true' for
 * atleast the specified duration. If multiple requests are in progress, then it will wait for all to finish.
 *
 * @param  {string} operationType The type of operation being made, used as key to cache running requests
 * @param  {object} requestInfo   Description of the request to make including a createRequest callback to make a new request
 * @return {Promise}              Ajax Promise
 */
function makeOrGetRequest (operationType, requestInfo) {
  var requestRunning = requestInfo.requestRunning;
  var requestLull = requestInfo.requestLull;
  var entity = requestInfo.entity;
  var theRequest = requestInfo.createRequest();

  if (!isPromise(theRequest)) {
    // returned value from createRequest() is a value not a promise, lets return the value in a promise
    theRequest = Promise.resolve(theRequest);
  }
  theRequest = makePromiseQueryable(theRequest);

  requestRunning(true);

  var lullFinished = fw.observable(false);
  var requestFinished = fw.observable(false);
  var requestWatcher = fw.computed(function () {
    if (lullFinished() && requestFinished()) {
      requestRunning(false);
      requestWatcher.dispose();
    }
  });

  requestLull = (_.isFunction(requestLull) ? requestLull.call(entity, operationType) : requestLull);
  if (requestLull) {
    setTimeout(function () {
      lullFinished(true);
    }, requestLull);
  } else {
    lullFinished(true);
  }

  theRequest.then(function () {
    requestFinished(true);
  });

  return theRequest;
}

/**
 * Create an xmlhttprequest based on the desired action (read/write/etc), concern (dataModel/collection), and optional params.
 *
 * @param {string} action
 * @param {object} concern
 * @param {object} options
 * @returns {object} htr
 */
function sync (action, concern, options) {
  if (!fw.isDataModel(concern) && !fw.isCollection(concern)) {
    throw Error('Must supply a dataModel or collection to sync');
  }

  if (concern[privateDataSymbol][action]) {
    concern[privateDataSymbol][action].replaced = true;
  }

  var configParams = concern[privateDataSymbol].configParams;
  var url = resultBound(configParams, 'url', concern);

  if (_.isObject(url) && !_.isFunction(url)) {
    // user is explicitly defining the individual request url or method+url
    url = resultBound(url, action, concern, [options]);
  } else if (_.isString(url) || _.isFunction(url)) {
    url = _.isFunction(url) ? url.call(concern, action, options) : url;

    // add the :id to the url if needed
    if (fw.isDataModel(concern) && _.includes(['read', 'update', 'delete'], action) && url) {
      var urlPieces = url.split('?');
      var urlRoute = urlPieces.shift();
      var queryString = urlPieces.length ? '?' + urlPieces.join('?') : '';
      url = urlRoute.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute + queryString;
    }
  }

  var method;
  if (_.isString(url) && url.indexOf(' ') !== -1) {
    // address in form of: 'method url'
    url = url.split(' ');
    method = url[0];
    url = url[1];
  } else {
    method = methodMap[action];
  }

  if (!_.isString(method)) {
    throw Error('Invalid method resolved for ' + action + ' sync operation');
  }

  if (!_.isString(url)) {
    throw Error('A url must be specified for ' + action + ' sync operation');
  }

  // replace any interpolated parameters
  if (fw.isDataModel(concern)) {
    var urlParams = url.match(parseParamsRegex);
    if (urlParams) {
      _.each(urlParams, function (param) {
        url = url.replace(param, concern.get(param.substr(1)));
      });
    }
  }

  // construct the fetch options object
  options = _.extend({
      method: method.toUpperCase(),
      body: null,
      headers: {}
    },
    resultBound(fw.options, 'fetchOptions', concern, [action, concern, options]) || {},
    resultBound(configParams, 'fetchOptions', concern, [action, concern, options]) || {},
    options || {});

  if (_.isNull(options.body) && _.includes(['create', 'update'], action)) {
    options.headers['content-type'] = 'application/json';
    options.body = JSON.stringify(options.attrs || concern.get());
  }

  concern[privateDataSymbol][action] = makePromiseQueryable(fetch(url, options));
  return concern[privateDataSymbol][action];
};

/**
 * Place isFulfilled hook onto a promise which can be used to syncronously determine a promises state.
 *
 * @param {promise} promise
 * @returns {promise} the instrumented promise
 */
function makePromiseQueryable (promise) {
  if (promise.isFulfilled) {
    return promise;
  }

  var isResolved = false;
  var isRejected = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) { isResolved = true; return v; },
    function (e) { isRejected = true; throw e; });
  result.isFulfilled = function () { return isResolved || isRejected; };
  return result;
}

/**
 * Take a fetch'd xmlhttprequest and handle the response. Takes into account valid 200-299 response codes.
 * Also handles parse errors in the response which is supposed to be valid JSON.
 *
 * @param {object} xhr
 * @returns {object} xhr with parsed JSON response result
 */
function handleJsonResponse (xhr) {
  return xhr.then(function (response) {
      if (response.ok && !xhr.replaced) {
        var json;
        try {
          json = response.clone().json();
        } catch(e) {}
        return json;
      }
    });
}

fw.options.fetchOptions = {};
fw.sync = sync;

module.exports = {
  makeOrGetRequest: makeOrGetRequest,
  handleJsonResponse: handleJsonResponse,
  makePromiseQueryable: makePromiseQueryable
}
