define(['footwork', 'lodash', 'jquery', 'tools'],
  function(fw, _, $, tools) {
    describe('router', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      beforeAll(function() {
        fw.router.disableHistory(true);
      });

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

        expect(_.keys(fw.router.get())).lengthToBeGreaterThan(0);
      });

      it('can get instantiated routers', function() {
        var routers = [];
        var specificRouterNamespace = tools.generateNamespaceName();
        var Router = function() {
          fw.router.boot(this, { namespace: specificRouterNamespace });
        };
        var numToMake = _.random(2,15);

        for(var x = numToMake; x; x--) {
          routers.push(new Router());
        }

        var singleRouterNamespace = tools.generateNamespaceName();
        new (function() {
          fw.router.boot(this, { namespace: singleRouterNamespace });
        })();
        expect(fw.router.get(singleRouterNamespace)).toBeAn('object');

        expect(fw.router.get(tools.generateNamespaceName())).toBe(undefined);
        expect(fw.router.get(specificRouterNamespace)).lengthToBe(numToMake);
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

      it('can be nested and initialized declaratively', function(done) {
        var outerInitializeSpy;
        var innerInitializeSpy;
        var outerNamespaceName = tools.randomString();
        var innerNamespaceName = tools.randomString();

        fw.router.register(outerNamespaceName, outerInitializeSpy = jasmine.createSpy('outerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: outerNamespaceName
          });
        }).and.callThrough());

        fw.router.register(innerNamespaceName, innerInitializeSpy = jasmine.createSpy('innerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: innerNamespaceName
          });
        }).and.callThrough());

        expect(outerInitializeSpy).not.toHaveBeenCalled();
        expect(innerInitializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + outerNamespaceName + '">\
                                      <router module="' + innerNamespaceName + '"></router>\
                                    </router>'));

        setTimeout(function() {
          expect(outerInitializeSpy).toHaveBeenCalled();
          expect(innerInitializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger the unknownRoute', function(done) {
        var namespaceName = 'unknownRouteCheck';
        var unknownRouteControllerSpy = jasmine.createSpy('unknownRouteControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: 'unknownRouteCheck',
            routes: [
              { unknown: true, controller: tools.expectCallOrder(1, unknownRouteControllerSpy) }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(unknownRouteControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(tools.generateUrl());
          expect(unknownRouteControllerSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger a specified route', function(done) {
        var mockUrl = tools.generateUrl();
        var mockUrl2 = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeControllerSpy
              },
              {
                route: mockUrl2,
                controller: routeControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          router.replaceState(mockUrl);
          expect(routeControllerSpy).toHaveBeenCalled();
          expect(router.$currentRoute().route).toBe(mockUrl);

          router.replaceState(mockUrl2);
          expect(routeControllerSpy).toHaveBeenCalledTimes(2);
          expect(router.$currentRoute().route).toBe(mockUrl2);

          done();
        }, ajaxWait);
      });

      it('can trigger a specified name-based route', function(done) {
        var mockNamedState = tools.randomString();
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                name: mockNamedState,
                controller: routeControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(mockNamedState, { named: true });
          expect(routeControllerSpy).toHaveBeenCalled();

          expect(function() {router.replaceState('state-that-does-not-exist', { named: true })}).toThrow();

          done();
        }, ajaxWait);
      });

      it('can trigger a specified route that is defined within an array of route strings', function(done) {
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: [ mockUrl, mockUrl + '2' ],
                controller: routeControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(mockUrl + '2');
          expect(routeControllerSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger a specified route with a required parameter', function(done) {
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var routeControllerSpy;
        var initializeSpy;
        var testParam = tools.randomString();
        var router;

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl + '/:testParam',
                controller: tools.expectCallOrder(1, routeControllerSpy = jasmine.createSpy('routeControllerSpy', function(passedTestParam) {
                  expect(passedTestParam).toBe(testParam);
                }).and.callThrough())
              }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(routeControllerSpy).toBe(undefined);
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(mockUrl + '/' + testParam);
          expect(routeControllerSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger a specified route with an optional parameter with and without the parameter', function(done) {
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var routeControllerSpy;
        var initializeSpy;
        var optParamNotSuppliedSpy;
        var optParamSuppliedSpy;
        var testParam = tools.randomString();
        var router;

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl + '/optParamNotSupplied(/:testParam)',
                controller: tools.expectCallOrder(1, optParamNotSuppliedSpy = jasmine.createSpy('optParamNotSuppliedSpy', function(testParam) {
                  expect(testParam).toBe(undefined);
                }).and.callThrough())
              }, {
                route: mockUrl + '/optParamSupplied(/:testParam)',
                controller: tools.expectCallOrder(2, optParamSuppliedSpy = jasmine.createSpy('optParamSuppliedSpy', function(passedTestParam) {
                  expect(passedTestParam).toBe(testParam);
                }).and.callThrough())
              }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(optParamNotSuppliedSpy).toBe(undefined);
        expect(optParamSuppliedSpy).toBe(undefined);

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          router.replaceState(mockUrl + '/optParamNotSupplied');
          expect(optParamNotSuppliedSpy).toHaveBeenCalled();

          router.replaceState(mockUrl + '/optParamSupplied/' + testParam);
          expect(optParamSuppliedSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can manipulate an outlet', function(done) {
        var manipulateOutletUrl = tools.generateUrl();
        var manipulateOutletComponentNamespace = tools.randomString();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var afterRenderSpy;
        var manipulateOutletControllerSpy;
        var clearOutletControllerSpy;
        var emptyOutletControllerSpy;
        var manipulateOutletComponentSpy;
        var outletOnCompleteSpy = jasmine.createSpy();
        var router;
        var testContainer;
        var $testContainer;
        var passedInParams = { params: true };

        fw.components.register(manipulateOutletComponentNamespace, {
          viewModel: manipulateOutletComponentSpy = jasmine.createSpy('manipulateOutletComponentSpy', function(params) {
            expect(params).toBe(passedInParams);
          }).and.callThrough(),
          template: '<div class="component-loaded"></div>'
        });

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy'),
            routes: [
              {
                route: manipulateOutletUrl,
                controller: manipulateOutletControllerSpy = jasmine.createSpy('manipulateOutletControllerSpy', function(params) {
                  this.outlet('output', manipulateOutletComponentNamespace, { params: passedInParams, onComplete: outletOnCompleteSpy });
                }).and.callThrough()
              }, {
                route: '/clearOutlet',
                controller: clearOutletControllerSpy = jasmine.createSpy('clearOutletControllerSpy', function() {
                  this.outlet('output', false);
                }).and.callThrough()
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(manipulateOutletControllerSpy).toBe(undefined);
        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);
        expect(clearOutletControllerSpy).toBe(undefined);
        expect(manipulateOutletComponentSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <outlet name="output"></outlet>\
        </router>'));
        $testContainer = $(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(afterRenderSpy).toHaveBeenCalled();

          expect($testContainer.find('outlet[name="output"]').attr('data-rendered')).not.toBe(manipulateOutletComponentNamespace);
          router.replaceState(manipulateOutletUrl);
          expect(manipulateOutletControllerSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect($testContainer.find('outlet[name="output"]').attr('data-rendered')).toBe(manipulateOutletComponentNamespace);
            expect($testContainer.find('outlet[name="output"] .component-loaded').length).toBe(1);

            router.replaceState('/clearOutlet');
            expect(clearOutletControllerSpy).toHaveBeenCalled();

            setTimeout(function() {
              expect($testContainer.find('outlet[name="output"]').attr('data-rendered')).not.toBe(manipulateOutletComponentNamespace);
              expect($testContainer.find('outlet[name="output"] .component-loaded').length).toBe(0);
              expect(outletOnCompleteSpy).toHaveBeenCalled();
              done();
            }, ajaxWait);
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can see all/multiple referenced outlets defined in its context', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName
          });
          router = this;
        }).and.callThrough()));

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <outlet name="output1"></outlet>\
          <outlet name="output2"></outlet>\
          <outlet name="output3"></outlet>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(_.keys(fw.utils.getPrivateData(router).outlets)).toEqual([ 'output1', 'output2', 'output3' ]);
          done();
        }, ajaxWait);
      });

      it('can properly unregister an outlet with its parent router', function(done) {
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var router;
        var outletName = tools.randomString();

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName
          });
          this.show = fw.observable(true);
          router = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <!-- ko if: show -->\
            <outlet name="' + outletName + '"></outlet>\
          <!-- /ko -->\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(fw.utils.getPrivateData(router).outlets[outletName]).not.toBe(undefined);

          router.show(false);
          expect(fw.utils.getPrivateData(router).outlets[outletName]).toBe(undefined);
          done();
        }, ajaxWait);
      });

      it('can have callback triggered after outlet component is resolved and composed', function(done) {
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var outletCallbackName = tools.randomString();
        var initializeSpy;
        var outletCallbackComponentSpy;
        var triggerOutletCallbackControllerSpy;
        var router;

        fw.components.register(outletCallbackName, {
          viewModel: tools.expectCallOrder(1, outletCallbackComponentSpy = jasmine.createSpy('outletCallbackComponentSpy')),
          template: '<div class="' + outletCallbackName + '"></div>'
        });

        fw.router.register(namespaceName, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: function() {
                  this.outlet('output', outletCallbackName, tools.expectCallOrder(2, triggerOutletCallbackControllerSpy = jasmine.createSpy('triggerOutletCallbackControllerSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletCallbackName).length).toBe(1);
                  })));
                }
              }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(outletCallbackComponentSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <outlet name="output"></outlet>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          router.replaceState(mockUrl);
          expect(triggerOutletCallbackControllerSpy).not.toHaveBeenCalled();

          setTimeout(function() {
            expect(triggerOutletCallbackControllerSpy).toHaveBeenCalled();
            expect(outletCallbackComponentSpy).toHaveBeenCalled();
            done();
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can instantiate and properly render an outlet after its router has initialized', function(done) {
        var outletControlingViewModelNamespace = tools.randomString();
        var outletComponentNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var initializeSpy;
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var initializeViewModelSpy;
        var initializeComponentViewModelSpy;
        var router;
        var viewModel;

        fw.components.register(outletComponentNamespace, {
          viewModel: tools.expectCallOrder(3, initializeComponentViewModelSpy = jasmine.createSpy('initializeComponentViewModelSpy')),
          template: '<div class="' + outletComponentNamespace + '"></div>'
        });

        fw.viewModel.register(outletControlingViewModelNamespace, tools.expectCallOrder(1, initializeViewModelSpy = jasmine.createSpy('initializeViewModelSpy', function() {
          fw.viewModel.boot(this, {
            namespace: outletControlingViewModelNamespace
          });
          viewModel = this;
          this.outletVisible = fw.observable(false);
        }).and.callThrough()));

        fw.router.register(routerNamespace, tools.expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            routes: [
              {
                route: '/outletAfterRouter',
                controller: tools.expectCallOrder(2, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletComponentNamespace, tools.expectCallOrder(4, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletComponentNamespace).length).toBe(1);
                  }).and.callThrough()));
                }).and.callThrough())
              }
            ]
          });
          router = this;
        }).and.callThrough()));

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(initializeViewModelSpy).not.toHaveBeenCalled();
        expect(initializeComponentViewModelSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <viewModel module="' + outletControlingViewModelNamespace + '">\
            <div data-bind="if: outletVisible">\
              <outlet name="output"></outlet>\
            </div>\
          </viewModel>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(initializeViewModelSpy).toHaveBeenCalled();

          router.replaceState('/outletAfterRouter');

          expect(outletCallbackSpy).not.toHaveBeenCalled();
          expect(viewModel).toBeAn('object');

          viewModel.outletVisible(true);

          setTimeout(function() {
            expect(outletCallbackSpy).toHaveBeenCalled();
            expect(initializeComponentViewModelSpy).toHaveBeenCalled();
            done();
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can display a temporary loading component in place of a component that is being downloaded', function(done) {
        var mockUrl = tools.generateUrl();
        var outletLoaderTestLoadingNamespace = tools.randomString();
        var outletLoaderTestLoadedNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var outletLoaderTestLoadingSpy;
        var outletLoaderTestLoadedSpy;

        function router(name) {
          return fw.router.get(name);
        }

        fw.components.register(outletLoaderTestLoadingNamespace, {
          viewModel: tools.expectCallOrder(0, outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy')),
          template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
          synchronous: true
        });

        fw.components.register(outletLoaderTestLoadedNamespace, {
          viewModel: tools.expectCallOrder(2, outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy')),
          template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
        });

        fw.router.register(routerNamespace, function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            showDuringLoad: outletLoaderTestLoadingNamespace,
            routes: [
              {
                route: mockUrl,
                controller: tools.expectCallOrder(1, changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletLoaderTestLoadedNamespace, tools.expectCallOrder(3, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough()));
                }).and.callThrough())
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);

          expect(changeOutletControllerSpy).toHaveBeenCalled();
          expect(outletCallbackSpy).not.toHaveBeenCalled();
          expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
            expect(outletCallbackSpy).toHaveBeenCalled();
            done();
          }, ajaxWait);
        }, 0);
      });

      it('can display the default temporary loading component in place of a component that is being downloaded', function(done) {
        var mockUrl = tools.generateUrl();
        var outletLoaderTestLoadingNamespace = tools.randomString();
        var outletLoaderTestLoadedNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var outletLoaderTestLoadedSpy;

        function router(name) {
          return fw.router.get(name);
        }

        fw.components.register(outletLoaderTestLoadedNamespace, {
          viewModel: outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy'),
          template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
        });

        fw.router.register(routerNamespace, function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            showDuringLoad: true,
            routes: [
              {
                route: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletLoaderTestLoadedNamespace, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.default-loading-display').length).toBe(1);
                  }).and.callThrough());
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);

          expect(changeOutletControllerSpy).toHaveBeenCalled();
          expect(outletCallbackSpy).not.toHaveBeenCalled();

          setTimeout(function() {
            expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
            expect(outletCallbackSpy).toHaveBeenCalled();
            done();
          }, ajaxWait);
        }, 0);
      });

      it('can display a temporary loading component (source from callback) in place of a component that is being downloaded', function(done) {
        var mockUrl = tools.generateUrl();
        var outletLoaderTestLoadingNamespace = tools.randomString();
        var outletLoaderTestLoadedNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var outletLoaderTestLoadingSpy;
        var outletLoaderTestLoadedSpy;

        function router(name) {
          return fw.router.get(name);
        }

        fw.components.register(outletLoaderTestLoadingNamespace, {
          viewModel: outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy'),
          template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
          synchronous: true
        });

        fw.components.register(outletLoaderTestLoadedNamespace, {
          viewModel: outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy'),
          template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
        });

        fw.router.register(routerNamespace, function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            showDuringLoad: showDuringLoadSpy = jasmine.createSpy('showDuringLoadSpy', function(outletName, componentToDisplay) {
              expect(outletName).toBe('output');
              return outletLoaderTestLoadingNamespace;
            }).and.callThrough(),
            routes: [
              {
                route: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletLoaderTestLoadedNamespace, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough());
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);

          expect(changeOutletControllerSpy).toHaveBeenCalled();
          expect(outletCallbackSpy).not.toHaveBeenCalled();
          expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
            expect(outletCallbackSpy).toHaveBeenCalled();
            done();
          }, ajaxWait);
        }, 0);
      });

      it('can display a temporary loading component (source from callback) in place of a component that is being downloaded', function(done) {
        var mockUrl = tools.generateUrl();
        var outletLoaderTestLoadingNamespace = tools.randomString();
        var outletLoaderTestLoadedNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var outletLoaderTestLoadingSpy;
        var outletLoaderTestLoadedSpy;
        var initializeRouterSpy;
        var showDuringLoadSpy;
        var theRouter;

        function router(name) {
          return fw.router.get(name);
        }

        fw.components.register(outletLoaderTestLoadingNamespace, {
          viewModel: outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy'),
          template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>'
        });

        fw.components.register(outletLoaderTestLoadedNamespace, {
          viewModel: outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy'),
          template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
        });

        fw.router.register(routerNamespace, initializeRouterSpy = jasmine.createSpy('initializeRouterSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            showDuringLoad: showDuringLoadSpy = jasmine.createSpy('showDuringLoadSpy', function(outletName, componentToDisplay) {
              expect(outletName).toBe('output');
              return outletLoaderTestLoadingNamespace;
            }).and.callThrough(),
            routes: [
              {
                route: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletLoaderTestLoadedNamespace, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough());
                }).and.callThrough()
              }
            ]
          });
          theRouter = this;
        }).and.callThrough());

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);
          expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();
          expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect(changeOutletControllerSpy).toHaveBeenCalled();
            expect(outletCallbackSpy).not.toHaveBeenCalled();

            setTimeout(function() {
              expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
              expect(outletCallbackSpy).toHaveBeenCalled();
              done();
            }, ajaxWait);
          }, 0);
        }, 0);
      });

      it('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time', function(done) {
        var mockUrl = tools.generateUrl();
        var outletLoaderTestLoadingNamespace = tools.randomString();
        var outletLoaderTestLoadedNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var outletLoaderTestLoadingSpy;
        var outletLoaderTestLoadedSpy;

        function router(name) {
          return fw.router.get(name);
        }

        fw.components.register(outletLoaderTestLoadingNamespace, {
          viewModel: outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy'),
          template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>'
        });

        fw.components.register(outletLoaderTestLoadedNamespace, {
          viewModel: outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy'),
          template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
        });

        fw.router.register(routerNamespace, function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            showDuringLoad: outletLoaderTestLoadingNamespace,
            minTransitionPeriod: 75,
            routes: [
              {
                route: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletLoaderTestLoadedNamespace, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough());
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);

          expect(changeOutletControllerSpy).toHaveBeenCalled();
          expect(outletCallbackSpy).not.toHaveBeenCalled();
          expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
            expect($(testContainer).find('.fw-loaded-display.' + footworkAnimationClass)).lengthToBe(0);
            expect(outletCallbackSpy).not.toHaveBeenCalled();

            setTimeout(function() {
              expect($(testContainer).find('.fw-loaded-display.' + footworkAnimationClass)).lengthToBeGreaterThan(0);
              expect(outletCallbackSpy).toHaveBeenCalled();
              done();
            }, 140);
          }, 0);
        }, 0);
      });

      it('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time from callback', function(done) {
        var mockUrl = tools.generateUrl();
        var outletLoaderTestLoadingNamespace = tools.randomString();
        var outletLoaderTestLoadedNamespace = tools.randomString();
        var routerNamespace = tools.randomString();
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var outletLoaderTestLoadingSpy;
        var outletLoaderTestLoadedSpy;
        var minTransitionPeriodSpy;

        function router(name) {
          return fw.router.get(name);
        }

        fw.components.register(outletLoaderTestLoadingNamespace, {
          viewModel: outletLoaderTestLoadingSpy = jasmine.createSpy('outletLoaderTestLoadingSpy'),
          template: '<div class="' + outletLoaderTestLoadingNamespace + '"></div>',
          synchronous: true
        });

        fw.components.register(outletLoaderTestLoadedNamespace, {
          viewModel: outletLoaderTestLoadedSpy = jasmine.createSpy('outletLoaderTestLoadedSpy'),
          template: '<div class="' + outletLoaderTestLoadedNamespace + '"></div>'
        });

        fw.router.register(routerNamespace, function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            showDuringLoad: outletLoaderTestLoadingNamespace,
            minTransitionPeriod: minTransitionPeriodSpy = jasmine.createSpy('minTransitionPeriodSpy', function(outletName, componentToDisplay) {
              expect(outletName).toBe('output');
              expect(componentToDisplay).toBe(outletLoaderTestLoadedNamespace);
              return 75;
            }).and.callThrough(),
            routes: [
              {
                route: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', outletLoaderTestLoadedNamespace, outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough());
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();
        expect(minTransitionPeriodSpy).toBe(undefined);

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        expect(outletLoaderTestLoadingSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);

          expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();
          expect(minTransitionPeriodSpy).toHaveBeenCalled();
          expect(changeOutletControllerSpy).toHaveBeenCalled();
          expect(outletCallbackSpy).not.toHaveBeenCalled();

          setTimeout(function() {
            expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
            expect(outletCallbackSpy).not.toHaveBeenCalled();

            setTimeout(function() {
              expect(outletCallbackSpy).toHaveBeenCalled();
              done();
            }, 140);
          }, 0);
        }, 0);
      });

      it('can have a $route bound link correctly composed with an href attribute using passed in string route', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var hashMockUrl = '#hash-only-url';
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        function router(name) {
          return fw.router.get(name);
        }

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a class="mockUrl" data-bind="$route: \'' + mockUrl + '\'"></a>\
          <a class="hashMockUrl" data-bind="$route: \'' + hashMockUrl + '\'"></a>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          var $link = $(testContainer).find('a.mockUrl');
          var $hashLink = $(testContainer).find('a.hashMockUrl');

          expect(routeSpy).not.toHaveBeenCalled();
          expect($link.attr('href')).toBe(mockUrl);
          expect($hashLink.attr('href')).toBe(hashMockUrl);

          $link.click();
          expect(routeSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can have a $route bound link correctly composed using the elements existing href attribute', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        function router(name) {
          return fw.router.get(name);
        }

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a href="' + mockUrl + '" data-bind="$route"></a>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          var $link = $(testContainer).find('a');

          expect(routeSpy).not.toHaveBeenCalled();
          expect($link.attr('href')).toBe(mockUrl);

          $link.click();
          expect(routeSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can have a $route bound link correctly composed with an href attribute using an observable', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var routerNamespaceName = tools.randomString();
        var viewModelNamespaceName = tools.randomString();
        var viewModelInitializeSpy;
        var routerInitializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');
        var changedRouteSpy = jasmine.createSpy('changedRouteSpy');

        fw.router.register(routerNamespaceName, routerInitializeSpy = jasmine.createSpy('routerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespaceName,
            routes: [
              {
                route: '/routeHrefBindingObservable',
                controller: routeSpy
              }, {
                route: '/routeHrefBindingObservableChangedRoute',
                controller: changedRouteSpy
              }
            ],
          });
        }).and.callThrough());

        fw.viewModel.register(viewModelNamespaceName, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: viewModelNamespaceName,
          });
          this.routeHrefBindingObservable = fw.observable('/routeHrefBindingObservable');
        }).and.callThrough());

        function viewModel(name) {
          return fw.viewModel.get(name);
        }

        expect(routerInitializeSpy).not.toHaveBeenCalled();
        expect(viewModelInitializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();
        expect(changedRouteSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <viewModel module="' + viewModelNamespaceName + '">\
            <a data-bind="$route: routeHrefBindingObservable"></a>\
          </viewModel>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(routerInitializeSpy).toHaveBeenCalled();
          expect(viewModelInitializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect(changedRouteSpy).not.toHaveBeenCalled();
            expect($link.attr('href')).toBe('/routeHrefBindingObservable');

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect(changedRouteSpy).not.toHaveBeenCalled();

            viewModel(viewModelNamespaceName).routeHrefBindingObservable('/routeHrefBindingObservableChangedRoute');
            expect($link.attr('href')).toBe('/routeHrefBindingObservableChangedRoute');

            $link.click();
            expect(changedRouteSpy).toHaveBeenCalled();

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that uses replaceState on its parent router', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        var $testContainer = $(testContainer);
        var routerInitialized = false;
        var routeTouched = false;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: { url: \'' + mockUrl + '\', replaceState: false }"></a>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that expresses the default active class when the route matches', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        var $testContainer = $(testContainer);
        var routerInitialized = false;
        var routeTouched = false;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: \'' + mockUrl + '\'"></a>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that expresses a custom \'active\' class when the route matches', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var activeClassName = tools.randomString();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\' }"></a>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass(activeClassName)).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass(activeClassName)).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that expresses a custom \'active\' class on the direct parent element', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var activeClassName = tools.randomString();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <div>\
            <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\', parentHasState: true }"></a>\
          </div>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          var $link = $(testContainer).find('a');

          expect(routeSpy).not.toHaveBeenCalled();
          expect($link.parent().hasClass(activeClassName)).toBe(false);

          $link.click();
          expect(routeSpy).toHaveBeenCalled();
          expect($link.parent().hasClass(activeClassName)).toBe(true);

          done();
        }, ajaxWait);
      });

      it('can have a $route bound link that expresses an \'active\' class on the selected parent element', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var activeClassName = tools.randomString();
        var parentClassName = tools.randomString();
        var initializeSpy = jasmine.createSpy('initializeSpy');
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
            <div class="parent-class-name">\
              <div>\
                <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\', parentHasState: \'.parent-class-name\' }"></a>\
                <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\', parentHasState: \'.parent-class-name-graceful-failure-does-not-exist\' }"></a>\
              </div>\
            </div>\
          </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $testContainer = $(testContainer);
            var $link = $testContainer.find('a');
            var $elementThatHasState = $testContainer.find('.parent-class-name');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($elementThatHasState.hasClass(activeClassName)).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($elementThatHasState.hasClass(activeClassName)).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that expresses a custom \'active\' class defined by an observable when the route matches', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var routerNamespaceName = tools.randomString();
        var viewModelNamespaceName = tools.randomString();
        var activeClassName = tools.randomString();
        var parentClassName = tools.randomString();
        var viewModelInitializeSpy;
        var routerInitializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.viewModel.register(viewModelNamespaceName, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: viewModelNamespaceName,
          });
          this.activeClassObservable = fw.observable(activeClassName);
        }).and.callThrough());

        fw.router.register(routerNamespaceName, routerInitializeSpy = jasmine.createSpy('routerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(viewModelInitializeSpy).not.toHaveBeenCalled();
        expect(routerInitializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <viewModel module="' + viewModelNamespaceName + '">\
            <a data-bind="$route: { url: \'' + mockUrl + '\', activeClass: activeClassObservable }"></a>\
          </viewModel>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(routerInitializeSpy).toHaveBeenCalled();
          expect(viewModelInitializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass(activeClassName)).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass(activeClassName)).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that disables the active class state based on a raw boolean flag', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: { url: \'' + mockUrl + '\', addActiveClass: false }"></a>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that disables the active class state using an observable', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
          this.disableActiveClass = fw.observable(false);
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: { url: \'' + mockUrl + '\', addActiveClass: disableActiveClass }"></a>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link with its active class removed properly when the route switches away from it', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var mockUrl2 = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');
        var theRouter;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              },
              {
                route: mockUrl2,
                controller: routeSpy
              }
            ]
          });
          theRouter = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a class="' + mockUrl.replace('/', '') + '" data-bind="$route: \'' + mockUrl + '\'"></a>\
          <a class="' + mockUrl2.replace('/', '') + '" data-bind="$route: \'' + mockUrl2 + '\'"></a>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $mockUrl = $(testContainer).find('a.' + mockUrl.replace('/', ''));
            var $mockUrl2 = $(testContainer).find('a.' + mockUrl2.replace('/', ''));

            expect(routeSpy).not.toHaveBeenCalled();
            expect($mockUrl.hasClass('active')).toBe(false);
            expect($mockUrl2.hasClass('active')).toBe(false);

            $mockUrl.click();
            expect(routeSpy).toHaveBeenCalled();
            expect($mockUrl.hasClass('active')).toBe(true);
            expect($mockUrl2.hasClass('active')).toBe(false);

            $mockUrl2.click();
            expect(routeSpy).toHaveBeenCalledTimes(2);
            expect($mockUrl.hasClass('active')).toBe(false);
            expect($mockUrl2.hasClass('active')).toBe(true);

            done();
          }, ajaxWait);
        }, 10);
      });

      it('can have a $route bound link that triggers based on a custom event defined by a string', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: { url: \'' + mockUrl + '\', on: \'dblclick\' }"></a>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            $link.dblclick();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link that triggers based on a custom event defined by a callback/observable', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var namespaceName = tools.generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
          this.customEvent = fw.observable('dblclick');
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = tools.getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="$route: { url: \'' + mockUrl + '\', on: customEvent }"></a>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);

            $link.dblclick();
            expect(routeSpy).toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link correctly composed with a custom callback handler', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var routerNamespaceName = tools.randomString();
        var viewModelNamespaceName = tools.randomString();
        var viewModelInitializeSpy;
        var routerInitializeSpy;
        var customHandlerSpy;
        var routeSpy = jasmine.createSpy('routeSpy');
        var allowHandlerEvent;

        fw.router.register(routerNamespaceName, routerInitializeSpy = jasmine.createSpy('routerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
          this.customEvent = fw.observable('dblclick');
        }).and.callThrough());

        fw.viewModel.register(viewModelNamespaceName, viewModelInitializeSpy = jasmine.createSpy('viewModelInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: viewModelNamespaceName,
          });
          this.routeHrefBindingCustomHandler = customHandlerSpy = jasmine.createSpy('customHandlerSpy', function(event, url) {
            expect(event).toBeAn('object');
            expect(url).toBeA('string');
            return allowHandlerEvent;
          }).and.callThrough();
        }).and.callThrough());

        expect(routerInitializeSpy).not.toHaveBeenCalled();
        expect(viewModelInitializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <viewModel module="' + viewModelNamespaceName + '">\
            <a data-bind="$route: { url: \'' + mockUrl + '\', handler: routeHrefBindingCustomHandler }"></a>\
          </viewModel>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(customHandlerSpy).not.toHaveBeenCalled();
          expect(routerInitializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect(routeSpy).not.toHaveBeenCalled();
            expect($link.hasClass('active')).toBe(false);
            expect($link.attr('href')).toBe(mockUrl);

            allowHandlerEvent = false;
            $link.click();
            expect(routeSpy).not.toHaveBeenCalled();
            expect(customHandlerSpy).toHaveBeenCalledTimes(1);
            expect($link.hasClass('active')).toBe(false);

            allowHandlerEvent = true;
            $link.click();
            expect(routeSpy).toHaveBeenCalled();
            expect(customHandlerSpy).toHaveBeenCalledTimes(2);
            expect($link.hasClass('active')).toBe(true);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a $route bound link correctly composed with a custom URL callback', function(done) {
        var testContainer;
        var mockUrl = tools.generateUrl();
        var routerNamespaceName = tools.randomString();
        var viewModelNamespaceName = tools.randomString();
        var viewModelInitializeSpy;
        var initializeSpy;
        var urlResolverSpy;
        var allowHandlerEvent;

        fw.router.register(routerNamespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespaceName
          });
          this.routeHrefBindingCustomUrlCallback = urlResolverSpy = jasmine.createSpy('urlResolverSpy', function() {
            return mockUrl;
          }).and.callThrough();
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();

        testContainer = tools.getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <a data-bind="$route: { url: routeHrefBindingCustomUrlCallback }"></a>\
        </router>');
        fw.start(testContainer);

        setTimeout(function() {
          expect(urlResolverSpy).toHaveBeenCalled();
          expect(initializeSpy).toHaveBeenCalled();

          setTimeout(function() {
            var $link = $(testContainer).find('a');

            expect($link.hasClass('active')).toBe(false);
            expect($link.attr('href')).toBe(mockUrl);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can trigger a route via the replaceState command', function() {
        var namespaceName = tools.generateNamespaceName();
        var mockUrl = tools.generateUrl();
        var routeSpy = jasmine.createSpy('routeSpy');
        var MyRouter = function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        };

        var router = new MyRouter();
        expect(routeSpy).not.toHaveBeenCalled();

        router.$activated(true);
        expect(routeSpy).not.toHaveBeenCalled();

        fw.namespace(namespaceName).command('replaceState', mockUrl);
        expect(routeSpy).toHaveBeenCalled();
      });

      it('can trigger a route via the replaceState command', function() {
        var namespaceName = tools.generateNamespaceName();
        var mockUrl = tools.generateUrl();
        var routeSpy = jasmine.createSpy('routeSpy');
        var MyRouter = function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                route: mockUrl,
                controller: routeSpy
              }
            ]
          });
        };

        var router = new MyRouter();
        expect(routeSpy).not.toHaveBeenCalled();

        router.$activated(true);
        expect(routeSpy).not.toHaveBeenCalled();

        fw.namespace(namespaceName).command('replaceState', mockUrl);
        expect(routeSpy).toHaveBeenCalled();
      });
    });
  }
);
