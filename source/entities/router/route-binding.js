var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var util = require('../../misc/util');
var hasPathStart = util.hasPathStart;
var hasHashStart = util.hasHashStart;
var resultBound  = util.resultBound;
var startingHashRegex = util.startingHashRegex;
var removeClass = util.removeClass;
var addClass = util.addClass;
var hasClass = util.hasClass;

var routerTools = require('./router-tools');
var nearestParentRouter = routerTools.nearestParentRouter;
var isNullRouter = routerTools.isNullRouter;

function findParentNode(element, selector) {
  if (selector === true) {
    return element.parentNode;
  }

  if (element.parentNode && _.isFunction(element.parentNode.querySelectorAll)) {
    var parentNode = element.parentNode;
    var matches = parentNode.querySelectorAll(selector);
    if (matches.length && _.includes(matches, element)) {
      return element;
    }
    return findParentNode(parentNode, selector);
  }

  return undefined;
}

var isFullURLRegex = /(^[a-z]+:\/\/|^\/\/)/i;
var isFullURL = fw.utils.isFullURL = function(thing) {
  return _.isString(thing) && isFullURLRegex.test(thing);
};

fw.bindingHandlers.$route = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $myRouter = nearestParentRouter(bindingContext);
    var routeParams = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      url: function defaultURLForRoute() { return element.getAttribute('href'); },
      addActiveClass: true,
      activeClass: null,
      parentHasState: false,
      handler: function defaultHandlerForRouteBinding(event, url) {
        if (hashOnly) {
          return false;
        }

        if (!isFullURL(url) && event.which !== 2) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    };

    if (_.isFunction(routeParams) || _.isString(routeParams)) {
      routeHandlerDescription.url = routeParams;
    } else if (_.isObject(routeParams)) {
      _.extend(routeHandlerDescription, routeParams);
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if (!_.isFunction(routeHandlerDescriptionURL)) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function getRouteURL(includeParentPath) {
      var parentRoutePath = '';
      var routeURL = routeHandlerDescription.url();
      var myLinkPath = routeURL || '';

      if (!_.isNull(routeURL)) {
        if (_.isUndefined(routeURL)) {
          routeURL = myLinkPath;
        }

        if (!isFullURL(myLinkPath)) {
          if (!hasPathStart(myLinkPath)) {
            var currentRoute = $myRouter.currentRoute();
            if (hasHashStart(myLinkPath)) {
              if (!_.isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + myLinkPath;
              }
              hashOnly = true;
            } else {
              // relative url, prepend current segment
              if (!_.isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + '/' + myLinkPath;
              }
            }
          }

          if (includeParentPath && !isNullRouter($myRouter)) {
            myLinkPath = $myRouter.__private('parentRouter')().path() + myLinkPath;
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = getRouteURL.bind(null, true);
    var routeURLWithoutParentPath = getRouteURL.bind(null, false);

    function checkForMatchingSegment(mySegment, newRoute) {
      if (_.isString(mySegment)) {
        var currentRoute = $myRouter.currentRoute();
        var elementWithState = routeHandlerDescription.parentHasState ? findParentNode(element, routeHandlerDescription.parentHasState) : element;
        var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', $myRouter) || fw.router.activeRouteClassName();
        mySegment = mySegment.replace(startingHashRegex, '/');

        if (_.isObject(currentRoute)) {
          if (resultBound(routeHandlerDescription, 'addActiveClass', $myRouter)) {
            if (mySegment === '/') {
              mySegment = '';
            }

            if (!_.isNull(newRoute) && newRoute.segment === mySegment && _.isString(activeRouteClassName) && activeRouteClassName.length) {
              // newRoute.segment is the same as this routers segment...add the activeRouteClassName to the element to indicate it is active
              addClass(elementWithState, activeRouteClassName);
            } else if (hasClass(elementWithState, activeRouteClassName)) {
              removeClass(elementWithState, activeRouteClassName);
            }
          }
        }
      }

      if (_.isNull(newRoute)) {
        // No route currently selected, remove the activeRouteClassName from the elementWithState
        removeClass(elementWithState, activeRouteClassName);
      }
    };

    function setUpElement() {
      if (!isNullRouter($myRouter)) {
        var myCurrentSegment = routeURLWithoutParentPath();
        var routerConfig = $myRouter.__private('configParams');
        if (element.tagName.toLowerCase() === 'a') {
          element.href = routerConfig.baseRoute + routeURLWithParentPath();
        }

        if (_.isObject(stateTracker) && _.isFunction(stateTracker.dispose)) {
          stateTracker.dispose();
        }
        stateTracker = $myRouter.currentRoute.subscribe(checkForMatchingSegment.bind(null, myCurrentSegment));

        if (elementIsSetup === false) {
          elementIsSetup = true;
          checkForMatchingSegment(myCurrentSegment, $myRouter.currentRoute());

          $myRouter.__private('parentRouter').subscribe(setUpElement);
          fw.utils.registerEventHandler(element, resultBound(routeHandlerDescription, 'on', $myRouter), function(event) {
            var currentRouteURL = routeURLWithoutParentPath();
            var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteURL);
            if (handlerResult) {
              if (_.isString(handlerResult)) {
                currentRouteURL = handlerResult;
              }
              if (_.isString(currentRouteURL) && !isFullURL(currentRouteURL)) {
                $myRouter.setState(currentRouteURL);
              }
            }
            return true;
          });
        }
      }
    }

    if (fw.isObservable(routeHandlerDescription.url)) {
      $myRouter.__private('subscriptions').push(routeHandlerDescription.url.subscribe(setUpElement));
    }
    setUpElement();

    fw.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if (_.isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};
