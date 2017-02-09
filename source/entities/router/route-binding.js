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
      state: function defaultStateForRoute () { return element.getAttribute('href'); },
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
      routeHandlerDescription.state = routeParams;
    } else if (_.isObject(routeParams)) {
      _.extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionState = routeHandlerDescription.state;
    if (!_.isFunction(routeHandlerDescriptionState)) {
      routeHandlerDescription.state = function () { return routeHandlerDescriptionState; };
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
      var routeState = routeHandlerDescription.state();
      var configParams = router[privateDataSymbol].configParams;

      hashOnly = !!routeState.match(startingHashRegex);

      if (element.tagName.toLowerCase() === 'a') {
        element.href = configParams.baseRoute + routeState;
      }

      if (_.isObject(stateTracker) && _.isFunction(stateTracker.dispose)) {
        stateTracker.dispose();
      }
      stateTracker = router.currentRoute.subscribe(_.partial(checkForMatchingRoute, routeState));

      if (elementIsSetup === false) {
        elementIsSetup = true;
        checkForMatchingRoute(routeState);

        fw.utils.registerEventHandler(element, resultBound(routeHandlerDescription, 'on', router), function (event) {
          var currentRouteState = routeHandlerDescription.state();
          var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteState);
          if (handlerResult) {
            if (_.isString(handlerResult)) {
              currentRouteState = handlerResult;
            }
            if (_.isString(currentRouteState) && !isFullURL(currentRouteState)) {
              router[resultBound(routeHandlerDescription, 'history', router) + 'State'](currentRouteState);
            }
          }
          return true;
        });
      }
    }

    if (fw.isObservable(routeHandlerDescription.state)) {
      router.disposeWithInstance(routeHandlerDescription.state.subscribe(setUpElement));
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
