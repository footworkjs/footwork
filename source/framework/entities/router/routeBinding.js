// framework/entities/router/routeBinding.js
// -----------

fw.bindingHandlers.$route = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    var $myRouter = nearestParentRouter(bindingContext);
    var urlValue = valueAccessor();
    var elementIsSetup = false;
    var stateTracker = null;
    var hashOnly = null;

    var routeHandlerDescription = {
      on: 'click',
      url: function defaultURLForRoute() { return null; },
      addActiveClass: true,
      activeClass: null,
      handler: function defaultHandlerForRouteBinding(event, url) {
        if(hashOnly) {
          windowObject.location.hash = resultBound(routeHandlerDescription, 'url', $myRouter);
          return false;
        }

        if( !isFullURL(url) && event.which !== 2 ) {
          event.preventDefault();
          return true;
        }
        return false;
      }
    };

    if( isObservable(urlValue) || isFunction(urlValue) || isString(urlValue) ) {
      routeHandlerDescription.url = urlValue;
    } else if( isObject(urlValue) ) {
      extend(routeHandlerDescription, urlValue);
    } else if( !urlValue ) {
      routeHandlerDescription.url = element.getAttribute('href');
    } else {
      throw new Error('Unknown type of url value provided to $route [' + typeof urlValue + ']');
    }

    var routeHandlerDescriptionURL = routeHandlerDescription.url;
    if( !isFunction(routeHandlerDescriptionURL) ) {
      routeHandlerDescription.url = function() { return routeHandlerDescriptionURL; };
    }

    function getRouteURL(includeParentPath) {
      var parentRoutePath = '';
      var routeURL = routeHandlerDescription.url();
      var myLinkPath = routeURL || element.getAttribute('href') || '';

      if(!isNull(routeURL)) {
        if(isUndefined(routeURL)) {
          routeURL = myLinkPath;
        }

        if(!isFullURL(myLinkPath)) {
          if(!hasPathStart(myLinkPath)) {
            var currentRoute = $myRouter.currentRoute();
            if(hasHashStart(myLinkPath)) {
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + myLinkPath;
              }
              hashOnly = true;
            } else {
              // relative url, prepend current segment
              if(!isNull(currentRoute)) {
                myLinkPath = $myRouter.currentRoute().segment + '/' + myLinkPath;
              }
            }
          }

          if(includeParentPath && !isNullRouter($myRouter)) {
            myLinkPath = $myRouter.__private('parentRouter')().path() + myLinkPath;
          }

          if(fw.router.html5History() === false) {
            myLinkPath = '#' + (myLinkPath.indexOf('/') === 0 ? myLinkPath.substring(1) : myLinkPath);
          }
        }

        return myLinkPath;
      }

      return null;
    };
    var routeURLWithParentPath = getRouteURL.bind(null, true);
    var routeURLWithoutParentPath = getRouteURL.bind(null, false);

    function checkForMatchingSegment(mySegment, newRoute) {
      if(isString(mySegment)) {
        var currentRoute = $myRouter.currentRoute();
        mySegment = mySegment.replace(startingHashRegex, '/');

        if(isObject(currentRoute)) {
          if(resultBound(routeHandlerDescription, 'addActiveClass', $myRouter)) {
            var activeRouteClassName = resultBound(routeHandlerDescription, 'activeClass', $myRouter) || fw.router.activeRouteClassName();
            if(mySegment === '/') {
              mySegment = '';
            }

            if(!isNull(newRoute) && newRoute.segment === mySegment && isString(activeRouteClassName) && activeRouteClassName.length) {
              // newRoute.segment is the same as this routers segment...add the activeRouteClassName to the element to indicate it is active
              addClass(element, activeRouteClassName);
            } else if( hasClass(element, activeRouteClassName) ) {
              removeClass(element, activeRouteClassName);
            }
          }
        }
      }
    };

    function setUpElement() {
      var myCurrentSegment = routeURLWithoutParentPath();
      var routerConfig = $myRouter.__private('configParams');
      if( element.tagName.toLowerCase() === 'a' ) {
        element.href = (fw.router.html5History() ? '' : '/') + routerConfig.baseRoute + routeURLWithParentPath();
      }

      if( isObject(stateTracker) ) {
        stateTracker.dispose();
      }
      stateTracker = $myRouter.currentRoute.subscribe( checkForMatchingSegment.bind(null, myCurrentSegment) );

      if(elementIsSetup === false) {
        elementIsSetup = true;
        checkForMatchingSegment(myCurrentSegment, $myRouter.currentRoute());

        $myRouter.__private('parentRouter').subscribe(setUpElement);
        fw.utils.registerEventHandler(element, routeHandlerDescription.on, function(event) {
          var currentRouteURL = routeURLWithoutParentPath();
          var handlerResult = routeHandlerDescription.handler.call(viewModel, event, currentRouteURL);
          if(handlerResult) {
            if(isString(handlerResult)) {
              currentRouteURL = handlerResult;
            }
            if(isString(currentRouteURL) && !isFullURL(currentRouteURL)) {
              $myRouter.setState( currentRouteURL );
            }
          }
          return true;
        });
      }
    }

    if(isObservable(routeHandlerDescription.url)) {
      $myRouter.__private('subscriptions').push( routeHandlerDescription.url.subscribe(setUpElement) );
    }
    setUpElement();

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      if(isObject(stateTracker)) {
        stateTracker.dispose();
      }
    });
  }
};
