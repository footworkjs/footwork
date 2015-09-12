'use strict';

var sandbox = document.getElementById('sandbox');

describe('router', function () {
  it('has the ability to create a router', function() {
    var routerInitialized = false;

    expect(fw.router).to.be.a('function');

    var routerConstructor = fw.router({
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerConstructor).to.be.a('function');
    expect(new routerConstructor()).to.be.an('object');
  });

  it('has the ability to create a router with a correctly defined namespace whos name we can retrieve', function() {
    var Router = fw.router({
      namespace: 'RouterNamespaceCheck'
    });
    var router = new Router();

    expect(router.$namespace).to.be.an('object');
    expect(router.$namespace.getName()).to.be('RouterNamespaceCheck');
  });

  it('can register a router', function() {
    expect( fw.routers.isRegistered('registeredRouterCheck') ).to.be(false);

    fw.routers.register('registeredRouterCheck', function() {});

    expect( fw.routers.isRegistered('registeredRouterCheck') ).to.be(true);
  });

  it('can get a registered router', function() {
    expect( fw.routers.isRegistered('registeredRouterRetrieval') ).to.be(false);

    var RegisteredRouterRetrieval = function() {};

    fw.routers.register('registeredRouterRetrieval', RegisteredRouterRetrieval);

    expect( fw.routers.isRegistered('registeredRouterRetrieval') ).to.be(true);
    expect( fw.routers.getRegistered('registeredRouterRetrieval') ).to.be(RegisteredRouterRetrieval);
  });

  it('can autoRegister a router', function() {
    expect( fw.routers.isRegistered('autoRegisteredRouter') ).to.be(false);

    var autoRegisteredRouter = fw.router({
      namespace: 'autoRegisteredRouter',
      autoRegister: true
    });

    expect( fw.routers.isRegistered('autoRegisteredRouter') ).to.be(true);
    expect( fw.routers.getRegistered('autoRegisteredRouter') ).to.be(autoRegisteredRouter);
  });

  it('can get all instantiated routers', function() {
    var RouterA = fw.router({ namespace: 'RouterA' });
    var RouterB = fw.router({ namespace: 'RouterB' });

    var routers = [ new RouterA(), new RouterB() ];
    var routerList = _.keys( fw.routers.getAll() );

    expect( routerList ).to.contain('RouterA');
    expect( routerList ).to.contain('RouterB');
  });

  it('can get all instantiated routers of a specific namespace', function() {
    var routers = [];
    var Router = fw.router({ namespace: 'getAllSpecificRouter' });
    var numToMake = _.random(1,15);

    for(var x = numToMake; x; x--) {
      routers.push( new Router() );
    }

    expect( fw.routers.getAll('getAllSpecificRouter').filter(function(instance) {
      return instance.$namespace.getName() === 'getAllSpecificRouter';
    }).length ).to.be(numToMake);
  });

  it('can be instantiated with a list of routes', function() {
    var routesList = [ '/', '/route1', '/route2' ];

    var Router = fw.router({
      namespace: 'instantiatedListOfRoutes',
      routes: _.map(routesList, function(routePath) {
        return { route: routePath };
      })
    });

    var router = new Router();

    expect( _.reduce(router.routeDescriptions, function(routeDescriptions, routeDesc) {
      if( routesList.indexOf(routeDesc.route) !== -1 ) {
        routeDescriptions.push(routeDesc);
      }
      return routeDescriptions;
    }, []).length ).to.be( routesList.length );
  });

  it('can trigger beforeRoute with appropriate (filled in) url', function() {
    var Router = fw.router({
      namespace: 'instantiatedListOfRoutes',
      beforeRoute: function(url) {
        beforeRouteRan = true;
        expect(url).to.be('/with/1/param');
      },
      routes: [
        {
          name: 'withParam',
          route: '/with/:num/param'
        }
      ]
    });

    var beforeRouteRan = false;
    var router = new Router();

    expect(beforeRouteRan).to.be(false);
    router.setState('/with/1/param');
    expect(beforeRouteRan).to.be(true);
  });

  it('can trigger named route with appropriately filled in data', function() {
    var beforeRouteRan = false;
    var activated = false;

    var Router = fw.router({
      namespace: 'instantiatedListOfRoutes',
      beforeRoute: function(url) {
        if(activated) {
          beforeRouteRan = true;
          expect(url).to.be('/with/1/param');
        }
      },
      routes: [
        {
          name: 'withParam',
          route: '/with/:num/param'
        }
      ]
    });

    var router = new Router();
    router.activate();
    activated = true;

    expect(beforeRouteRan).to.be(false);
    router.setState('withParam', { num: 1 });
    expect(beforeRouteRan).to.be(true);
  });

  it('can be instantiated with a list of named routes and then matched against that name or set of names', function() {
    var Router = fw.router({
      namespace: 'instantiatedListOfRoutes',
      routes: [
        {
          name: 'home',
          route: '/'
        },
        {
          name: 'underHome',
          route: '/under-home'
        },
        {
          name: 'withParam',
          route: '/with/:num/param'
        }
      ]
    });

    var router = new Router();

    expect(router.matchesRoute('home', '/')).to.be(true);
    expect(router.matchesRoute('underHome', '/under-home')).to.be(true);
    expect(router.matchesRoute('withParam', '/with/123/param')).to.be(true);
    expect(router.matchesRoute(['withParam', 'underHome'], '/with/123/param')).to.be(true);
  });

  it('can be instantiated declaratively from an autoRegistered router', function(done) {
    var container = document.getElementById('declarativeRouterInstantiation');
    var wasInitialized = false;

    fw.router({
      namespace: 'declarativeRouterInstantiation',
      autoRegister: true,
      initialize: function() {
        wasInitialized = true;
      }
    });

    expect(wasInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(wasInitialized).to.be(true);
      done();
    }, 40);
  });

  it('calls afterBinding after initialize with the correct target element when creating and binding a new instance', function() {
    var initializeWasCalledFirst = false;
    var afterBindingWasCalledSecond = false;
    var containerIsTheSame = false;
    var container = document.getElementById('afterBindingRouter');

    var Router = fw.router({
      namespace: 'Router',
      initialize: function() {
        if(!afterBindingWasCalledSecond) {
          initializeWasCalledFirst = true;
        }
      },
      afterBinding: function(containingElement) {
        if(initializeWasCalledFirst) {
          afterBindingWasCalledSecond = true;
        }
        if(containingElement === container) {
          containerIsTheSame = true;
        }
      }
    });

    var router = new Router();
    fw.applyBindings(router, container);

    expect(afterBindingWasCalledSecond).to.be(true);
    expect(containerIsTheSame).to.be(true);
  });

  it('has the animation classes applied properly', function(done) {
    var wasInitialized = false;
    var container = document.getElementById('afterBindingRouterAnimation');
    var afterBindingCalled = false;
    var theElement;

    fw.router({
      namespace: 'afterBindingRouterAnimation',
      autoRegister: true,
      initialize: function() {
        wasInitialized = true;
      },
      afterBinding: function(element) {
        afterBindingCalled = true;
        theElement = element;
        expect(theElement.className.indexOf('fw-entity-bound')).to.be(-1);
      }
    });

    expect(afterBindingCalled).to.be(false);
    expect(wasInitialized).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(afterBindingCalled).to.be(true);
      expect(wasInitialized).to.be(true);
      setTimeout(function() {
        expect(theElement.className.indexOf('fw-entity-bound')).to.be.greaterThan(-1);
        done();
      }, 100);
    }, 0);
  });

  it('can be nested and initialized declaratively', function(done) {
    var container = document.getElementById('declarativeNestedRouterInstantiation');
    var outerWasInitialized = false;
    var innerWasInitialized = false;

    fw.router({
      namespace: 'declarativeNestedRouterInstantiationOuter',
      autoRegister: true,
      initialize: function() {
        outerWasInitialized = true;
      }
    });

    fw.router({
      namespace: 'declarativeNestedRouterInstantiationInner',
      autoRegister: true,
      initialize: function() {
        innerWasInitialized = true;
      }
    });

    expect(outerWasInitialized).to.be(false);
    expect(innerWasInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(outerWasInitialized).to.be(true);
      expect(innerWasInitialized).to.be(true);
      done();
    }, 40);
  });

  it('can trigger the default route', function(done) {
    var container = document.getElementById('defaultRouteCheck');
    var defaultRouteRan = false;

    fw.router({
      namespace: 'defaultRouteCheck',
      autoRegister: true,
      routes: [
        {
          route: '/',
          controller: function() {
            defaultRouteRan = true;
          }
        }
      ]
    });

    expect(defaultRouteRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(defaultRouteRan).to.be(true);
      done();
    }, 40);
  });

  it('can trigger the unknownRoute', function(done) {
    var container = document.getElementById('unknownRouteCheck');
    var unknownRan = false;
    var router;

    fw.router({
      namespace: 'unknownRouteCheck',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      unknownRoute: {
        controller: function() {
          unknownRan = true;
        }
      }
    });

    expect(unknownRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/unknownRouteCheck');
      expect(unknownRan).to.be(true);
      done();
    }, 40);
  });

  it('can trigger a specified route', function(done) {
    var container = document.getElementById('specifiedRouteCheck');
    var specifiedRouteRan = false;
    var router;

    fw.router({
      namespace: 'specifiedRouteCheck',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/specifiedRoute',
          controller: function() {
            specifiedRouteRan = true;
          }
        }
      ]
    });

    expect(specifiedRouteRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/specifiedRoute');
      expect(specifiedRouteRan).to.be(true);
      done();
    }, 40);
  });

  it('can trigger a specified route that is defined within an array of route strings', function(done) {
    var container = document.getElementById('specifiedRouteArrayCheck');
    var specifiedRouteRan = false;
    var router;

    fw.router({
      namespace: 'specifiedRouteArrayCheck',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: [ '/specifiedArrayRoute', '/specifiedArrayRoute2' ],
          controller: function() {
            specifiedRouteRan = true;
          }
        }
      ]
    });

    expect(specifiedRouteRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/specifiedArrayRoute2');
      expect(specifiedRouteRan).to.be(true);
      done();
    }, 40);
  });

  it('can trigger a specified route with a required parameter', function(done) {
    var container = document.getElementById('specifiedRouteWithReqParamCheck');
    var specifiedRouteRan = false;
    var testParam = 'luggageCode12345';
    var router;

    fw.router({
      namespace: 'specifiedRouteWithReqParamCheck',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/specifiedRoute/:testParam',
          controller: function(passedTestParam) {
            expect(passedTestParam).to.be(testParam);
            specifiedRouteRan = true;
          }
        }
      ]
    });

    expect(specifiedRouteRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/specifiedRoute/' + testParam);
      expect(specifiedRouteRan).to.be(true);
      done();
    }, 40);
  });

  it('can trigger a specified route with an optional parameter with and without the parameter', function(done) {
    var container = document.getElementById('specifiedRouteWithOptParamCheck');
    var optParamNotSupplied = false;
    var optParamSupplied = false;
    var testParam = 'luggageCode12345';
    var router;

    fw.router({
      namespace: 'specifiedRouteWithOptParamCheck',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/specifiedRoute/optParamNotSupplied(/:testParam)',
          controller: function(testParam) {
            expect(testParam).to.be(undefined);
            optParamNotSupplied = true;
          }
        }, {
          route: '/specifiedRoute/optParamSupplied(/:testParam)',
          controller: function(passedTestParam) {
            expect(passedTestParam).to.be(testParam);
            optParamSupplied = true;
          }
        }
      ]
    });

    expect(optParamNotSupplied).to.be(false);
    expect(optParamSupplied).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/specifiedRoute/optParamNotSupplied');
      router.setState('/specifiedRoute/optParamSupplied/' + testParam);
      expect(optParamNotSupplied).to.be(true);
      expect(optParamSupplied).to.be(true);
      done();
    }, 40);
  });

  it('can manipulate an outlet', function(done) {
    var container = document.getElementById('manipulateOutlet');
    var controllerRan = false;
    var componentInstantiated = false;
    var router;

    fw.components.register('manipulateOutletComponent', {
      viewModel: function() {
        componentInstantiated = true;
      },
      template: '<div></div>'
    });

    fw.router({
      namespace: 'manipulateOutlet',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/manipulateOutlet',
          controller: function() {
            controllerRan = true;
            this.$outlet('output', 'manipulateOutletComponent');
          }
        }
      ]
    });

    expect(controllerRan).to.be(false);
    expect(componentInstantiated).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/manipulateOutlet');
      expect(controllerRan).to.be(true);

      setTimeout(function() {
        expect(componentInstantiated).to.be(true);
        done();
      }, 40);
    }, 40);
  });

  it('can see all/multiple referenced outlets defined in its context', function(done) {
    var container = document.getElementById('outletRefCheck');
    var routerInstantiated = false;
    var router;

    fw.router({
      namespace: 'outletRefCheck',
      autoRegister: true,
      initialize: function() {
        routerInstantiated = true;
        router = this;
      }
    });

    expect(routerInstantiated).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(routerInstantiated).to.be(true);
      expect(_.keys(router.outlets)).to.eql([ 'output1', 'output2', 'output3' ]);
      done();
    }, 40);
  });

  it('can have callback triggered after outlet component is resolved and composed', function(done) {
    var container = document.getElementById('outletCallback');
    var controllerRan = false;
    var componentInstantiated = false;
    var outletCallbackRan = false;
    var router;

    fw.components.register('outletCallbackComponent', {
      viewModel: function() {
        componentInstantiated = true;
      },
      template: '<div class="outletCallbackComponent"></div>'
    });

    fw.router({
      namespace: 'outletCallback',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/outletCallback',
          controller: function() {
            controllerRan = true;
            this.$outlet('output', 'outletCallbackComponent', function(element) {
              expect(element.tagName.toLowerCase()).to.be('outlet');
              expect(element.children[0].className).to.be('outletCallbackComponent');
              outletCallbackRan = true;
            });
          }
        }
      ]
    });

    expect(controllerRan).to.be(false);
    expect(componentInstantiated).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/outletCallback');
      expect(controllerRan).to.be(true);

      setTimeout(function() {
        expect(componentInstantiated).to.be(true);
        expect(outletCallbackRan).to.be(true);
        done();
      }, 40);
    }, 40);
  });

  it('can instantiate and properly render an outlet after its router has initialized', function(done) {
    var container = document.getElementById('outletAfterRouter');
    var controllerRan = false;
    var componentInstantiated = false;
    var outletCallbackRan = false;
    var router;
    var viewModel;

    fw.components.register('outletAfterRouter', {
      viewModel: function() {
        componentInstantiated = true;
      },
      template: '<div class="outletAfterRouter"></div>'
    });

    fw.viewModels.register('outletAfterRouter', fw.viewModel({
      initialize: function() {
        viewModel = this;
        this.outletVisible = fw.observable(false);
      }
    }));

    fw.router({
      namespace: 'outletAfterRouter',
      autoRegister: true,
      initialize: function() {
        router = this;
      },
      routes: [
        {
          route: '/outletAfterRouter',
          controller: function() {
            controllerRan = true;
            this.$outlet('output', 'outletAfterRouter', function(element) {
              expect(element.tagName.toLowerCase()).to.be('outlet');
              expect(element.children[0].className).to.be('outletAfterRouter');
              outletCallbackRan = true;
            });
          }
        }
      ]
    });

    expect(controllerRan).to.be(false);
    expect(componentInstantiated).to.be(false);
    expect(outletCallbackRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      router.setState('/outletAfterRouter');

      expect(controllerRan).to.be(true);
      expect(viewModel).to.be.an('object');

      viewModel.outletVisible(true);

      setTimeout(function() {
        expect(componentInstantiated).to.be(true);
        expect(outletCallbackRan).to.be(true);
        done();
      }, 40);
    }, 40);
  });

  it('can display a temporary loading component in place of a component that is being downloaded', function(done) {
    var container = document.getElementById('outletLoaderTest');
    var outletLoaderTest = {
      outletLoaderTestLoading: false,
      outletLoaderTestLoaded: false,
      afterOutlet: false,
      routeHasRun: false
    };

    function router(name) {
      return fw.routers.getAll(name)[0];
    }

    fw.components.register('outletLoaderTestLoading', {
      viewModel: function() {
        outletLoaderTest.outletLoaderTestLoading = true;
      },
      template: '<div class="outletLoaderTestLoading"></div>',
      synchronous: true
    });

    fw.components.register('outletLoaderTestLoaded', {
      viewModel: function() {
        outletLoaderTest.outletLoaderTestLoaded = true;
      },
      template: '<div class="outletLoaderTestLoaded"></div>'
    });

    fw.router({
      namespace: 'outletLoaderTest',
      autoRegister: true,
      showDuringLoad: 'outletLoaderTestLoading',
      routes: [
        {
          route: '/outletLoaderTest',
          controller: function() {
            outletLoaderTest.routeHasRun = true;
            this.$outlet('output', 'outletLoaderTestLoaded', function(element) {
              outletLoaderTest.afterOutlet = true;
              expect(element.tagName.toLowerCase()).to.be('outlet');
              expect(element.children[0].className).to.be('outletLoaderTestLoaded');
            });
          }
        }
      ]
    });

    expect(_.every(outletLoaderTest)).to.be(false);
    fw.start(container);
    router('outletLoaderTest').setState('/outletLoaderTest');

    setTimeout(function() {
      expect(_.every(outletLoaderTest)).to.be(true);
      done();
    }, 150);
  });

  it('can display a temporary loading component (source from callback) in place of a component that is being downloaded', function(done) {
    var container = document.getElementById('outletLoaderTestCallback');
    var outletLoaderTest = {
      outletLoaderTestLoading: false,
      outletLoaderTestLoaded: false,
      afterOutlet: false,
      routeHasRun: false
    };

    function router(name) {
      return fw.routers.getAll(name)[0];
    }

    fw.components.register('outletLoaderTestCallbackLoading', {
      viewModel: function() {
        outletLoaderTest.outletLoaderTestLoading = true;
      },
      template: '<div class="outletLoaderTestCallbackLoading"></div>'
    });

    fw.components.register('outletLoaderTestCallbackLoaded', {
      viewModel: function() {
        outletLoaderTest.outletLoaderTestLoaded = true;
      },
      template: '<div class="outletLoaderTestCallbackLoaded"></div>'
    });

    var theRouter;
    fw.router({
      namespace: 'outletLoaderTestCallback',
      autoRegister: true,
      initialize: function() {
        theRouter = this;
      },
      showDuringLoad: function(outletName, componentToDisplay) {
        expect(this).to.be(theRouter);
        expect(outletName).to.be('output');
        expect(componentToDisplay).to.be('outletLoaderTestCallbackLoaded');
        return 'outletLoaderTestCallbackLoading';
      },
      routes: [
        {
          route: '/outletLoaderTestCallback',
          controller: function() {
            outletLoaderTest.routeHasRun = true;
            this.$outlet('output', 'outletLoaderTestCallbackLoaded', function(element) {
              outletLoaderTest.afterOutlet = true;
              expect(element.tagName.toLowerCase()).to.be('outlet');
              expect(element.children[0].className).to.be('outletLoaderTestCallbackLoaded');
            });
          }
        }
      ]
    });

    expect(_.every(outletLoaderTest)).to.be(false);
    fw.start(container);
    router('outletLoaderTestCallback').setState('/outletLoaderTestCallback');

    setTimeout(function() {
      expect(_.every(outletLoaderTest)).to.be(true);
      done();
    }, 150);
  });

  it('can have nested/child routers path be dependent on its parents', function(done) {
    var container = document.getElementById('nestedRouteDependency');
    var outerRouterInstantiated = false;
    var innerRouterInstantiated = false;
    var subInnerRouterInstantiated = false;

    fw.router({
      namespace: 'outerNestedRouteDependency',
      autoRegister: true,
      routes: [
        { route: '/' },
        { route: '/outerRoute' }
      ],
      initialize: function() {
        outerRouterInstantiated = true;
      }
    });

    fw.router({
      namespace: 'innerNestedRouteDependency',
      autoRegister: true,
      routes: [
        { route: '/' },
        { route: '/innerRoute' }
      ],
      initialize: function() {
        innerRouterInstantiated = true;
      }
    });

    fw.router({
      namespace: 'subInnerNestedRouteDependency',
      autoRegister: true,
      initialize: function() {
        subInnerRouterInstantiated = true;
      }
    });

    function router(name) {
      return fw.routers.getAll(name)[0];
    }

    expect(outerRouterInstantiated).to.be(false);
    expect(innerRouterInstantiated).to.be(false);
    expect(subInnerRouterInstantiated).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(outerRouterInstantiated).to.be(true);
      expect(innerRouterInstantiated).to.be(true);
      expect(subInnerRouterInstantiated).to.be(true);

      var outer = router('outerNestedRouteDependency');
      var inner = router('innerNestedRouteDependency');
      var subInner = router('subInnerNestedRouteDependency');

      expect(outer.path()).to.be('/');
      expect(inner.path()).to.be('//');
      expect(subInner.path()).to.be('///');

      outer.setState('/outerRoute');

      expect(outer.path()).to.be('/outerRoute');
      expect(inner.path()).to.be('/outerRoute/');
      expect(subInner.path()).to.be('/outerRoute//');

      inner.setState('/innerRoute');

      expect(outer.path()).to.be('/outerRoute');
      expect(inner.path()).to.be('/outerRoute/innerRoute');
      expect(subInner.path()).to.be('/outerRoute/innerRoute/');

      done();
    }, 40);
  });

  it('can have a nested/child router which is not relative to its parent', function(done) {
    var container = document.getElementById('nestedRouteNonRelative');
    var outerRouterInstantiated = false;
    var innerRouterInstantiated = false;

    fw.router({
      namespace: 'outerNestedRouteNonRelative',
      autoRegister: true,
      routes: [
        { route: '/' },
        { route: '/outerRoute' }
      ],
      initialize: function() {
        outerRouterInstantiated = true;
      }
    });

    fw.router({
      namespace: 'innerNestedRouteNonRelative',
      autoRegister: true,
      isRelative: false,
      routes: [
        { route: '/' },
        { route: '/outerRoute' }
      ],
      initialize: function() {
        innerRouterInstantiated = true;
      }
    });

    function router(name) {
      return fw.routers.getAll(name)[0];
    }

    expect(outerRouterInstantiated).to.be(false);
    expect(innerRouterInstantiated).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(outerRouterInstantiated).to.be(true);
      expect(innerRouterInstantiated).to.be(true);

      var outer = router('outerNestedRouteNonRelative');
      var inner = router('innerNestedRouteNonRelative');

      expect(outer.path()).to.be('/');
      expect(inner.path()).to.be('/');

      outer.setState('/outerRoute');

      expect(outer.path()).to.be('/outerRoute');
      expect(inner.path()).to.be('/outerRoute');

      done();
    }, 40);
  });

  it('can have a $route bound link correctly composed with an href attribute using passed in string route', function(done) {
    var container = document.getElementById('routeHrefBindingString');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingString',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingString',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    function router(name) {
      return fw.routers.getAll(name)[0];
    }

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect($link.attr('href')).to.be('/routeHrefBindingString');

      $link.click();
      expect(routeTouched).to.be(true);
      done();
    }, 40);
  });

  it('can have a $route bound link correctly composed using the elements existing href attribute', function(done) {
    var container = document.getElementById('routeHrefBindingHrefAttr');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingHrefAttr',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingHrefAttr',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    function router(name) {
      return fw.routers.getAll(name)[0];
    }

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect($link.attr('href')).to.be('/routeHrefBindingHrefAttr');

      $link.click();
      expect(routeTouched).to.be(true);
      done();
    }, 40);
  });

  it('can have a $route bound link correctly composed with an href attribute using an observable', function(done) {
    var container = document.getElementById('routeHrefBindingObservable');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;
    var changedRouteTouched = false;
    var viewModelInitialized = false;

    fw.router({
      namespace: 'routeHrefBindingObservable',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingObservable',
          controller: function() {
            routeTouched = true;
          }
        }, {
          route: '/routeHrefBindingObservableChangedRoute',
          controller: function() {
            changedRouteTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    fw.viewModel({
      namespace: 'routeHrefBindingObservable',
      autoRegister: true,
      initialize: function() {
        viewModelInitialized = true;
        this.routeHrefBindingObservable = fw.observable('/routeHrefBindingObservable');
      }
    });

    function viewModel(name) {
      return fw.viewModels.getAll(name)[0];
    }

    expect(routerInitialized).to.be(false);
    expect(viewModelInitialized).to.be(false);
    expect(routeTouched).to.be(false);
    expect(changedRouteTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(viewModelInitialized).to.be(true);

      expect(routeTouched).to.be(false);
      expect(changedRouteTouched).to.be(false);
      expect($link.attr('href')).to.be('/routeHrefBindingObservable');

      $link.click();
      expect(routeTouched).to.be(true);
      expect(changedRouteTouched).to.be(false);

      viewModel('routeHrefBindingObservable').routeHrefBindingObservable('/routeHrefBindingObservableChangedRoute');
      expect($link.attr('href')).to.be('/routeHrefBindingObservableChangedRoute');

      $link.click();
      expect(changedRouteTouched).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link that expresses the default active class when the route matches', function(done) {
    var container = document.getElementById('routeHrefBindingDefaultActiveClass');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingDefaultActiveClass',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingDefaultActiveClass',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass('active')).to.be(false);

      $link.click();
      expect(routeTouched).to.be(true);
      expect($link.hasClass('active')).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link that expresses a custom \'active\' class when the route matches', function(done) {
    var container = document.getElementById('routeHrefBindingCustomActiveClass');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingCustomActiveClass',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingCustomActiveClass',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass('routeHrefBindingCustomActiveClass')).to.be(false);

      $link.click();
      expect(routeTouched).to.be(true);
      expect($link.hasClass('routeHrefBindingCustomActiveClass')).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link that expresses a custom \'active\' class defined by an observable when the route matches', function(done) {
    var container = document.getElementById('routeHrefBindingCustomActiveClassObservable');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;
    var routePath = '/routeHrefBindingCustomActiveClassObservable';
    var activeClassName = 'activeClassObservable';

    fw.viewModel({
      namespace: 'routeHrefBindingCustomActiveClassObservable',
      autoRegister: true,
      initialize: function() {
        this.activeClassObservable = fw.observable(activeClassName);
      }
    });

    fw.router({
      namespace: 'routeHrefBindingCustomActiveClassObservable',
      autoRegister: true,
      routes: [
        {
          route: routePath,
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass(activeClassName)).to.be(false);

      $link.click();
      expect(routeTouched).to.be(true);
      expect($link.hasClass(activeClassName)).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link that disables the active class state based on a raw boolean flag', function(done) {
    var container = document.getElementById('routeHrefBindingDisabledActiveClass');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingDisabledActiveClass',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingDisabledActiveClass',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass('active')).to.be(false);

      $link.click();
      expect(routeTouched).to.be(true);
      expect($link.hasClass('active')).to.be(false);

      done();
    }, 40);
  });

  it('can have a $route bound link that disables the active class state using an observable', function(done) {
    var container = document.getElementById('routeHrefBindingDisabledActiveClassObservable');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingDisabledActiveClassObservable',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingDisabledActiveClassObservable',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
        this.disableActiveClass = fw.observable(false);
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass('active')).to.be(false);

      $link.click();
      expect(routeTouched).to.be(true);
      expect($link.hasClass('active')).to.be(false);

      done();
    }, 40);
  });

  it('can have a $route bound link that triggers based on a custom event defined by a string', function(done) {
    var container = document.getElementById('routeHrefBindingCustomEvent');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingCustomEvent',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingCustomEvent',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass('active')).to.be(false);

      $link.dblclick();
      expect(routeTouched).to.be(true);
      expect($link.hasClass('active')).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link that triggers based on a custom event defined by a callback/observable', function(done) {
    var container = document.getElementById('routeHrefBindingCustomEventObservable');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;

    fw.router({
      namespace: 'routeHrefBindingCustomEventObservable',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingCustomEventObservable',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    expect(routerInitialized).to.be(false);
    expect(routeTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(routeTouched).to.be(false);
      expect($link.hasClass('active')).to.be(false);

      $link.dblclick();
      expect(routeTouched).to.be(true);
      expect($link.hasClass('active')).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link correctly composed with a custom callback handler', function(done) {
    var container = document.getElementById('routeHrefBindingCustomHandler');
    var $container = $(container);
    var routerInitialized = false;
    var routeTouched = false;
    var viewModelInitialized = false;
    var customHandlerTouched = false;
    var allowHandlerEvent = false;

    fw.router({
      namespace: 'routeHrefBindingCustomHandler',
      autoRegister: true,
      routes: [
        {
          route: '/routeHrefBindingCustomHandler',
          controller: function() {
            routeTouched = true;
          }
        }
      ],
      initialize: function() {
        routerInitialized = true;
      }
    });

    fw.viewModel({
      namespace: 'routeHrefBindingCustomHandler',
      autoRegister: true,
      initialize: function() {
        viewModelInitialized = true;
        this.routeHrefBindingCustomHandler = function(event, url) {
          customHandlerTouched = true;
          expect(event).to.be.an('object');
          expect(url).to.be.a('string');
          return allowHandlerEvent;
        };
      }
    });

    function viewModel(name) {
      return fw.viewModels.getAll(name)[0];
    }

    expect(routerInitialized).to.be(false);
    expect(viewModelInitialized).to.be(false);
    expect(routeTouched).to.be(false);
    expect(customHandlerTouched).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(viewModelInitialized).to.be(true);
      expect(customHandlerTouched).to.be(false);
      expect(routeTouched).to.be(false);
      expect($link.attr('href')).to.be('/routeHrefBindingCustomHandler');

      $link.click();
      expect(customHandlerTouched).to.be(true);
      expect(routeTouched).to.be(false);

      allowHandlerEvent = true;

      $link.click();
      expect(routeTouched).to.be(true);

      done();
    }, 40);
  });

  it('can have a $route bound link correctly composed with a custom URL callback', function(done) {
    var container = document.getElementById('routeHrefBindingCustomUrlCallback');
    var $container = $(container);
    var routerInitialized = false;
    var viewModelInitialized = false;

    fw.router({
      namespace: 'routeHrefBindingCustomUrlCallback',
      autoRegister: true,
      initialize: function() {
        routerInitialized = true;
      }
    });

    fw.viewModel({
      namespace: 'routeHrefBindingCustomUrlCallback',
      autoRegister: true,
      initialize: function() {
        viewModelInitialized = true;
        this.routeHrefBindingCustomUrlCallback = function() {
          return '/routeHrefBindingCustomUrlCallback';
        };
      }
    });

    expect(routerInitialized).to.be(false);
    expect(viewModelInitialized).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(viewModelInitialized).to.be(true);
      expect($link.attr('href')).to.be('/routeHrefBindingCustomUrlCallback');

      done();
    }, 40);
  });

  it('can have a $route bound link correctly composed with an alternative event', function(done) {
    var container = document.getElementById('routeHrefBindingAltEvent');
    var $container = $(container);
    var routerInitialized = false;
    var viewModelInitialized = false;
    var altEventRan = false;

    fw.router({
      namespace: 'routeHrefBindingAltEvent',
      autoRegister: true,
      initialize: function() {
        routerInitialized = true;
      }
    });

    fw.viewModel({
      namespace: 'routeHrefBindingAltEvent',
      autoRegister: true,
      initialize: function() {
        viewModelInitialized = true;
        this.routeHrefBindingAltEvent = function() {
          altEventRan = true;
        };
      }
    });

    expect(routerInitialized).to.be(false);
    expect(viewModelInitialized).to.be(false);
    expect(altEventRan).to.be(false);

    fw.start(container);

    setTimeout(function() {
      var $link = $container.find('a');

      expect(routerInitialized).to.be(true);
      expect(viewModelInitialized).to.be(true);
      expect(altEventRan).to.be(false);

      $link.dblclick();
      expect(altEventRan).to.be(true);

      done();
    }, 40);
  });

  it('can have a registered location set and retrieved proplerly', function() {
    fw.routers.registerLocation('registeredLocationRetrieval', '/bogus/path');
    expect(fw.routers.getLocation('registeredLocationRetrieval')).to.be('/bogus/path');
  });

  it('can have an array of routers registered to a location and retrieved proplerly', function() {
    fw.routers.registerLocation(['registeredLocationRetrievalArray1', 'registeredLocationRetrievalArray2'], '/bogus/path');
    expect(fw.routers.getLocation('registeredLocationRetrievalArray1')).to.be('/bogus/path');
    expect(fw.routers.getLocation('registeredLocationRetrievalArray2')).to.be('/bogus/path');
  });

  it('can have a registered location with filename set and retrieved proplerly', function() {
    fw.routers.registerLocation('registeredLocationWithFilenameRetrieval', '/bogus/path/__file__.js');
    expect(fw.routers.getLocation('registeredLocationWithFilenameRetrieval')).to.be('/bogus/path/__file__.js');
  });

  it('can have a specific file extension set and used correctly', function() {
    fw.routers.fileExtensions('.jscript');
    fw.routers.registerLocation('registeredLocationWithExtensionRetrieval', '/bogus/path/');

    expect(fw.routers.getFileName('registeredLocationWithExtensionRetrieval')).to.be('registeredLocationWithExtensionRetrieval.jscript');

    fw.routers.fileExtensions('.js');
  });

  it('can have a callback specified as the extension with it invoked and the return value used', function() {
    fw.routers.fileExtensions(function(moduleName) {
      expect(moduleName).to.be('registeredLocationWithFunctionExtensionRetrieval');
      return '.jscriptFunction';
    });
    fw.routers.registerLocation('registeredLocationWithFunctionExtensionRetrieval', '/bogus/path/');

    expect(fw.routers.getFileName('registeredLocationWithFunctionExtensionRetrieval')).to.be('registeredLocationWithFunctionExtensionRetrieval.jscriptFunction');

    fw.routers.fileExtensions('.js');
  });

  it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
    var container = document.getElementById('AMDPreRegisteredRouter');
    var routerLoaded = false;

    define('AMDPreRegisteredRouter', ['footwork'], function(fw) {
      return fw.router({
        initialize: function() {
          routerLoaded = true;
        }
      });
    });

    expect(routerLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(routerLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified location', function(done) {
    var container = document.getElementById('AMDRouter');
    window.AMDRouterWasLoaded = false;

    fw.routers.registerLocation('AMDRouter', 'scripts/testAssets/');

    expect(window.AMDRouterWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDRouterWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
    var container = document.getElementById('AMDRouterFullName');
    window.AMDRouterFullNameWasLoaded = false;

    fw.routers.registerLocation('AMDRouterFullName', 'scripts/testAssets/AMDRouterFullName.js');

    expect(window.AMDRouterFullNameWasLoaded).to.be(false);
    fw.start(container);

    setTimeout(function() {
      expect(window.AMDRouterFullNameWasLoaded).to.be(true);
      done();
    }, 40);
  });

  it('can specify and load via requirejs with the default location', function(done) {
    var container = document.getElementById('defaultRouterLocation');
    window.defaultRouterLocationLoaded = false;

    fw.routers.defaultLocation('scripts/testAssets/defaultRouterLocation/');

    expect(window.defaultRouterLocationLoaded).to.be(false);

    fw.start(container);

    setTimeout(function() {
      expect(window.defaultRouterLocationLoaded).to.be(true);
      done();
    }, 40);
  });
});
