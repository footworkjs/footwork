define(['footwork', 'lodash', 'jquery'], function(fw, _, $) {

  describe('router', function() {
    var testContainer;

    beforeEach(function() {
      resetCallbackOrder();
      jasmine.addMatchers(customMatchers);
      fixture.setBase('tests/assets/fixtures');
    });
    afterEach(function() {
      fixture.cleanup(testContainer);
    });

    it('has the ability to create a router', function() {
      expect(fw.router.create).toBeA('function');
      expect(fw.router.create()).toBeA('function');
    });

    it('has the ability to create a router with a correctly defined namespace whos name we can retrieve', function() {
      var ModelA = fw.router.create({
        namespace: 'ModelA'
      });
      var modelA = new ModelA();

      expect(modelA.$namespace).toBeAn('object');
      expect(modelA.$namespace.getName()).toBe('ModelA');
    });

    it('has the ability to be instantiated with with extended attributes', function() {
      var ModelA = fw.router.create({
        extend: {
          extendedAttribute: true
        }
      });
      var modelA = new ModelA();

      expect(modelA.extendedAttribute).toBe(true);
    });

    it('correctly names and increments counter for indexed routers', function() {
      var namespaceName = fw.utils.guid();
      var IndexedRouter = fw.router.create({
        namespace: namespaceName,
        autoIncrement: true
      });

      var firstRouter = new IndexedRouter();
      var secondRouter = new IndexedRouter();
      var thirdRouter = new IndexedRouter();

      expect(firstRouter.$namespace.getName()).toBe(namespaceName + '0');
      expect(secondRouter.$namespace.getName()).toBe(namespaceName + '1');
      expect(thirdRouter.$namespace.getName()).toBe(namespaceName + '2');
    });

    it('correctly applies a mixin to a router', function() {
      var namespaceName = fw.utils.guid();
      var preInitCallback = jasmine.createSpy('preInitCallback').and.callThrough();
      var postInitCallback = jasmine.createSpy('postInitCallback').and.callThrough();

      var RouterWithMixin = fw.router.create({
        namespace: namespaceName,
        mixins: [
          {
            _preInit: preInitCallback,
            mixin: {
              mixinPresent: true
            },
            _postInit: postInitCallback
          }
        ]
      });

      var router = new RouterWithMixin();

      expect(preInitCallback).toHaveBeenCalled();
      expect(router.mixinPresent).toBe(true);
      expect(postInitCallback).toHaveBeenCalled();
    });

    it('has the ability to create nested routers with correctly defined namespaces', function() {
      var initializeSpyA;
      var initializeSpyB;
      var initializeSpyC;

      var ModelA = fw.router.create({
        namespace: 'ModelA',
        initialize: ensureCallOrder(0, initializeSpyA = jasmine.createSpy('initializeSpyA', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelA');
          this.subModelB = new ModelB();
          expect(fw.utils.currentNamespaceName()).toBe('ModelA');
        }).and.callThrough())
      });

      var ModelB = fw.router.create({
        namespace: 'ModelB',
        initialize: ensureCallOrder(1, initializeSpyB = jasmine.createSpy('initializeSpyB', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelB');
          this.subModelC = new ModelC();
          expect(fw.utils.currentNamespaceName()).toBe('ModelB');
        }).and.callThrough())
      });

      var ModelC = fw.router.create({
        namespace: 'ModelC',
        initialize: ensureCallOrder(2, initializeSpyC = jasmine.createSpy('initializeSpyC', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelC');
        }).and.callThrough())
      });

      expect(initializeSpyA).not.toHaveBeenCalled();
      expect(initializeSpyB).not.toHaveBeenCalled();
      expect(initializeSpyC).not.toHaveBeenCalled();

      var modelA = new ModelA();

      expect(initializeSpyA).toHaveBeenCalled();
      expect(initializeSpyB).toHaveBeenCalled();
      expect(initializeSpyC).toHaveBeenCalled();
    });

    it('calls afterRender after initialize with the correct target element when creating and binding a new instance', function() {
      var checkForClass = 'check-for-class';
      var initializeSpy;
      var afterRenderSpy;

      var ModelA = fw.router.create({
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy')),
        afterRender: ensureCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(containingElement) {
          expect(containingElement.className).toBe(checkForClass);
        }).and.callThrough())
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();

      fw.applyBindings(new ModelA(), makeTestContainer('', '<div class="' + checkForClass + '"></div>'));

      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).toHaveBeenCalled();
    });

    it('can register a router', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.router.isRegistered(namespaceName)).toBe(false);

      fw.router.register(namespaceName, function() {});

      expect(fw.router.isRegistered(namespaceName)).toBe(true);
    });

    it('can get a registered router', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.router.isRegistered(namespaceName)).toBe(false);

      var Model = function() {};
      fw.router.register(namespaceName, Model);

      expect(fw.router.isRegistered(namespaceName)).toBe(true);
      expect(fw.router.getRegistered(namespaceName)).toBe(Model);
    });

    it('can get all instantiated routers', function() {
      var Router = fw.router.create();
      var routers = [ new Router(), new Router() ];

      expect(_.keys(fw.router.getAll()).length).toBeGreaterThan(0);
    });

    it('can get all instantiated routers of a specific type/name', function() {
      var routers = [];
      var specificRouterNamespace = fw.utils.guid();
      var Router = fw.router.create({ namespace: specificRouterNamespace });
      var numToMake = _.random(1,15);

      for(var x = numToMake; x; x--) {
        routers.push( new Router() );
      }

      expect(fw.router.getAll('getAllSpecificRouterDoesNotExist').length).toBe(0);
      expect(fw.router.getAll(specificRouterNamespace).length).toBe(numToMake);
    });

    it('can autoRegister a router during class method creation', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.router.isRegistered(namespaceName)).toBe(false);

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true
      });

      expect(fw.router.isRegistered(namespaceName)).toBe(true);
    });

    it('can bind to the DOM using a <router> declaration', function(done) {
      var wasInitialized = false;
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: initializeSpy
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('can bind to the DOM using a shared instance', function(done) {
      var boundPropertyValue = fw.utils.guid();

      fw.router.register(boundPropertyValue, {
        instance: {
          boundProperty: boundPropertyValue
        }
      });

      var $container = $(makeTestContainer('<router module="' + boundPropertyValue + '">\
                                              <span class="result" data-bind="text: boundProperty"></span>\
                                            </router>'));
      expect($container.find('.result').text()).not.toBe(boundPropertyValue);
      fw.start($container.get(0));

      setTimeout(function() {
        expect($container.find('.result').text()).toBe(boundPropertyValue);
        done();
      }, 20);
    });

    it('can bind to the DOM using a generated instance', function(done) {
      var boundPropertyValue = fw.utils.guid();
      var boundPropertyValueElement = boundPropertyValue + '-element';
      var createRouterInstance;

      fw.router.register(boundPropertyValue, {
        createViewModel: createRouterInstance = jasmine.createSpy('createRouterInstance', function(params, info) {
          expect(params.var).toBe(boundPropertyValue);
          expect(info.element.getAttribute('id')).toBe(boundPropertyValueElement);

          return {
            boundProperty: boundPropertyValue
          };
        }).and.callThrough()
      });

      expect(createRouterInstance).not.toHaveBeenCalled();
      var $container = $(makeTestContainer('<router module="' + boundPropertyValue + '" id="' + boundPropertyValueElement + '" params="var: \'' + boundPropertyValue + '\'">\
                                              <span class="result" data-bind="text: boundProperty"></span>\
                                            </router>'));

      expect($container.find('.result').text()).not.toBe(boundPropertyValue);
      fw.start($container.get(0));

      setTimeout(function() {
        expect(createRouterInstance).toHaveBeenCalled();
        expect($container.find('.result').text()).toBe(boundPropertyValue);
        done();
      }, 20);
    });

    it('has the animation classes applied properly', function() {
      var namespaceName = fw.utils.guid();
      var $theElement;
      var initializeSpy;
      var afterRenderSpy;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy').and.callThrough()),
        afterRender: ensureCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
          $theElement = $(element);
          expect($theElement.hasClass('fw-entity-animate')).toBe(false);
        }).and.callThrough())
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).toHaveBeenCalled();
      expect($theElement.hasClass('fw-entity-animate')).toBe(true);
    });

    it('can nest <router> declarations', function() {
      var namespaceNameOuter = fw.utils.guid();
      var namespaceNameInner = fw.utils.guid();
      var initializeSpy = jasmine.createSpy('initializeSpy');

      fw.router.create({
        namespace: namespaceNameOuter,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy)
      });

      fw.router.create({
        namespace: namespaceNameInner,
        autoRegister: true,
        initialize: ensureCallOrder(1, initializeSpy)
      });

      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceNameOuter + '">\
        <router module="' + namespaceNameInner + '"></router>\
      </router>'));

      expect(initializeSpy).toHaveBeenCalledTimes(2);
    });

    it('can pass parameters through a <router> declaration', function() {
      var namespaceName = fw.utils.guid();
      var initializeSpy;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough()
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<router module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></router>'));
      expect(initializeSpy).toHaveBeenCalled();
    });

    it('can have a registered location set and retrieved proplerly', function() {
      var namespaceName = fw.utils.guid();
      fw.router.registerLocation(namespaceName, '/bogus/path');
      expect(fw.router.getLocation(namespaceName)).toBe('/bogus/path');
      fw.router.registerLocation(/regexp.*/, '/bogus/path');
      expect(fw.router.getLocation('regexp-model')).toBe('/bogus/path');
    });

    it('can have an array of models registered to a location and retrieved proplerly', function() {
      var namespaceNames = [ fw.utils.guid(), fw.utils.guid() ];
      fw.router.registerLocation(namespaceNames, '/bogus/path');
      expect(fw.router.getLocation(namespaceNames[0])).toBe('/bogus/path');
      expect(fw.router.getLocation(namespaceNames[1])).toBe('/bogus/path');
    });

    it('can have a registered location with filename set and retrieved proplerly', function() {
      var namespaceName = fw.utils.guid();
      fw.router.registerLocation(namespaceName, '/bogus/path/__file__.js');
      expect(fw.router.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
    });

    it('can have a specific file extension set and used correctly', function() {
      var namespaceName = fw.utils.guid();
      var customExtension = '.jscript';
      fw.router.fileExtensions(customExtension);
      fw.router.registerLocation(namespaceName, '/bogus/path/');

      expect(fw.router.getFileName(namespaceName)).toBe(namespaceName + customExtension);

      fw.router.fileExtensions('.js');
    });

    it('can have a callback specified as the extension with it invoked and the return value used', function() {
      var namespaceName = fw.utils.guid();
      var customExtension = '.jscriptFunction';
      fw.router.fileExtensions(function(moduleName) {
        expect(moduleName).toBe(namespaceName);
        return customExtension;
      });
      fw.router.registerLocation(namespaceName, '/bogus/path/');

      expect(fw.router.getFileName(namespaceName)).toBe(namespaceName + customExtension);

      fw.router.fileExtensions('.js');
    });

    it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      define(namespaceName, ['footwork'], function(fw) {
        return fw.router.create({
          initialize: initializeSpy
        });
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can load via registered router with a declarative initialization', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      fw.router.register(namespaceName, fw.router.create({
        initialize: initializeSpy
      }));

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can load via requirejs with a declarative initialization from a specified location', function(done) {
      var namespaceName = 'AMDRouter';
      window.AMDRouterWasLoaded = false;

      fw.router.registerLocation(namespaceName, 'tests/assets/fixtures/');

      expect(window.AMDRouterWasLoaded).toBe(false);
      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(window.AMDRouterWasLoaded).toBe(true);
        done();
      }, 20);
    });

    it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
      window.AMDRouterRegexpWasLoaded = false;

      fw.router.registerLocation(/AMDRouterRegexp-.*/, 'tests/assets/fixtures/');

      expect(window.AMDRouterRegexpWasLoaded).toBe(false);
      fw.start(makeTestContainer('<router module="AMDRouterRegexp-test"></router>'));

      setTimeout(function() {
        expect(window.AMDRouterRegexpWasLoaded).toBe(true);
        done();
      }, 20);
    });

    it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
      var namespaceName = 'AMDRouterFullName';
      window.AMDRouterFullNameWasLoaded = false;

      fw.router.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

      expect(window.AMDRouterFullNameWasLoaded).toBe(false);
      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(window.AMDRouterFullNameWasLoaded).toBe(true);
        done();
      }, 20);
    });

    it('can specify and load via requirejs with the default location', function(done) {
      window.defaultRouterLoaded = false;

      fw.router.defaultLocation('tests/assets/fixtures/defaultRouterLocation/');

      expect(window.defaultRouterLoaded).toBe(false);

      fw.start(makeTestContainer('<router module="defaultRouter"></router>'));

      setTimeout(function() {
        expect(window.defaultRouterLoaded).toBe(true);
        done();
      }, 20);
    });

    it('can be nested and initialized declaratively', function(done) {
      var outerInitializeSpy = jasmine.createSpy('outerInitializeSpy');
      var innerInitializeSpy = jasmine.createSpy('innerInitializeSpy');
      var outerNamespaceName = fw.utils.guid();
      var innerNamespaceName = fw.utils.guid();

      fw.router.create({
        namespace: outerNamespaceName,
        autoRegister: true,
        initialize: outerInitializeSpy
      });

      fw.router.create({
        namespace: innerNamespaceName,
        autoRegister: true,
        initialize: innerInitializeSpy
      });

      expect(outerInitializeSpy).not.toHaveBeenCalled();
      expect(innerInitializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + outerNamespaceName + '">\
                                    <router module="' + innerNamespaceName + '"></router>\
                                  </router>'));

      setTimeout(function() {
        expect(outerInitializeSpy).toHaveBeenCalled();
        expect(innerInitializeSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger the default route', function(done) {
      var namespaceName = fw.utils.guid();
      var defaultRouteControllerSpy = jasmine.createSpy('defaultRouteControllerSpy');

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        routes: [
          {
            route: '/',
            controller: defaultRouteControllerSpy
          }
        ]
      });

      expect(defaultRouteControllerSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(defaultRouteControllerSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger the unknownRoute', function(done) {
      var namespaceName = 'unknownRouteCheck';
      var unknownRouteControllerSpy = jasmine.createSpy('defaultRouteSpy');
      var initializeSpy;
      var router;

      fw.router.create({
        namespace: 'unknownRouteCheck',
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        unknownRoute: {
          controller: ensureCallOrder(1, unknownRouteControllerSpy)
        }
      });

      expect(unknownRouteControllerSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState('/' + fw.utils.guid());
        expect(unknownRouteControllerSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger a specified route', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
      var initializeSpy;
      var router;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        routes: [
          {
            route: mockUrl,
            controller: routeControllerSpy
          }
        ]
      });

      expect(routeControllerSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));
      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState(mockUrl);
        expect(routeControllerSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger a specified route that is defined within an array of route strings', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
      var initializeSpy;
      var router;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        routes: [
          {
            route: [ mockUrl, mockUrl + '2' ],
            controller: routeControllerSpy
          }
        ]
      });

      expect(routeControllerSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));
      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState(mockUrl + '2');
        expect(routeControllerSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger a specified route with a required parameter', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var routeControllerSpy;
      var initializeSpy;
      var testParam = fw.utils.guid();
      var router;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        routes: [
          {
            route: mockUrl + '/:testParam',
            controller: ensureCallOrder(1, routeControllerSpy = jasmine.createSpy('routeControllerSpy', function(passedTestParam) {
              expect(passedTestParam).toBe(testParam);
            }).and.callThrough())
          }
        ]
      });

      expect(routeControllerSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));
      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState(mockUrl + '/' + testParam);
        expect(routeControllerSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger a specified route with an optional parameter with and without the parameter', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var routeControllerSpy;
      var initializeSpy;
      var optParamNotSuppliedSpy;
      var optParamSuppliedSpy;
      var testParam = fw.utils.guid();
      var router;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        routes: [
          {
            route: mockUrl + '/optParamNotSupplied(/:testParam)',
            controller: ensureCallOrder(1, optParamNotSuppliedSpy = jasmine.createSpy('optParamNotSuppliedSpy', function(testParam) {
              expect(testParam).toBe(undefined);
            }).and.callThrough())
          }, {
            route: mockUrl + '/optParamSupplied(/:testParam)',
            controller: ensureCallOrder(2, optParamSuppliedSpy = jasmine.createSpy('optParamSuppliedSpy', function(passedTestParam) {
              expect(passedTestParam).toBe(testParam);
            }).and.callThrough())
          }
        ]
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(optParamNotSuppliedSpy).not.toHaveBeenCalled();
      expect(optParamSuppliedSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        router.setState(mockUrl + '/optParamNotSupplied');
        expect(optParamNotSuppliedSpy).toHaveBeenCalled();

        router.setState(mockUrl + '/optParamSupplied/' + testParam);
        expect(optParamSuppliedSpy).toHaveBeenCalled();

        done();
      }, 20);
    });

    it('can manipulate an outlet', function(done) {
      var manipulateOutletUrl = '/' + fw.utils.guid();
      var manipulateOutletComponentNamespace = fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var initializeSpy;
      var afterRenderSpy;
      var manipulateOutletControllerSpy;
      var clearOutletControllerSpy;
      var manipulateOutletComponentSpy;
      var router;
      var container;
      var $container;

      fw.components.register(manipulateOutletComponentNamespace, {
        viewModel: ensureCallOrder(3, manipulateOutletComponentSpy = jasmine.createSpy('manipulateOutletComponentSpy')),
        template: '<div class="component-loaded"></div>'
      });

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        afterRender: ensureCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy')),
        routes: [
          {
            route: manipulateOutletUrl,
            controller: ensureCallOrder(2, manipulateOutletControllerSpy = jasmine.createSpy('manipulateOutletControllerSpy', function() {
              this.outlet('output', manipulateOutletComponentNamespace);
            }).and.callThrough())
          }, {
            route: '/clearOutlet',
            controller: ensureCallOrder(4, clearOutletControllerSpy = jasmine.createSpy('clearOutletControllerSpy', function() {
              this.outlet('output', false);
            }).and.callThrough())
          }
        ]
      });

      expect(manipulateOutletControllerSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();
      expect(clearOutletControllerSpy).not.toHaveBeenCalled();
      expect(manipulateOutletComponentSpy).not.toHaveBeenCalled();

      fw.start(container = makeTestContainer('<router module="' + namespaceName + '">\
        <outlet name="output"></outlet>\
      </router>'));
      $container = $(container);
      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).toHaveBeenCalled();

      setTimeout(function() {
        expect($container.find('outlet[name="output"]').attr('rendered')).not.toBe(manipulateOutletComponentNamespace);
        router.setState(manipulateOutletUrl);
        expect(manipulateOutletControllerSpy).toHaveBeenCalled();

        setTimeout(function() {
          expect($container.find('outlet[name="output"]').attr('rendered')).toBe(manipulateOutletComponentNamespace);
          expect($container.find('outlet[name="output"] .component-loaded').length).toBe(1);

          router.setState('/clearOutlet');
          expect(clearOutletControllerSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect($container.find('outlet[name="output"]').attr('rendered')).not.toBe(manipulateOutletComponentNamespace);
            expect($container.find('outlet[name="output"] .component-loaded').length).toBe(0);
            done();
          }, 20);
        }, 20);
      }, 20);
    });

    it('can see all/multiple referenced outlets defined in its context', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy;
      var router;

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough())
      });

      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '">\
        <outlet name="output1"></outlet>\
        <outlet name="output2"></outlet>\
        <outlet name="output3"></outlet>\
      </router>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        expect(_.keys(router.outlets)).toEqual([ 'output1', 'output2', 'output3' ]);
        done();
      }, 20);
    });

    it('can have callback triggered after outlet component is resolved and composed', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var outletCallbackName = fw.utils.guid();
      var initializeSpy;
      var outletCallbackComponentSpy;
      var triggerOutletCallbackControllerSpy;
      var router;

      fw.components.register(outletCallbackName, {
        viewModel: ensureCallOrder(1, outletCallbackComponentSpy = jasmine.createSpy('outletCallbackComponentSpy')),
        template: '<div class="' + outletCallbackName + '"></div>'
      });

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        routes: [
          {
            route: mockUrl,
            controller: function() {
              this.outlet('output', outletCallbackName, ensureCallOrder(2, triggerOutletCallbackControllerSpy = jasmine.createSpy('triggerOutletCallbackControllerSpy', function(element) {
                expect(element.tagName.toLowerCase()).toBe('outlet');
                expect($(element).find('.' + outletCallbackName).length).toBe(1);
              })));
            }
          }
        ]
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(outletCallbackComponentSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '">\
        <outlet name="output"></outlet>\
      </router>'));
      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState(mockUrl);
        expect(triggerOutletCallbackControllerSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          expect(triggerOutletCallbackControllerSpy).toHaveBeenCalled();
          expect(outletCallbackComponentSpy).toHaveBeenCalled();
          done();
        }, 20);
      }, 20);
    });

    it('can instantiate and properly render an outlet after its router has initialized', function(done) {
      var outletControlingViewModelNamespace = fw.utils.guid();
      var outletComponentNamespace = fw.utils.guid();
      var routerNamespace = fw.utils.guid();
      var initializeSpy;
      var changeOutletControllerSpy;
      var outletCallbackSpy;
      var initializeViewModelSpy;
      var initializeComponentViewModelSpy;
      var router;
      var viewModel;

      fw.components.register(outletComponentNamespace, {
        viewModel: ensureCallOrder(3, initializeComponentViewModelSpy = jasmine.createSpy('initializeComponentViewModelSpy')),
        template: '<div class="' + outletComponentNamespace + '"></div>'
      });

      fw.viewModel.register(outletControlingViewModelNamespace, fw.viewModel.create({
        initialize: ensureCallOrder(1, initializeViewModelSpy = jasmine.createSpy('initializeViewModelSpy', function() {
          viewModel = this;
          this.outletVisible = fw.observable(false);
        }).and.callThrough())
      }));

      fw.router.create({
        namespace: routerNamespace,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        routes: [
          {
            route: '/outletAfterRouter',
            controller: ensureCallOrder(2, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
              this.outlet('output', outletComponentNamespace, ensureCallOrder(4, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                expect(element.tagName.toLowerCase()).toBe('outlet');
                expect($(element).find('.' + outletComponentNamespace).length).toBe(1);
              }).and.callThrough()));
            }).and.callThrough())
          }
        ]
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(initializeViewModelSpy).not.toHaveBeenCalled();
      expect(initializeComponentViewModelSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + routerNamespace + '">\
        <viewModel module="' + outletControlingViewModelNamespace + '">\
          <div data-bind="if: outletVisible">\
            <outlet name="output"></outlet>\
          </div>\
        </viewModel>\
      </router>'));

      expect(initializeSpy).toHaveBeenCalled();
      expect(initializeViewModelSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState('/outletAfterRouter');

        expect(outletCallbackSpy).not.toHaveBeenCalled();
        expect(viewModel).toBeAn('object');

        viewModel.outletVisible(true);

        setTimeout(function() {
          expect(outletCallbackSpy).toHaveBeenCalled();
          expect(initializeComponentViewModelSpy).toHaveBeenCalled();
          done();
        }, 20);
      }, 20);
    });

    it('can display a temporary loading component in place of a component that is being downloaded', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var outletLoaderTestLoadingNamespace = fw.utils.guid();
      var outletLoaderTestLoadedNamespace = fw.utils.guid();
      var routerNamespace = fw.utils.guid();
      var changeOutletControllerSpy;
      var outletCallbackSpy;
      var outletLoaderTestLoadingSpy;
      var outletLoaderTestLoadedSpy;

      function router(name) {
        return fw.router.getAll(name)[0];
      }

      fw.components.register(outletLoaderTestLoadingNamespace, {
        viewModel: ensureCallOrder(1, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
        template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
        synchronous: true
      });

      fw.components.register(outletLoaderTestLoadedNamespace, {
        viewModel: ensureCallOrder(2, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
        template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      });

      fw.router.create({
        namespace: routerNamespace,
        autoRegister: true,
        showDuringLoad: outletLoaderTestLoadingNamespace,
        routes: [
          {
            route: mockUrl,
            controller: ensureCallOrder(0, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
              this.outlet('output', outletLoaderTestLoadedNamespace, ensureCallOrder(3, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                expect(element.tagName.toLowerCase()).toBe('outlet');
                expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
              }).and.callThrough()));
            }).and.callThrough())
          }
        ]
      });

      expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + routerNamespace + '">\
        <outlet name="output"></outlet>\
      </router>'));

      router(routerNamespace).setState(mockUrl);

      expect(changeOutletControllerSpy).toHaveBeenCalled();
      expect(outletCallbackSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      setTimeout(function() {
        expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
        expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
        expect(outletCallbackSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can display a temporary loading component (source from callback) in place of a component that is being downloaded', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var outletLoaderTestLoadingNamespace = fw.utils.guid();
      var outletLoaderTestLoadedNamespace = fw.utils.guid();
      var routerNamespace = fw.utils.guid();
      var changeOutletControllerSpy;
      var outletCallbackSpy;
      var outletLoaderTestLoadingSpy;
      var outletLoaderTestLoadedSpy;
      var initializeRouterSpy;
      var showDuringLoadSpy;
      var theRouter;

      function router(name) {
        return fw.router.getAll(name)[0];
      }

      fw.components.register(outletLoaderTestLoadingNamespace, {
        viewModel: ensureCallOrder(3, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
        template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
        synchronous: true
      });

      fw.components.register(outletLoaderTestLoadedNamespace, {
        viewModel: ensureCallOrder(4, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
        template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      });

      fw.router.create({
        namespace: routerNamespace,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeRouterSpy = jasmine.createSpy('initializeRouterSpy', function() {
          theRouter = this;
        }).and.callThrough()),
        showDuringLoad: ensureCallOrder(2, showDuringLoadSpy = jasmine.createSpy('showDuringLoadSpy', function(outletName, componentToDisplay) {
          expect(this).toBe(theRouter);
          expect(outletName).toBe('output');
          expect(componentToDisplay).toBe(outletLoaderTestLoadedNamespace);
          return outletLoaderTestLoadingNamespace;
        }).and.callThrough()),
        routes: [
          {
            route: mockUrl,
            controller: ensureCallOrder(1, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
              this.outlet('output', outletLoaderTestLoadedNamespace, ensureCallOrder(5, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                expect(element.tagName.toLowerCase()).toBe('outlet');
                expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
              }).and.callThrough()));
            }).and.callThrough())
          }
        ]
      });

      expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + routerNamespace + '">\
        <outlet name="output"></outlet>\
      </router>'));

      router(routerNamespace).setState(mockUrl);

      expect(changeOutletControllerSpy).toHaveBeenCalled();
      expect(outletCallbackSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      setTimeout(function() {
        expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
        expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
        expect(outletCallbackSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    xit('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var outletLoaderTestLoadingNamespace = fw.utils.guid();
      var outletLoaderTestLoadedNamespace = fw.utils.guid();
      var routerNamespace = fw.utils.guid();
      var changeOutletControllerSpy;
      var outletCallbackSpy;
      var outletLoaderTestLoadingSpy;
      var outletLoaderTestLoadedSpy;

      function router(name) {
        return fw.router.getAll(name)[0];
      }

      fw.components.register(outletLoaderTestLoadingNamespace, {
        viewModel: ensureCallOrder(1, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
        template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
        synchronous: true
      });

      fw.components.register(outletLoaderTestLoadedNamespace, {
        viewModel: ensureCallOrder(2, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
        template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      });

      fw.router.create({
        namespace: routerNamespace,
        autoRegister: true,
        showDuringLoad: outletLoaderTestLoadingNamespace,
        minTransitionPeriod: 250,
        routes: [
          {
            route: mockUrl,
            controller: ensureCallOrder(0, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
              this.outlet('output', outletLoaderTestLoadedNamespace, ensureCallOrder(3, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                expect(element.tagName.toLowerCase()).toBe('outlet');
                expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
              }).and.callThrough()));
            }).and.callThrough())
          }
        ]
      });

      expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + routerNamespace + '">\
        <outlet name="output"></outlet>\
      </router>'));

      router(routerNamespace).setState(mockUrl);

      expect(changeOutletControllerSpy).toHaveBeenCalled();
      expect(outletCallbackSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      setTimeout(function() {
        expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
        expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
        expect(outletCallbackSpy).not.toHaveBeenCalled();
        setTimeout(function() {
          expect(outletCallbackSpy).toHaveBeenCalled();
          done();
        }, 250);
      }, 20);
    });

    xit('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time from callback', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var outletLoaderTestLoadingNamespace = fw.utils.guid();
      var outletLoaderTestLoadedNamespace = fw.utils.guid();
      var routerNamespace = fw.utils.guid();
      var changeOutletControllerSpy;
      var outletCallbackSpy;
      var outletLoaderTestLoadingSpy;
      var outletLoaderTestLoadedSpy;
      var minTransitionPeriodSpy;

      function router(name) {
        return fw.router.getAll(name)[0];
      }

      fw.components.register(outletLoaderTestLoadingNamespace, {
        viewModel: ensureCallOrder(2, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
        template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
        synchronous: true
      });

      fw.components.register(outletLoaderTestLoadedNamespace, {
        viewModel: ensureCallOrder(3, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
        template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      });

      fw.router.create({
        namespace: routerNamespace,
        autoRegister: true,
        showDuringLoad: outletLoaderTestLoadingNamespace,
        minTransitionPeriod: ensureCallOrder(1, minTransitionPeriodSpy = jasmine.createSpy('minTransitionPeriodSpy', function(outletName, componentToDisplay) {
          expect(outletName).toBe('output');
          expect(componentToDisplay).toBe(outletLoaderTestLoadedNamespace);
          return 250;
        }).and.callThrough()),
        routes: [
          {
            route: mockUrl,
            controller: ensureCallOrder(0, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
              this.outlet('output', outletLoaderTestLoadedNamespace, ensureCallOrder(4, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                expect(element.tagName.toLowerCase()).toBe('outlet');
                expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
              }).and.callThrough()));
            }).and.callThrough())
          }
        ]
      });

      expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();
      expect(minTransitionPeriodSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + routerNamespace + '">\
        <outlet name="output"></outlet>\
      </router>'));

      router(routerNamespace).setState(mockUrl);
      expect(minTransitionPeriodSpy).toHaveBeenCalled();

      expect(changeOutletControllerSpy).toHaveBeenCalled();
      expect(outletCallbackSpy).not.toHaveBeenCalled();
      expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      setTimeout(function() {
        expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
        expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
        expect(outletCallbackSpy).not.toHaveBeenCalled();
        setTimeout(function() {
          expect(outletCallbackSpy).toHaveBeenCalled();
          done();
        }, 250);
      }, 20);
    });

    it('can have nested/child routers path be dependent on its parents', function(done) {
      var outerNestedRouteNamespace = fw.utils.guid();
      var innerNestedRouteNamespace = fw.utils.guid();
      var subInnerNestedRouteNamespace = fw.utils.guid();
      var initializeSpy = jasmine.createSpy('initializeSpy');

      fw.router.create({
        namespace: outerNestedRouteNamespace,
        autoRegister: true,
        routes: [
          { route: '/' },
          { route: '/outerRoute' }
        ],
        initialize: ensureCallOrder(0, initializeSpy)
      });

      fw.router.create({
        namespace: innerNestedRouteNamespace,
        autoRegister: true,
        routes: [
          { route: '/' },
          { route: '/innerRoute' }
        ],
        initialize: ensureCallOrder(1, initializeSpy)
      });

      fw.router.create({
        namespace: subInnerNestedRouteNamespace,
        autoRegister: true,
        initialize: ensureCallOrder(2, initializeSpy)
      });

      function router(name) {
        return fw.router.getAll(name)[0];
      }

      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + outerNestedRouteNamespace + '">\
        <router module="' + innerNestedRouteNamespace + '">\
          <router module="' + subInnerNestedRouteNamespace + '"></router>\
        </router>\
      </router>'));

      expect(initializeSpy).toHaveBeenCalledTimes(3);

      setTimeout(function() {
        var outer = router(outerNestedRouteNamespace);
        var inner = router(innerNestedRouteNamespace);
        var subInner = router(subInnerNestedRouteNamespace);

        expect(outer.path()).toBe('/');
        expect(inner.path()).toBe('//');
        expect(subInner.path()).toBe('///');

        outer.setState('/outerRoute');

        expect(outer.path()).toBe('/outerRoute');
        expect(inner.path()).toBe('/outerRoute/');
        expect(subInner.path()).toBe('/outerRoute//');

        inner.setState('/innerRoute');

        expect(outer.path()).toBe('/outerRoute');
        expect(inner.path()).toBe('/outerRoute/innerRoute');
        expect(subInner.path()).toBe('/outerRoute/innerRoute/');

        done();
      }, 20);
    });
  });
});
