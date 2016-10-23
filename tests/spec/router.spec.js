define(['footwork', 'lodash', 'jquery', 'tools'],
  function(fw, _, $, tools) {
    describe('router', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      // beforeAll(function() {
      //   fw.router.disableHistory(true);
      // });

      it('has the ability to create a router', function() {
        var BadRouter = function Router() {
          var self = fw.router.boot();
        };
        expect(function() { new BadRouter() }).toThrow();

        var Router = function Router() {
          var self = fw.router.boot(this);
          expect(self).toBe(this);
        };

        var vm = new Router();

        expect(vm).toBeA('router');
        expect(vm).toBeInstanceOf(Router);
      });

      it('has the ability to create a router with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = tools.generateNamespaceName();
        var Model = function () {
          var self = fw.router.boot(this, {
            namespace: namespaceName
          });
        };

        var modelA = new Model();

        expect(modelA.$namespace).toBeAn('object');
        expect(modelA.$namespace.getName()).toBe(namespaceName);
      });

      it('calls afterRender after initialize with the correct target element when creating and binding a new instance', function() {
        var checkForClass = 'check-for-class';
        var initializeSpy;
        var afterRenderSpy;

        var ModelA = tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            afterRender: tools.expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(containingElement) {
              expect(containingElement.className.indexOf(checkForClass)).not.toBe(-1);
            }).and.callThrough())
          });

          expect(afterRenderSpy).not.toHaveBeenCalled();
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(new ModelA(), testContainer = tools.getFixtureContainer('', '<div class="' + checkForClass + '"></div>'));

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).toHaveBeenCalled();
      });

      it('can register and get a registered router', function() {
        var namespaceName = tools.generateNamespaceName();
        expect(fw.router.isRegistered(namespaceName)).toBe(false);

        var Model = jasmine.createSpy('Model');
        fw.router.register(namespaceName, Model);

        expect(fw.router.isRegistered(namespaceName)).toBe(true);
        expect(fw.router.getRegistered(namespaceName)).toBe(Model);
        expect(Model).not.toHaveBeenCalled();
      });

      it('can get all instantiated routers', function() {
        var Router = function() {
          fw.router.boot(this);
        };
        var routers = [ new Router(), new Router() ];

        expect(_.keys(fw.router.getAll())).lengthToBeGreaterThan(0);
      });

      it('can get all instantiated routers of a specific type/name', function() {
        var routers = [];
        var specificRouterNamespace = tools.generateNamespaceName();
        var Router = function() {
          fw.router.boot(this, { namespace: specificRouterNamespace });
        };
        var numToMake = _.random(1,15);

        for(var x = numToMake; x; x--) {
          routers.push(new Router());
        }

        expect(fw.router.getAll(tools.generateNamespaceName())).lengthToBe(0);
        expect(fw.router.getAll(specificRouterNamespace)).lengthToBe(numToMake);
      });

      it('can bind to the DOM using a router declaration', function(done) {
        var wasInitialized = false;
        var namespaceName = tools.generateNamespaceName();
        var RouterSpy = jasmine.createSpy('RouterSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName
          });
        }).and.callThrough();

        fw.router.register(namespaceName, RouterSpy);

        expect(RouterSpy).not.toHaveBeenCalled();
        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(RouterSpy).toHaveBeenCalledTimes(1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a shared instance', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var boundPropertyValue = tools.randomString();

        fw.viewModel.register(namespaceName, {
          instance: {
            boundProperty: boundPropertyValue
          }
        });

        testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </viewModel>');

        expect(testContainer.innerHTML.indexOf(boundPropertyValue)).toBe(-1);

        fw.start(testContainer);

        setTimeout(function() {
          expect(testContainer.innerHTML.indexOf(boundPropertyValue)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a generated instance', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var boundPropertyValue = tools.randomString();
        var boundPropertyValueElement = boundPropertyValue + '-element';
        var createViewModelInstance;

        fw.viewModel.register(namespaceName, {
          createViewModel: tools.expectCallOrder(0, createViewModelInstance = jasmine.createSpy('createViewModel', function(params, info) {
            expect(params.thing).toBe(boundPropertyValue);
            expect(info.element.id).toBe(boundPropertyValueElement);

            return {
              boundProperty: boundPropertyValue
            };
          }).and.callThrough())
        });

        expect(createViewModelInstance).not.toHaveBeenCalled();
        testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '" id="' + boundPropertyValueElement + '" params="thing: \'' + boundPropertyValue + '\'">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </viewModel>');

        fw.start(testContainer);
        expect(testContainer.children[0].innerHTML.indexOf(boundPropertyValue)).toBe(-1);

        setTimeout(function() {
          expect(createViewModelInstance).toHaveBeenCalled();
          expect(testContainer.innerHTML.indexOf(boundPropertyValue)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('has the animation classes applied properly', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;

        fw.viewModel.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName,
            afterRender: tools.expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.className.indexOf(footworkAnimationClass)).toBe(-1);
            }).and.callThrough())
          });
        }).and.callThrough()));

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);
        fw.start(testContainer = tools.getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(afterRenderSpy).toHaveBeenCalled();
          expect(theElement.className.indexOf(footworkAnimationClass)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can nest router declarations', function(done) {
        var namespaceNameOuter = tools.randomString();
        var namespaceNameInner = tools.randomString();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.router.boot(this); });

        fw.router.register(namespaceNameOuter, tools.expectCallOrder(0, initializeSpy));
        fw.router.register(namespaceNameInner, tools.expectCallOrder(1, initializeSpy));

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceNameOuter + '">\
          <router module="' + namespaceNameInner + '"></router>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalledTimes(2);
          done();
        }, ajaxWait);
      });

      it('can pass parameters through a router declaration', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          fw.router.boot(this);
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('calls onDispose when the containing element is removed from the DOM', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;
        var onDisposeSpy;

        var WrapperRouter = tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this);
          this.showIt = fw.observable(true);
        }).and.callThrough());

        fw.router.register(namespaceName, function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            afterRender: tools.expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.tagName).toBe('ROUTER');
            }).and.callThrough()),
            onDispose: tools.expectCallOrder(2, onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
              expect(element).toBe(theElement);
            }).and.callThrough())
          });
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        var wrapper = new WrapperRouter();

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(wrapper, testContainer = tools.getFixtureContainer('<div data-bind="if: showIt">\
          <router module="' + namespaceName + '"></router>\
        </div>'));

        setTimeout(function() {
          expect(onDisposeSpy).not.toHaveBeenCalled();

          wrapper.showIt(false);

          expect(afterRenderSpy).toHaveBeenCalled();
          expect(onDisposeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can have a registered location set and retrieved proplerly', function() {
        var namespaceName = tools.generateNamespaceName();
        fw.router.registerLocation(namespaceName, '/bogus/path');
        expect(fw.router.getLocation(namespaceName)).toBe('/bogus/path');
        fw.router.registerLocation(/regexp.*/, '/bogus/path');
        expect(fw.router.getLocation('regexp-model')).toBe('/bogus/path');
      });

      it('can have an array of models registered to a location and retrieved proplerly', function() {
        var namespaceNames = [ tools.generateNamespaceName(), tools.generateNamespaceName() ];
        fw.router.registerLocation(namespaceNames, '/bogus/path');
        expect(fw.router.getLocation(namespaceNames[0])).toBe('/bogus/path');
        expect(fw.router.getLocation(namespaceNames[1])).toBe('/bogus/path');
      });

      it('can have a registered location with filename set and retrieved proplerly', function() {
        var namespaceName = tools.generateNamespaceName();
        fw.router.registerLocation(namespaceName, '/bogus/path/__file__.js');
        expect(fw.router.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
      });

      it('can have a specific file extension set and used correctly', function() {
        var namespaceName = tools.generateNamespaceName();
        var customExtension = '.jscript';
        fw.router.fileExtensions(customExtension);
        fw.router.registerLocation(namespaceName, '/bogus/path/');

        expect(fw.router.getFileName(namespaceName)).toBe(namespaceName + customExtension);

        fw.router.fileExtensions('.js');
      });

      it('can have a callback specified as the extension with it invoked and the return value used', function() {
        var namespaceName = tools.generateNamespaceName();
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
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, { namespace: namespaceName });
        });

        define(namespaceName, ['footwork'], function(fw) {
          return initializeSpy;
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can load via registered router with a declarative initialization', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.router.boot(this, { namespace: namespaceName }); });

        fw.router.register(namespaceName, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location', function(done) {
        var namespaceName = 'AMDRouter';

        fw.router.registerLocation(namespaceName, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
        var namespaceName = 'AMDRouterRegexp-test';

        fw.router.registerLocation(/AMDRouterRegexp-.*/, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
        var namespaceName = 'AMDRouterFullName';

        fw.router.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      // it('can be nested and initialized declaratively', function(done) {
      //   var outerInitializeSpy = jasmine.createSpy('outerInitializeSpy');
      //   var innerInitializeSpy = jasmine.createSpy('innerInitializeSpy');
      //   var outerNamespaceName = tools.randomString();
      //   var innerNamespaceName = tools.randomString();

      //   fw.router.create({
      //     namespace: outerNamespaceName,
      //     autoRegister: true,
      //     initialize: outerInitializeSpy
      //   });

      //   fw.router.create({
      //     namespace: innerNamespaceName,
      //     autoRegister: true,
      //     initialize: innerInitializeSpy
      //   });

      //   expect(outerInitializeSpy).not.toHaveBeenCalled();
      //   expect(innerInitializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + outerNamespaceName + '">\
      //                                 <router module="' + innerNamespaceName + '"></router>\
      //                               </router>'));

      //   setTimeout(function() {
      //     expect(outerInitializeSpy).toHaveBeenCalled();
      //     expect(innerInitializeSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can trigger the default route', function(done) {
      //   var namespaceName = tools.generateNamespaceName();
      //   var defaultRouteControllerSpy = jasmine.createSpy('defaultRouteControllerSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: '/',
      //         controller: defaultRouteControllerSpy
      //       }
      //     ]
      //   });

      //   expect(defaultRouteControllerSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

      //   setTimeout(function() {
      //     expect(defaultRouteControllerSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can trigger the unknownRoute', function(done) {
      //   var namespaceName = 'unknownRouteCheck';
      //   var unknownRouteControllerSpy = jasmine.createSpy('defaultRouteSpy');
      //   var initializeSpy;
      //   var router;

      //   fw.router.create({
      //     namespace: 'unknownRouteCheck',
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     unknownRoute: {
      //       controller: tools.expectCallOrder(1, unknownRouteControllerSpy)
      //     }
      //   });

      //   expect(unknownRouteControllerSpy).not.toHaveBeenCalled();
      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     router.setState(tools.generateUrl());
      //     expect(unknownRouteControllerSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can trigger a specified route', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
      //   var initializeSpy;
      //   var router;

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: routeControllerSpy
      //       }
      //     ]
      //   });

      //   expect(routeControllerSpy).not.toHaveBeenCalled();
      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));
      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     router.setState(mockUrl);
      //     expect(routeControllerSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can trigger a specified route that is defined within an array of route strings', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
      //   var initializeSpy;
      //   var router;

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: [ mockUrl, mockUrl + '2' ],
      //         controller: routeControllerSpy
      //       }
      //     ]
      //   });

      //   expect(routeControllerSpy).not.toHaveBeenCalled();
      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));
      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     router.setState(mockUrl + '2');
      //     expect(routeControllerSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can trigger a specified route with a required parameter', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var routeControllerSpy;
      //   var initializeSpy;
      //   var testParam = tools.randomString();
      //   var router;

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: mockUrl + '/:testParam',
      //         controller: tools.expectCallOrder(1, routeControllerSpy = jasmine.createSpy('routeControllerSpy', function(passedTestParam) {
      //           expect(passedTestParam).toBe(testParam);
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(routeControllerSpy).not.toHaveBeenCalled();
      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));
      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     router.setState(mockUrl + '/' + testParam);
      //     expect(routeControllerSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can trigger a specified route with an optional parameter with and without the parameter', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var routeControllerSpy;
      //   var initializeSpy;
      //   var optParamNotSuppliedSpy;
      //   var optParamSuppliedSpy;
      //   var testParam = tools.randomString();
      //   var router;

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: mockUrl + '/optParamNotSupplied(/:testParam)',
      //         controller: tools.expectCallOrder(1, optParamNotSuppliedSpy = jasmine.createSpy('optParamNotSuppliedSpy', function(testParam) {
      //           expect(testParam).toBe(undefined);
      //         }).and.callThrough())
      //       }, {
      //         route: mockUrl + '/optParamSupplied(/:testParam)',
      //         controller: tools.expectCallOrder(2, optParamSuppliedSpy = jasmine.createSpy('optParamSuppliedSpy', function(passedTestParam) {
      //           expect(passedTestParam).toBe(testParam);
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(optParamNotSuppliedSpy).not.toHaveBeenCalled();
      //   expect(optParamSuppliedSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

      //   setTimeout(function() {
      //     router.setState(mockUrl + '/optParamNotSupplied');
      //     expect(optParamNotSuppliedSpy).toHaveBeenCalled();

      //     router.setState(mockUrl + '/optParamSupplied/' + testParam);
      //     expect(optParamSuppliedSpy).toHaveBeenCalled();

      //     done();
      //   }, ajaxWait);
      // });

      // it('can manipulate an outlet', function(done) {
      //   var manipulateOutletUrl = tools.generateUrl();
      //   var manipulateOutletComponentNamespace = tools.randomString();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy;
      //   var afterRenderSpy;
      //   var manipulateOutletControllerSpy;
      //   var clearOutletControllerSpy;
      //   var manipulateOutletComponentSpy;
      //   var router;
      //   var testContainer;
      //   var $testContainer;

      //   fw.components.register(manipulateOutletComponentNamespace, {
      //     viewModel: tools.expectCallOrder(3, manipulateOutletComponentSpy = jasmine.createSpy('manipulateOutletComponentSpy')),
      //     template: '<div class="component-loaded"></div>'
      //   });

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     afterRender: tools.expectCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy')),
      //     routes: [
      //       {
      //         route: manipulateOutletUrl,
      //         controller: tools.expectCallOrder(2, manipulateOutletControllerSpy = jasmine.createSpy('manipulateOutletControllerSpy', function() {
      //           this.outlet('output', manipulateOutletComponentNamespace);
      //         }).and.callThrough())
      //       }, {
      //         route: '/clearOutlet',
      //         controller: tools.expectCallOrder(4, clearOutletControllerSpy = jasmine.createSpy('clearOutletControllerSpy', function() {
      //           this.outlet('output', false);
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(manipulateOutletControllerSpy).not.toHaveBeenCalled();
      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(afterRenderSpy).not.toHaveBeenCalled();
      //   expect(clearOutletControllerSpy).not.toHaveBeenCalled();
      //   expect(manipulateOutletComponentSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <outlet name="output"></outlet>\
      //   </router>'));
      //   $testContainer = $(testContainer);
      //   expect(initializeSpy).toHaveBeenCalled();
      //   expect(afterRenderSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     expect($testContainer.find('outlet[name="output"]').attr('rendered')).not.toBe(manipulateOutletComponentNamespace);
      //     router.setState(manipulateOutletUrl);
      //     expect(manipulateOutletControllerSpy).toHaveBeenCalled();

      //     setTimeout(function() {
      //       expect($testContainer.find('outlet[name="output"]').attr('rendered')).toBe(manipulateOutletComponentNamespace);
      //       expect($testContainer.find('outlet[name="output"] .component-loaded').length).toBe(1);

      //       router.setState('/clearOutlet');
      //       expect(clearOutletControllerSpy).toHaveBeenCalled();

      //       setTimeout(function() {
      //         expect($testContainer.find('outlet[name="output"]').attr('rendered')).not.toBe(manipulateOutletComponentNamespace);
      //         expect($testContainer.find('outlet[name="output"] .component-loaded').length).toBe(0);
      //         done();
      //       }, ajaxWait);
      //     }, ajaxWait);
      //   }, ajaxWait);
      // });

      // it('can see all/multiple referenced outlets defined in its context', function(done) {
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy;
      //   var router;

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough())
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <outlet name="output1"></outlet>\
      //     <outlet name="output2"></outlet>\
      //     <outlet name="output3"></outlet>\
      //   </router>'));

      //   setTimeout(function() {
      //     expect(initializeSpy).toHaveBeenCalled();
      //     expect(_.keys(router.outlets)).toEqual([ 'output1', 'output2', 'output3' ]);
      //     done();
      //   }, ajaxWait);
      // });

      // it('can have callback triggered after outlet component is resolved and composed', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var outletCallbackName = tools.randomString();
      //   var initializeSpy;
      //   var outletCallbackComponentSpy;
      //   var triggerOutletCallbackControllerSpy;
      //   var router;

      //   fw.components.register(outletCallbackName, {
      //     viewModel: tools.expectCallOrder(1, outletCallbackComponentSpy = jasmine.createSpy('outletCallbackComponentSpy')),
      //     template: '<div class="' + outletCallbackName + '"></div>'
      //   });

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: function() {
      //           this.outlet('output', outletCallbackName, tools.expectCallOrder(2, triggerOutletCallbackControllerSpy = jasmine.createSpy('triggerOutletCallbackControllerSpy', function(element) {
      //             expect(element.tagName.toLowerCase()).toBe('outlet');
      //             expect($(element).find('.' + outletCallbackName).length).toBe(1);
      //           })));
      //         }
      //       }
      //     ]
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(outletCallbackComponentSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <outlet name="output"></outlet>\
      //   </router>'));
      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     router.setState(mockUrl);
      //     expect(triggerOutletCallbackControllerSpy).not.toHaveBeenCalled();

      //     setTimeout(function() {
      //       expect(triggerOutletCallbackControllerSpy).toHaveBeenCalled();
      //       expect(outletCallbackComponentSpy).toHaveBeenCalled();
      //       done();
      //     }, ajaxWait);
      //   }, ajaxWait);
      // });

      // it('can instantiate and properly render an outlet after its router has initialized', function(done) {
      //   var outletControlingViewModelNamespace = tools.randomString();
      //   var outletComponentNamespace = tools.randomString();
      //   var routerNamespace = tools.randomString();
      //   var initializeSpy;
      //   var changeOutletControllerSpy;
      //   var outletCallbackSpy;
      //   var initializeViewModelSpy;
      //   var initializeComponentViewModelSpy;
      //   var router;
      //   var viewModel;

      //   fw.components.register(outletComponentNamespace, {
      //     viewModel: tools.expectCallOrder(3, initializeComponentViewModelSpy = jasmine.createSpy('initializeComponentViewModelSpy')),
      //     template: '<div class="' + outletComponentNamespace + '"></div>'
      //   });

      //   fw.viewModel.register(outletControlingViewModelNamespace, fw.viewModel.create({
      //     initialize: tools.expectCallOrder(1, initializeViewModelSpy = jasmine.createSpy('initializeViewModelSpy', function() {
      //       viewModel = this;
      //       this.outletVisible = fw.observable(false);
      //     }).and.callThrough())
      //   }));

      //   fw.router.create({
      //     namespace: routerNamespace,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       router = this;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: '/outletAfterRouter',
      //         controller: tools.expectCallOrder(2, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
      //           this.outlet('output', outletComponentNamespace, tools.expectCallOrder(4, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
      //             expect(element.tagName.toLowerCase()).toBe('outlet');
      //             expect($(element).find('.' + outletComponentNamespace).length).toBe(1);
      //           }).and.callThrough()));
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(initializeViewModelSpy).not.toHaveBeenCalled();
      //   expect(initializeComponentViewModelSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
      //     <viewModel module="' + outletControlingViewModelNamespace + '">\
      //       <div data-bind="if: outletVisible">\
      //         <outlet name="output"></outlet>\
      //       </div>\
      //     </viewModel>\
      //   </router>'));

      //   expect(initializeSpy).toHaveBeenCalled();
      //   expect(initializeViewModelSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     router.setState('/outletAfterRouter');

      //     expect(outletCallbackSpy).not.toHaveBeenCalled();
      //     expect(viewModel).toBeAn('object');

      //     viewModel.outletVisible(true);

      //     setTimeout(function() {
      //       expect(outletCallbackSpy).toHaveBeenCalled();
      //       expect(initializeComponentViewModelSpy).toHaveBeenCalled();
      //       done();
      //     }, ajaxWait);
      //   }, ajaxWait);
      // });

      // it('can display a temporary loading component in place of a component that is being downloaded', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var outletLoaderTestLoadingNamespace = tools.randomString();
      //   var outletLoaderTestLoadedNamespace = tools.randomString();
      //   var routerNamespace = tools.randomString();
      //   var changeOutletControllerSpy;
      //   var outletCallbackSpy;
      //   var outletLoaderTestLoadingSpy;
      //   var outletLoaderTestLoadedSpy;

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   fw.components.register(outletLoaderTestLoadingNamespace, {
      //     viewModel: tools.expectCallOrder(1, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
      //     template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
      //     synchronous: true
      //   });

      //   fw.components.register(outletLoaderTestLoadedNamespace, {
      //     viewModel: tools.expectCallOrder(2, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
      //     template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      //   });

      //   fw.router.create({
      //     namespace: routerNamespace,
      //     autoRegister: true,
      //     showDuringLoad: outletLoaderTestLoadingNamespace,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(0, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
      //           this.outlet('output', outletLoaderTestLoadedNamespace, tools.expectCallOrder(3, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
      //             expect(element.tagName.toLowerCase()).toBe('outlet');
      //             expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
      //           }).and.callThrough()));
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
      //     <outlet name="output"></outlet>\
      //   </router>'));

      //   router(routerNamespace).setState(mockUrl);

      //   expect(changeOutletControllerSpy).toHaveBeenCalled();
      //   expect(outletCallbackSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      //   setTimeout(function() {
      //     expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
      //     expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
      //     expect(outletCallbackSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can display a temporary loading component (source from callback) in place of a component that is being downloaded', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var outletLoaderTestLoadingNamespace = tools.randomString();
      //   var outletLoaderTestLoadedNamespace = tools.randomString();
      //   var routerNamespace = tools.randomString();
      //   var changeOutletControllerSpy;
      //   var outletCallbackSpy;
      //   var outletLoaderTestLoadingSpy;
      //   var outletLoaderTestLoadedSpy;
      //   var initializeRouterSpy;
      //   var showDuringLoadSpy;
      //   var theRouter;

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   fw.components.register(outletLoaderTestLoadingNamespace, {
      //     viewModel: tools.expectCallOrder(3, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
      //     template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
      //     synchronous: true
      //   });

      //   fw.components.register(outletLoaderTestLoadedNamespace, {
      //     viewModel: tools.expectCallOrder(4, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
      //     template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      //   });

      //   fw.router.create({
      //     namespace: routerNamespace,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeRouterSpy = jasmine.createSpy('initializeRouterSpy', function() {
      //       theRouter = this;
      //     }).and.callThrough()),
      //     showDuringLoad: tools.expectCallOrder(2, showDuringLoadSpy = jasmine.createSpy('showDuringLoadSpy', function(outletName, componentToDisplay) {
      //       expect(this).toBe(theRouter);
      //       expect(outletName).toBe('output');
      //       expect(componentToDisplay).toBe(outletLoaderTestLoadedNamespace);
      //       return outletLoaderTestLoadingNamespace;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
      //           this.outlet('output', outletLoaderTestLoadedNamespace, tools.expectCallOrder(5, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
      //             expect(element.tagName.toLowerCase()).toBe('outlet');
      //             expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
      //           }).and.callThrough()));
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
      //     <outlet name="output"></outlet>\
      //   </router>'));

      //   router(routerNamespace).setState(mockUrl);

      //   expect(changeOutletControllerSpy).toHaveBeenCalled();
      //   expect(outletCallbackSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      //   setTimeout(function() {
      //     expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
      //     expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
      //     expect(outletCallbackSpy).toHaveBeenCalled();
      //     done();
      //   }, ajaxWait);
      // });

      // it('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var outletLoaderTestLoadingNamespace = tools.randomString();
      //   var outletLoaderTestLoadedNamespace = tools.randomString();
      //   var routerNamespace = tools.randomString();
      //   var changeOutletControllerSpy;
      //   var outletCallbackSpy;
      //   var outletLoaderTestLoadingSpy;
      //   var outletLoaderTestLoadedSpy;

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   fw.components.register(outletLoaderTestLoadingNamespace, {
      //     viewModel: tools.expectCallOrder(1, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
      //     template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
      //     synchronous: true
      //   });

      //   fw.components.register(outletLoaderTestLoadedNamespace, {
      //     viewModel: tools.expectCallOrder(2, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
      //     template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      //   });

      //   fw.router.create({
      //     namespace: routerNamespace,
      //     autoRegister: true,
      //     showDuringLoad: outletLoaderTestLoadingNamespace,
      //     minTransitionPeriod: 75,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(0, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
      //           this.outlet('output', outletLoaderTestLoadedNamespace, tools.expectCallOrder(3, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
      //             expect(element.tagName.toLowerCase()).toBe('outlet');
      //             expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
      //           }).and.callThrough()));
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
      //     <outlet name="output"></outlet>\
      //   </router>'));

      //   router(routerNamespace).setState(mockUrl);

      //   expect(changeOutletControllerSpy).toHaveBeenCalled();
      //   expect(outletCallbackSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      //   setTimeout(function() {
      //     expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
      //     expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
      //     expect(testContainer).not.toContainElement('.fw-loaded-display.' + footworkAnimationClass);
      //     expect(outletCallbackSpy).not.toHaveBeenCalled();
      //     setTimeout(function() {
      //       expect(testContainer).toContainElement('.fw-loaded-display.' + footworkAnimationClass);
      //       expect(outletCallbackSpy).toHaveBeenCalled();
      //       done();
      //     }, 120);
      //   }, 20);
      // });

      // it('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time from callback', function(done) {
      //   var mockUrl = tools.generateUrl();
      //   var outletLoaderTestLoadingNamespace = tools.randomString();
      //   var outletLoaderTestLoadedNamespace = tools.randomString();
      //   var routerNamespace = tools.randomString();
      //   var changeOutletControllerSpy;
      //   var outletCallbackSpy;
      //   var outletLoaderTestLoadingSpy;
      //   var outletLoaderTestLoadedSpy;
      //   var minTransitionPeriodSpy;

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   fw.components.register(outletLoaderTestLoadingNamespace, {
      //     viewModel: tools.expectCallOrder(2, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
      //     template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
      //     synchronous: true
      //   });

      //   fw.components.register(outletLoaderTestLoadedNamespace, {
      //     viewModel: tools.expectCallOrder(3, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
      //     template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
      //   });

      //   fw.router.create({
      //     namespace: routerNamespace,
      //     autoRegister: true,
      //     showDuringLoad: outletLoaderTestLoadingNamespace,
      //     minTransitionPeriod: tools.expectCallOrder(1, minTransitionPeriodSpy = jasmine.createSpy('minTransitionPeriodSpy', function(outletName, componentToDisplay) {
      //       expect(outletName).toBe('output');
      //       expect(componentToDisplay).toBe(outletLoaderTestLoadedNamespace);
      //       return 75;
      //     }).and.callThrough()),
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(0, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
      //           this.outlet('output', outletLoaderTestLoadedNamespace, tools.expectCallOrder(4, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
      //             expect(element.tagName.toLowerCase()).toBe('outlet');
      //             expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
      //           }).and.callThrough()));
      //         }).and.callThrough())
      //       }
      //     ]
      //   });

      //   expect(changeOutletControllerSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();
      //   expect(minTransitionPeriodSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
      //     <outlet name="output"></outlet>\
      //   </router>'));

      //   router(routerNamespace).setState(mockUrl);
      //   expect(minTransitionPeriodSpy).toHaveBeenCalled();

      //   expect(changeOutletControllerSpy).toHaveBeenCalled();
      //   expect(outletCallbackSpy).not.toHaveBeenCalled();
      //   expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

      //   setTimeout(function() {
      //     expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
      //     expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
      //     expect(outletCallbackSpy).not.toHaveBeenCalled();
      //     setTimeout(function() {
      //       expect(outletCallbackSpy).toHaveBeenCalled();
      //       done();
      //     }, 120);
      //   }, 20);
      // });

      // it('can have nested/child routers path be dependent on its parents', function(done) {
      //   var outerNestedRouteNamespace = tools.randomString();
      //   var innerNestedRouteNamespace = tools.randomString();
      //   var subInnerNestedRouteNamespace = tools.randomString();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');

      //   fw.router.create({
      //     namespace: outerNestedRouteNamespace,
      //     autoRegister: true,
      //     routes: [
      //       { route: '/' },
      //       { route: '/outerRoute' }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   fw.router.create({
      //     namespace: innerNestedRouteNamespace,
      //     autoRegister: true,
      //     routes: [
      //       { route: '/' },
      //       { route: '/innerRoute' }
      //     ],
      //     initialize: tools.expectCallOrder(1, initializeSpy)
      //   });

      //   fw.router.create({
      //     namespace: subInnerNestedRouteNamespace,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(2, initializeSpy)
      //   });

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + outerNestedRouteNamespace + '">\
      //     <router module="' + innerNestedRouteNamespace + '">\
      //       <router module="' + subInnerNestedRouteNamespace + '"></router>\
      //     </router>\
      //   </router>'));

      //   expect(initializeSpy).toHaveBeenCalledTimes(3);

      //   setTimeout(function() {
      //     var outer = router(outerNestedRouteNamespace);
      //     var inner = router(innerNestedRouteNamespace);
      //     var subInner = router(subInnerNestedRouteNamespace);

      //     expect(outer.path()).toBe('/');
      //     expect(inner.path()).toBe('//');
      //     expect(subInner.path()).toBe('///');

      //     outer.setState('/outerRoute');

      //     expect(outer.path()).toBe('/outerRoute');
      //     expect(inner.path()).toBe('/outerRoute/');
      //     expect(subInner.path()).toBe('/outerRoute//');

      //     inner.setState('/innerRoute');

      //     expect(outer.path()).toBe('/outerRoute');
      //     expect(inner.path()).toBe('/outerRoute/innerRoute');
      //     expect(subInner.path()).toBe('/outerRoute/innerRoute/');

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a nested/child router which is not relative to its parent', function(done) {
      //   var outerNestedRouteNamespace = tools.randomString();
      //   var innerNestedRouteNamespace = tools.randomString();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');

      //   fw.router.create({
      //     namespace: outerNestedRouteNamespace,
      //     autoRegister: true,
      //     routes: [
      //       { route: '/' },
      //       { route: '/outerRoute' }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   fw.router.create({
      //     namespace: innerNestedRouteNamespace,
      //     autoRegister: true,
      //     isRelative: false,
      //     routes: [
      //       { route: '/' },
      //       { route: '/outerRoute' }
      //     ],
      //     initialize: tools.expectCallOrder(1, initializeSpy)
      //   });

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   fw.start(testContainer = tools.getFixtureContainer('<router module="' + outerNestedRouteNamespace + '">\
      //     <router module="' + innerNestedRouteNamespace + '"></router>\
      //   </router>'));

      //   expect(initializeSpy).toHaveBeenCalledTimes(2);

      //   setTimeout(function() {
      //     var outer = router(outerNestedRouteNamespace);
      //     var inner = router(innerNestedRouteNamespace);

      //     expect(outer.path()).toBe('/');
      //     expect(inner.path()).toBe('/');

      //     outer.setState('/outerRoute');

      //     expect(outer.path()).toBe('/outerRoute');
      //     expect(inner.path()).toBe('/outerRoute');

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link correctly composed with an href attribute using passed in string route', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: \'' + mockUrl + '\'"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.attr('href')).toBe(mockUrl);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link correctly composed using the elements existing href attribute', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   function router(name) {
      //     return fw.router.getAll(name)[0];
      //   }

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a href="' + mockUrl + '" data-bind="$route"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.attr('href')).toBe(mockUrl);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link correctly composed with an href attribute using an observable', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var routerNamespaceName = tools.randomString();
      //   var viewModelNamespaceName = tools.randomString();
      //   var viewModelInitializeSpy;
      //   var routerInitializeSpy = jasmine.createSpy('routerInitializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');
      //   var changedRouteSpy = jasmine.createSpy('changedRouteSpy');

      //   fw.router.create({
      //     namespace: routerNamespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: '/routeHrefBindingObservable',
      //         controller: tools.expectCallOrder(2, routeSpy)
      //       }, {
      //         route: '/routeHrefBindingObservableChangedRoute',
      //         controller: tools.expectCallOrder(3, changedRouteSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, routerInitializeSpy)
      //   });

      //   fw.viewModel.create({
      //     namespace: viewModelNamespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(1, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
      //       this.routeHrefBindingObservable = fw.observable('/routeHrefBindingObservable');
      //     }).and.callThrough())
      //   });

      //   function viewModel(name) {
      //     return fw.viewModel.getAll(name)[0];
      //   }

      //   expect(routerInitializeSpy).not.toHaveBeenCalled();
      //   expect(viewModelInitializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();
      //   expect(changedRouteSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
      //     <viewModel module="' + viewModelNamespaceName + '">\
      //       <a data-bind="$route: routeHrefBindingObservable"></a>\
      //     </viewModel>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(routerInitializeSpy).toHaveBeenCalled();
      //   expect(viewModelInitializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect(changedRouteSpy).not.toHaveBeenCalled();
      //     expect($link.attr('href')).toBe('/routeHrefBindingObservable');

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect(changedRouteSpy).not.toHaveBeenCalled();

      //     viewModel(viewModelNamespaceName).routeHrefBindingObservable('/routeHrefBindingObservableChangedRoute');
      //     expect($link.attr('href')).toBe('/routeHrefBindingObservableChangedRoute');

      //     $link.click();
      //     expect(changedRouteSpy).toHaveBeenCalled();

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that expresses the default active class when the route matches', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   var $testContainer = $(testContainer);
      //   var routerInitialized = false;
      //   var routeTouched = false;

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: \'' + mockUrl + '\'"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that expresses a custom \'active\' class when the route matches', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var activeClassName = tools.randomString();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\' }"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass(activeClassName)).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass(activeClassName)).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that expresses a custom \'active\' class on the direct parent element', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var activeClassName = tools.randomString();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <div>\
      //       <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\', parentHasState: true }"></a>\
      //     </div>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.parent().hasClass(activeClassName)).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.parent().hasClass(activeClassName)).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that expresses an \'active\' class on the selected parent element', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var activeClassName = tools.randomString();
      //   var parentClassName = tools.randomString();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //       <div class="parent-class-name">\
      //         <div>\
      //           <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\', parentHasState: \'.parent-class-name\' }"></a>\
      //         </div>\
      //       </div>\
      //     </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $testContainer = $(testContainer);
      //     var $link = $testContainer.find('a');
      //     var $elementThatHasState = $testContainer.find('.parent-class-name');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($elementThatHasState.hasClass(activeClassName)).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($elementThatHasState.hasClass(activeClassName)).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that expresses a custom \'active\' class defined by an observable when the route matches', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var routerNamespaceName = tools.randomString();
      //   var viewModelNamespaceName = tools.randomString();
      //   var activeClassName = tools.randomString();
      //   var parentClassName = tools.randomString();
      //   var viewModelInitializeSpy;
      //   var routerInitializeSpy = jasmine.createSpy('routerInitializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.viewModel.create({
      //     namespace: viewModelNamespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(1, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
      //       this.activeClassObservable = fw.observable(activeClassName);
      //     }).and.callThrough())
      //   });

      //   fw.router.create({
      //     namespace: routerNamespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(2, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, routerInitializeSpy)
      //   });

      //   expect(viewModelInitializeSpy).not.toHaveBeenCalled();
      //   expect(routerInitializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
      //     <viewModel module="' + viewModelNamespaceName + '">\
      //       <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: activeClassObservable }"></a>\
      //     </viewModel>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(routerInitializeSpy).toHaveBeenCalled();
      //   expect(viewModelInitializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass(activeClassName)).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass(activeClassName)).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that disables the active class state based on a raw boolean flag', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: { url: \'' + mockUrl + '\', addActiveClass: false }"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that disables the active class state using an observable', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy;
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       this.disableActiveClass = fw.observable(false);
      //     }).and.callThrough())
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: { url: \'' + mockUrl + '\', addActiveClass: disableActiveClass }"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that triggers based on a custom event defined by a string', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy = jasmine.createSpy('initializeSpy');
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy)
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: { url: \'' + mockUrl + '\', on: \'dblclick\' }"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     $link.dblclick();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link that triggers based on a custom event defined by a callback/observable', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var namespaceName = tools.generateNamespaceName();
      //   var initializeSpy;
      //   var routeSpy = jasmine.createSpy('routeSpy');

      //   fw.router.create({
      //     namespace: namespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(1, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
      //       this.customEvent = fw.observable('dblclick');
      //     }).and.callThrough())
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
      //     <a data-bind="$route: { url: \'' + mockUrl + '\', on: customEvent }"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);

      //     $link.dblclick();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link correctly composed with a custom callback handler', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var routerNamespaceName = tools.randomString();
      //   var viewModelNamespaceName = tools.randomString();
      //   var viewModelInitializeSpy;
      //   var routerInitializeSpy;
      //   var customHandlerSpy;
      //   var routeSpy = jasmine.createSpy('routeSpy');
      //   var allowHandlerEvent;

      //   fw.router.create({
      //     namespace: routerNamespaceName,
      //     autoRegister: true,
      //     routes: [
      //       {
      //         route: mockUrl,
      //         controller: tools.expectCallOrder(4, routeSpy)
      //       }
      //     ],
      //     initialize: tools.expectCallOrder(0, routerInitializeSpy = jasmine.createSpy('routerInitializeSpy', function() {
      //       this.customEvent = fw.observable('dblclick');
      //     }).and.callThrough())
      //   });

      //   fw.viewModel.create({
      //     namespace: viewModelNamespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(1, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
      //       this.routeHrefBindingCustomHandler = tools.expectCallOrder([2, 3], customHandlerSpy = jasmine.createSpy('customHandlerSpy', function(event, url) {
      //         expect(event).toBeAn('object');
      //         expect(url).toBeA('string');
      //         return allowHandlerEvent;
      //       }).and.callThrough());
      //     }).and.callThrough())
      //   });

      //   expect(routerInitializeSpy).not.toHaveBeenCalled();
      //   expect(viewModelInitializeSpy).not.toHaveBeenCalled();
      //   expect(routeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
      //     <viewModel module="' + viewModelNamespaceName + '">\
      //       <a data-bind="$route: { url: \'' + mockUrl + '\', handler: routeHrefBindingCustomHandler }"></a>\
      //     </viewModel>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(customHandlerSpy).not.toHaveBeenCalled();
      //   expect(routerInitializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect($link.hasClass('active')).toBe(false);
      //     expect($link.attr('href')).toBe(mockUrl);

      //     allowHandlerEvent = false;
      //     $link.click();
      //     expect(routeSpy).not.toHaveBeenCalled();
      //     expect(customHandlerSpy).toHaveBeenCalledTimes(1);
      //     expect($link.hasClass('active')).toBe(false);

      //     allowHandlerEvent = true;
      //     $link.click();
      //     expect(routeSpy).toHaveBeenCalled();
      //     expect(customHandlerSpy).toHaveBeenCalledTimes(2);
      //     expect($link.hasClass('active')).toBe(true);

      //     done();
      //   }, ajaxWait);
      // });

      // it('can have a $route bound link correctly composed with a custom URL callback', function(done) {
      //   var testContainer;
      //   var mockUrl = tools.generateUrl();
      //   var routerNamespaceName = tools.randomString();
      //   var viewModelNamespaceName = tools.randomString();
      //   var viewModelInitializeSpy;
      //   var initializeSpy;
      //   var urlResolverSpy;
      //   var allowHandlerEvent;

      //   fw.router.create({
      //     namespace: routerNamespaceName,
      //     autoRegister: true,
      //     initialize: tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
      //       this.routeHrefBindingCustomUrlCallback = urlResolverSpy = jasmine.createSpy('urlResolverSpy', function() {
      //         return mockUrl;
      //       }).and.callThrough();
      //     }).and.callThrough())
      //   });

      //   expect(initializeSpy).not.toHaveBeenCalled();

      //   testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
      //     <a data-bind="$route: { url: routeHrefBindingCustomUrlCallback }"></a>\
      //   </router>');
      //   fw.start(testContainer);

      //   expect(urlResolverSpy).toHaveBeenCalled();
      //   expect(initializeSpy).toHaveBeenCalled();

      //   setTimeout(function() {
      //     var $link = $(testContainer).find('a');

      //     expect($link.hasClass('active')).toBe(false);
      //     expect($link.attr('href')).toBe(mockUrl);

      //     done();
      //   }, ajaxWait);
      // });
    });
  }
);
