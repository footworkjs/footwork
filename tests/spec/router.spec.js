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
      }, 40);
    });

    it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
      window.AMDRouterRegexpWasLoaded = false;

      fw.router.registerLocation(/AMDRouterRegexp-.*/, 'tests/assets/fixtures/');

      expect(window.AMDRouterRegexpWasLoaded).toBe(false);
      fw.start(makeTestContainer('<router module="AMDRouterRegexp-test"></router>'));

      setTimeout(function() {
        expect(window.AMDRouterRegexpWasLoaded).toBe(true);
        done();
      }, 40);
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
      }, 40);
    });

    it('can specify and load via requirejs with the default location', function(done) {
      window.defaultRouterLoaded = false;

      fw.router.defaultLocation('tests/assets/fixtures/defaultRouterLocation/');

      expect(window.defaultRouterLoaded).toBe(false);

      fw.start(makeTestContainer('<router module="defaultRouter"></router>'));

      setTimeout(function() {
        expect(window.defaultRouterLoaded).toBe(true);
        done();
      }, 40);
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
      var defaultRouteSpy = jasmine.createSpy('defaultRouteSpy');

      fw.router.create({
        namespace: namespaceName,
        autoRegister: true,
        routes: [
          {
            route: '/',
            controller: defaultRouteSpy
          }
        ]
      });

      expect(defaultRouteSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      setTimeout(function() {
        expect(defaultRouteSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger the unknownRoute', function(done) {
      var namespaceName = 'unknownRouteCheck';
      var unknownRouteSpy = jasmine.createSpy('defaultRouteSpy');
      var initializeSpy;
      var router;

      fw.router.create({
        namespace: 'unknownRouteCheck',
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          router = this;
        }).and.callThrough()),
        unknownRoute: {
          controller: ensureCallOrder(1, unknownRouteSpy)
        }
      });

      expect(unknownRouteSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));

      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState('/' + fw.utils.guid());
        expect(unknownRouteSpy).toHaveBeenCalled();
        done();
      }, 40);
    });

    it('can trigger a specified route', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var routeSpy = jasmine.createSpy('routeSpy');
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
            controller: routeSpy
          }
        ]
      });

      expect(routeSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));
      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState(mockUrl);
        expect(routeSpy).toHaveBeenCalled();
        done();
      }, 20);
    });

    it('can trigger a specified route that is defined within an array of route strings', function(done) {
      var mockUrl = '/' + fw.utils.guid();
      var namespaceName = fw.utils.guid();
      var routeSpy = jasmine.createSpy('routeSpy');
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
            controller: routeSpy
          }
        ]
      });

      expect(routeSpy).not.toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<router module="' + namespaceName + '"></router>'));
      expect(initializeSpy).toHaveBeenCalled();

      setTimeout(function() {
        router.setState(mockUrl + '2');
        expect(routeSpy).toHaveBeenCalled();
        done();
      }, 40);
    });
  });
});
