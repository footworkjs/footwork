var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var resultBound  = util.resultBound;
var removeClass = util.removeClass;
var addClass = util.addClass;
var hasClass = util.hasClass;
var privateDataSymbol = util.getSymbol('footwork');

var routerTools = require('./router-tools');
var nearestParentRouter = routerTools.nearestParentRouter;
var stripQueryStringAndFragment = routerTools.stripQueryStringAndFragment;

var startingHashRegex = /^#/;
var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var isFullURL = fw.utils.isFullURL = function (thing) {
  return _.isString(thing) && isFullURLRegex.test(thing);
};

fw.bindingHandlers.route = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var router = nearestParentRouter(bindingContext);
    var routeParams = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      url: function defaultURLForRoute () { return element.getAttribute('href'); },
      activeClass: fw.router.activeClass,
      history: 'push',
      handler: function defaultHandlerForRouteBinding (event, url) {
        /* istanbul ignore else */
        if (!hashOnly && !isFullURL(url) && event.which !== 2) {
          event.preventDefault();
          return true;
        } else {
          return false;
        }
      }
    };

    if (_.isFunction(routeParams) || _.isString(routeParams)) {
      routeHandlerDescription.url = routeParams;
    } else if (_.isObject(routeParams)) {
      _.extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if (!_.isFunction(routeHandlerDescriptionURL)) {
      routeHandlerDescription.url = function () { return routeHandlerDescriptionURL; };
    }

    function checkForMatchingRoute (myRoute) {
      var currentState = stripQueryStringAndFragment(router.currentState());
      var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', router);

      if (activeRouteClassName) {
        if (myRoute === currentState) {
          addClass(element, activeRouteClassName);
        } else {
          removeClass(element, activeRouteClassName);
        }
      }
    }

    function setUpElement () {
      var routeUrl = routeHandlerDescription.url();
      var configParams = router[privateDataSymbol].configParams;

      hashOnly = !!routeUrl.match(startingHashRegex);

      if (element.tagName.toLowerCase() === 'a') {
        element.href = configParams.baseRoute + routeUrl;
      }

      if (_.isObject(stateTracker) && _.isFunction(stateTracker.dispose)) {
        stateTracker.dispose();
      }
      stateTracker = router.currentRoute.subscribe(_.partial(checkForMatchingRoute, routeUrl));

      if (elementIsSetup === false) {
        elementIsSetup = true;
        checkForMatchingRoute(routeUrl);

        fw.utils.registerEventHandler(element, resultBound(routeHandlerDescription, 'on', router), function (event) {
          var currentRouteURL = routeHandlerDescription.url();
          var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteURL);
          if (handlerResult) {
            if (_.isString(handlerResult)) {
              currentRouteURL = handlerResult;
            }
            if (_.isString(currentRouteURL) && !isFullURL(currentRouteURL)) {
              router[resultBound(routeHandlerDescription, 'history', router) + 'State'](currentRouteURL);
            }
          }
          return true;
        });
      }
    }

    if (fw.isObservable(routeHandlerDescription.url)) {
      router.disposeWithInstance(routeHandlerDescription.url.subscribe(setUpElement));
    }
    setUpElement();

    /* istanbul ignore next */
    fw.utils.domNodeDisposal.addDisposeCallback(element, function () {
      if (_.isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};
