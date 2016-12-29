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

  if (isPromise(theRequest)) {
    theRequest.then(function () {
      requestFinished(true);
    });
  }

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

  var urlPieces;
  var configParams = concern[privateDataSymbol].configParams;

  var method;
  var url = resultBound(configParams, 'url', concern);
  if (_.isObject(url)) {
    // user is explicitly defining the individual request url or method+url
    var requestAction = resultBound(url, action, concern, [action, options]);
    if (_.isString(requestAction)) {
      if (requestAction.indexOf(' ') !== -1) {
        // method url
        requestAction = requestAction.split(' ');
        method = requestAction[0];
        url = requestAction[1];
      } else {
        // url
        method = methodMap[action];
        url = requestAction;
      }
    }
  } else if (_.isString(url)) {
    // string specified, use the default method for this action and url
    method = methodMap[action];
    if (!_.isString(method)) {
      throw Error('Invalid method resolved for ' + action + ' sync operation');
    }

    // add the :id to the url if needed
    if (fw.isDataModel(concern) && _.includes(['read', 'update', 'delete'], action)) {
      urlPieces = url.split('?');
      var urlRoute = urlPieces.shift();
      var queryString = urlPieces.length ? '?' + urlPieces.join('?') : '';
      url = urlRoute.replace(trailingSlashRegex, '') + '/:' + configParams.idAttribute + queryString;
    }
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
    resultBound(fw, 'fetchOptions', concern, [action, concern, options]) || {},
    resultBound(configParams, 'fetchOptions', concern, [action, concern, options]) || {},
    options || {});

  if (_.isNull(options.body) && _.includes(['create', 'update'], action)) {
    options.headers['content-type'] = 'application/json';
    options.body = JSON.stringify(options.attrs || concern.get());
  }

  var promise = makePromiseQueryable(fetch(url, options));

  var requestNotice = { url: url, request: promise, options: options };
  requestNotice[fw.isDataModel(concern) ? 'dataModel' : 'collection'] = concern;
  concern.$namespace.publish('_.request', requestNotice);

  return promise;
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
      if (response.ok) {
        var json;
        try {
          json = response.clone().json();
        } catch(e) {}
        return json;
      }
    });
}

fw.fetchOptions = {};
fw.sync = sync;

module.exports = {
  makeOrGetRequest: makeOrGetRequest,
  handleJsonResponse: handleJsonResponse,
  makePromiseQueryable: makePromiseQueryable
}
