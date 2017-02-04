define(['footwork', 'lodash', 'fetch-mock'],
  function(fw, _) {
    describe('router', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      beforeAll(function() {
        fw.router.disableHistory = true;
      });

      it('has the ability to create a router', function() {
        var BadRouter = function Router() {
          fw.router.boot();
        };
        expect(function() { new BadRouter() }).toThrow();

        var AlsoBadRouter = function Router() {
          fw.router.boot(this);
          fw.router.boot(this);
        };
        expect(function() { new AlsoBadRouter() }).toThrow();

        var Router = function Router() {
          var self = fw.router.boot(this);
          expect(self).toBe(this);
        };

        var vm = new Router();

        expect(vm).toBeA('router');
        expect(vm).toBeInstanceOf(Router);
      });

      it('has the ability to create a router with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = generateNamespaceName();
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
        var afterRenderSpy;

        var ModelA = jasmine.createSpy('ModelASpy', function() {
          fw.router.boot(this, {
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(containingElement) {
              expect(containingElement.className.indexOf(checkForClass)).not.toBe(-1);
            }).and.callThrough()
          });

          expect(afterRenderSpy).not.toHaveBeenCalled();
        }).and.callThrough();

        expect(ModelA).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(new ModelA(), testContainer = getFixtureContainer('', '<div class="' + checkForClass + '"></div>'));

        expect(ModelA).toHaveBeenCalled();
        expect(afterRenderSpy).toHaveBeenCalled();
      });

      it('can register and get a registered router', function() {
        var namespaceName = generateNamespaceName();
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
        var specificRouterNamespace = generateNamespaceName();
        var Router = function() {
          fw.router.boot(this, { namespace: specificRouterNamespace });
        };
        var numToMake = 8;

        for(var x = numToMake; x; x--) {
          routers.push(new Router());
        }

        var singleRouterNamespace = generateNamespaceName();
        new (function() {
          fw.router.boot(this, { namespace: singleRouterNamespace });
        })();
        expect(fw.router.get(singleRouterNamespace)).toBeAn('object');

        expect(fw.router.get(generateNamespaceName())).toBe(undefined);
        expect(fw.router.get(specificRouterNamespace)).lengthToBe(numToMake);
      });

      it('can bind to the DOM using a router declaration', function(done) {
        var wasInitialized = false;
        var namespaceName = generateNamespaceName();
        var RouterSpy = jasmine.createSpy('RouterSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName
          });
        }).and.callThrough();

        fw.router.register(namespaceName, RouterSpy);

        expect(RouterSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(RouterSpy).toHaveBeenCalledTimes(1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a shared instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = _.uniqueId('random');

        fw.viewModel.register(namespaceName, {
          instance: {
            boundProperty: boundPropertyValue
          }
        });

        testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '">\
                                             <span class="result" data-bind="text: boundProperty"></span>\
                                           </viewModel>');

        fw.start(testContainer);

        setTimeout(function() {
          expect(testContainer.innerHTML.indexOf(boundPropertyValue)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a generated instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = _.uniqueId('random');
        var boundPropertyValueElement = boundPropertyValue + '-element';
        var createViewModelInstance;

        fw.viewModel.register(namespaceName, {
          createViewModel: createViewModelInstance = jasmine.createSpy('createViewModel', function(params, info) {
            expect(params.thing).toBe(boundPropertyValue);
            expect(info.element.id).toBe(boundPropertyValueElement);

            return {
              boundProperty: boundPropertyValue
            };
          }).and.callThrough()
        });

        expect(createViewModelInstance).not.toHaveBeenCalled();
        testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '" id="' + boundPropertyValueElement + '" params="thing: \'' + boundPropertyValue + '\'">\
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
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;

        fw.viewModel.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.className.indexOf(fw.animationClass.animateIn)).toBe(-1);
            }).and.callThrough()
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);
        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(afterRenderSpy).toHaveBeenCalled();
          expect(theElement.className.indexOf(fw.animationClass.animateIn)).not.toBe(-1);
          done();
        }, ajaxWait);
      });

      it('can nest router declarations', function(done) {
        var namespaceNameOuter = _.uniqueId('random');
        var namespaceNameInner = _.uniqueId('random');
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.router.boot(this); });

        fw.router.register(namespaceNameOuter, initializeSpy);
        fw.router.register(namespaceNameInner, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceNameOuter + '">\
          <router module="' + namespaceNameInner + '"></router>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalledTimes(2);
          done();
        }, ajaxWait);
      });

      it('can pass parameters through a router declaration', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          fw.router.boot(this);
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('calls onDispose when the containing element is removed from the DOM', function(done) {
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;
        var onDisposeSpy;

        var WrapperRouter = initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this);
          this.showIt = fw.observable(true);
        }).and.callThrough();

        fw.router.register(namespaceName, function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.tagName).toBe('ROUTER');
            }).and.callThrough(),
            onDispose: onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
              expect(element).toBe(theElement);
            }).and.callThrough()
          });
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        var wrapper = new WrapperRouter();

        expect(initializeSpy).toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(wrapper, testContainer = getFixtureContainer('<div data-bind="if: showIt">\
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
        var namespaceName = generateNamespaceName();
        fw.router.registerLocation(namespaceName, '/bogus/path');
        expect(fw.router.getLocation(namespaceName)).toBe('/bogus/path');
        fw.router.registerLocation(/regexp.*/, '/bogus/path');
        expect(fw.router.getLocation('regexp-model')).toBe('/bogus/path');
      });

      it('can have an array of models registered to a location and retrieved proplerly', function() {
        var namespaceNames = [ generateNamespaceName(), generateNamespaceName() ];
        fw.router.registerLocation(namespaceNames, '/bogus/path');
        expect(fw.router.getLocation(namespaceNames[0])).toBe('/bogus/path');
        expect(fw.router.getLocation(namespaceNames[1])).toBe('/bogus/path');
      });

      it('can have a registered location with filename set and retrieved proplerly', function() {
        var namespaceName = generateNamespaceName();
        fw.router.registerLocation(namespaceName, '/bogus/path/__file__.js');
        expect(fw.router.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
      });

      it('can have a specific file extension set and used correctly', function() {
        var namespaceName = generateNamespaceName();
        var customExtension = '.jscript';
        fw.router.fileExtensions = customExtension;
        fw.router.registerLocation(namespaceName, '/bogus/path/');

        expect(fw.router.getFileName(namespaceName)).toBe(namespaceName + customExtension);

        fw.router.fileExtensions = '.js';
      });

      it('can load via registered router with a declarative initialization', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.router.boot(this, { namespace: namespaceName }); });

        fw.router.register(namespaceName, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location', function(done) {
        var namespaceName = 'AMDRouter';

        fw.router.registerLocation(namespaceName, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
        var namespaceName = 'AMDRouterRegexp-test';

        fw.router.registerLocation(/AMDRouterRegexp-.*/, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
        var namespaceName = 'AMDRouterFullName';

        fw.router.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can be nested and initialized declaratively', function(done) {
        var outerInitializeSpy;
        var innerInitializeSpy;
        var outerNamespaceName = _.uniqueId('random');
        var innerNamespaceName = _.uniqueId('random');

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

        fw.start(testContainer = getFixtureContainer('<router module="' + outerNamespaceName + '">\
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

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: 'unknownRouteCheck',
            routes: [
              { unknown: true, controller: unknownRouteControllerSpy }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(unknownRouteControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(generateUrl());
          expect(unknownRouteControllerSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger a specified route and have the title set correctly', function(done) {
        var mockUrl = generateUrl();
        var mockUrl2 = generateUrl();
        var namespaceName = generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var initializeSpy;
        var router;
        var testTitle = _.uniqueId('random');
        var testTitle2 = _.uniqueId('random');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                title: testTitle,
                controller: routeControllerSpy
              },
              {
                path: mockUrl2,
                title: function() {
                  return testTitle2;
                },
                controller: routeControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          router.pushState(mockUrl);
          expect(routeControllerSpy).toHaveBeenCalled();
          expect(router.currentRoute().route.path).toBe(mockUrl);
          expect(document.title).toBe(testTitle);

          router.pushState(mockUrl2);
          expect(routeControllerSpy).toHaveBeenCalledTimes(2);
          expect(router.currentRoute().route.path).toBe(mockUrl2);
          expect(document.title).toBe(testTitle2);

          done();
        }, ajaxWait);
      });

      it('can trigger a specified route while removing the configured baseRoute', function(done) {
        var baseRoute = generateUrl();
        var mockUrl = generateUrl();
        var mockUrl2 = generateUrl();
        var namespaceName = generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            baseRoute: baseRoute,
            routes: [
              {
                path: mockUrl,
                controller: routeControllerSpy
              },
              {
                path: mockUrl2,
                controller: routeControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          router.pushState(baseRoute + mockUrl);
          expect(routeControllerSpy).toHaveBeenCalled();
          expect(router.currentRoute().route.path).toBe(mockUrl);

          router.pushState(baseRoute + mockUrl2);
          expect(routeControllerSpy).toHaveBeenCalledTimes(2);
          expect(router.currentRoute().route.path).toBe(mockUrl2);

          done();
        }, ajaxWait);
      });

      it('can trigger a specified name-based route', function(done) {
        var mockNamedState = _.uniqueId('random');
        var mockUrl = generateUrl() + '/:required';
        var invalidNamedState = _.uniqueId('random');
        var namespaceName = generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var unknownRouteControllerSpy = jasmine.createSpy('unknownRouteControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                name: mockNamedState,
                controller: routeControllerSpy
              },
              {
                unknown: true,
                controller: unknownRouteControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          router.pushState({ name: mockNamedState, params: { required: true } });
          expect(routeControllerSpy).toHaveBeenCalled();

          router.pushState({ name: invalidNamedState, params: { required: true } });
          expect(unknownRouteControllerSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can trigger a specified route that is defined within an array of route strings', function(done) {
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: [ mockUrl, mockUrl + '2' ],
                controller: routeControllerSpy
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(routeControllerSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(mockUrl + '2');
          expect(routeControllerSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger a specified route with a required parameter', function(done) {
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var routeControllerSpy;
        var initializeSpy;
        var testParam = _.uniqueId('random');
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl + '/:testParam',
                controller: routeControllerSpy = jasmine.createSpy('routeControllerSpy', function(passedTestParam) {
                  expect(passedTestParam).toEqual({ testParam: testParam });
                }).and.callThrough()
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(routeControllerSpy).toBe(undefined);
        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          router.replaceState(mockUrl + '/' + testParam);
          expect(routeControllerSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can trigger a route at activation', function() {
        var mockUrl = generateUrl();
        var routeControllerSpy = jasmine.createSpy('routeControllerSpy');

        function Router () {
          fw.router.boot(this, {
            routes: [
              {
                path: mockUrl,
                controller: routeControllerSpy
              }
            ]
          });
        }

        var router = new Router();
        expect(routeControllerSpy).not.toHaveBeenCalled();

        router.activated(true);
        router.currentState(mockUrl);

        expect(routeControllerSpy).toHaveBeenCalled();
      });

      it('can trigger a specified route with an optional parameter with and without the parameter', function(done) {
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var routeControllerSpy;
        var initializeSpy;
        var optParamNotSuppliedSpy;
        var optParamSuppliedSpy;
        var testParam = _.uniqueId('random');
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl + '/optParamNotSupplied(/:testParam)',
                controller: optParamNotSuppliedSpy = jasmine.createSpy('optParamNotSuppliedSpy', function(testParam) {
                  expect(testParam).toEqual({ testParam: undefined });
                }).and.callThrough()
              }, {
                path: mockUrl + '/optParamSupplied(/:testParam)',
                controller: optParamSuppliedSpy = jasmine.createSpy('optParamSuppliedSpy', function(passedTestParam) {
                  expect(passedTestParam).toEqual({ testParam: testParam });
                }).and.callThrough()
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(optParamNotSuppliedSpy).toBe(undefined);
        expect(optParamSuppliedSpy).toBe(undefined);

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '"></router>'));

        setTimeout(function() {
          router.replaceState(mockUrl + '/optParamNotSupplied');
          expect(optParamNotSuppliedSpy).toHaveBeenCalled();

          router.replaceState(mockUrl + '/optParamSupplied/' + testParam + '?query=should-be-removed&should=not-break-routing');
          expect(optParamSuppliedSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can manipulate an outlet', function(done) {
        var manipulateOutletUrl = generateUrl();
        var manipulateOutletComponentNamespace = _.uniqueId('random');
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var afterRenderSpy;
        var manipulateOutletControllerSpy;
        var clearOutletControllerSpy;
        var emptyOutletControllerSpy;
        var manipulateOutletComponentSpy;
        var outletOnCompleteSpy = jasmine.createSpy('outletOnCompleteSpy');
        var router;
        var testContainer;
        var $testContainer;
        var passedInParams = { params: true };

        fw.components.registerLocation(manipulateOutletComponentNamespace, { template: 'tests/assets/fixtures/manipulateOutlet.html' });

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy'),
            outlet: {
              onComplete: outletOnCompleteSpy
            },
            routes: [
              {
                path: manipulateOutletUrl,
                controller: manipulateOutletControllerSpy = jasmine.createSpy('manipulateOutletControllerSpy', function(params) {
                  this.outlet('output', { display: manipulateOutletComponentNamespace, params: passedInParams, onComplete: outletOnCompleteSpy });
                }).and.callThrough()
              }, {
                path: '/clearOutlet',
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

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
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
            expect(outletOnCompleteSpy).toHaveBeenCalledTimes(2);
            expect($testContainer.find('outlet[name="output"]').attr('data-rendered')).toBe(manipulateOutletComponentNamespace);
            expect($testContainer.find('outlet[name="output"] .manipulateOutlet')).lengthToBe(1);

            router.replaceState('/clearOutlet');
            expect(clearOutletControllerSpy).toHaveBeenCalled();

            setTimeout(function() {
              expect($testContainer.find('outlet[name="output"]').attr('data-rendered')).not.toBe(manipulateOutletComponentNamespace);
              expect($testContainer.find('outlet[name="output"] .component-loaded').length).toBe(0);
              done();
            }, ajaxWait);
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can see all/multiple referenced outlets defined in its context', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var router;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName
          });
          router = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
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
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var router;
        var outletName = _.uniqueId('random');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName
          });
          this.show = fw.observable(true);
          router = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
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
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var outletCallbackName = _.uniqueId('random');
        var initializeSpy;
        var outletCallbackComponentSpy;
        var triggerOutletCallbackControllerSpy;
        var router;

        fw.components.register(outletCallbackName, {
          viewModel: outletCallbackComponentSpy = jasmine.createSpy('outletCallbackComponentSpy'),
          template: '<div class="' + outletCallbackName + '"></div>'
        });

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: function() {
                  this.outlet('output', { display: outletCallbackName, onComplete: triggerOutletCallbackControllerSpy = jasmine.createSpy('triggerOutletCallbackControllerSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletCallbackName).length).toBe(1);
                  }) });
                }
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(outletCallbackComponentSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
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
        var outletControlingViewModelNamespace = _.uniqueId('random');
        var outletComponentNamespace = _.uniqueId('random');
        var routerNamespace = _.uniqueId('random');
        var initializeSpy;
        var changeOutletControllerSpy;
        var outletCallbackSpy;
        var initializeViewModelSpy;
        var initializeComponentViewModelSpy;
        var router;
        var viewModel;

        fw.components.register(outletComponentNamespace, { template: '<div class="' + outletComponentNamespace + '"></div>' });

        fw.viewModel.register(outletControlingViewModelNamespace, initializeViewModelSpy = jasmine.createSpy('initializeViewModelSpy', function() {
          fw.viewModel.boot(this, {
            namespace: outletControlingViewModelNamespace
          });
          viewModel = this;
          this.outletVisible = fw.observable(false);
        }).and.callThrough());

        fw.router.register(routerNamespace, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespace,
            routes: [
              {
                path: '/outletAfterRouter',
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', { display: outletComponentNamespace, onComplete: outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletComponentNamespace).length).toBe(1);
                  }).and.callThrough() });
                }).and.callThrough()
              }
            ]
          });
          router = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(initializeViewModelSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + routerNamespace + '">\
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
            expect($(testContainer).find('.' + outletComponentNamespace)).lengthToBe(1);
            done();
          }, ajaxWait);
        }, ajaxWait);
      });

      it('can display a temporary loading component in place of a component that is being downloaded', function(done) {
        var mockUrl = generateUrl();
        var outletLoaderTestLoadingNamespace = _.uniqueId('random');
        var outletLoaderTestLoadedNamespace = _.uniqueId('random');
        var routerNamespace = _.uniqueId('random');
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
            routes: [
              {
                path: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', { display: outletLoaderTestLoadedNamespace, loading: outletLoaderTestLoadingNamespace, onComplete: outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough() });
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + routerNamespace + '">\
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

      it('can display a temporary loading component in place of a component that is being downloaded by specifying via router outlet options object', function(done) {
        var mockUrl = generateUrl();
        var outletLoaderTestLoadingNamespace = _.uniqueId('random');
        var outletLoaderTestLoadedNamespace = _.uniqueId('random');
        var routerNamespace = _.uniqueId('random');
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
            outlet: {
              loading: outletLoaderTestLoadingNamespace
            },
            routes: [
              {
                path: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', { display: outletLoaderTestLoadedNamespace, onComplete: outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough() });
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + routerNamespace + '">\
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

      it('can display a temporary loading component in place of a component that is being downloaded with a custom minimum transition time', function(done) {
        var mockUrl = generateUrl();
        var outletLoaderTestLoadingNamespace = _.uniqueId('random');
        var outletLoaderTestLoadedNamespace = _.uniqueId('random');
        var routerNamespace = _.uniqueId('random');
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
            routes: [
              {
                path: mockUrl,
                controller: changeOutletControllerSpy = jasmine.createSpy('changeOutletControllerSpy', function() {
                  this.outlet('output', { display: outletLoaderTestLoadedNamespace, transition: 75, loading: outletLoaderTestLoadingNamespace, onComplete: outletCallbackSpy = jasmine.createSpy('outletCallbackSpy', function(element) {
                    expect(element.tagName.toLowerCase()).toBe('outlet');
                    expect($(element).find('.' + outletLoaderTestLoadedNamespace).length).toBe(1);
                  }).and.callThrough() });
                }).and.callThrough()
              }
            ]
          });
        });

        expect(changeOutletControllerSpy).toBe(undefined);
        expect(outletLoaderTestLoadedSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + routerNamespace + '">\
          <outlet name="output"></outlet>\
        </router>'));

        setTimeout(function() {
          router(routerNamespace).replaceState(mockUrl);

          expect(changeOutletControllerSpy).toHaveBeenCalled();
          expect(outletCallbackSpy).not.toHaveBeenCalled();
          expect(outletLoaderTestLoadingSpy).toHaveBeenCalled();

          setTimeout(function() {
            expect(outletLoaderTestLoadedSpy).toHaveBeenCalled();
            expect($(testContainer).find('.fw-loaded-display.' + fw.animationClass.animateIn)).lengthToBe(0);
            expect(outletCallbackSpy).not.toHaveBeenCalled();

            setTimeout(function() {
              expect($(testContainer).find('.fw-loaded-display.' + fw.animationClass.animateIn)).lengthToBeGreaterThan(0);
              expect(outletCallbackSpy).toHaveBeenCalled();
              done();
            }, 500);
          }, 0);
        }, 0);
      });

      it('can have a route bound link correctly composed with an href attribute using passed in string route', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var hashMockUrl = '#hash-only-url';
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
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

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a class="mockUrl" data-bind="route: \'' + mockUrl + '\'"></a>\
          <a class="hashMockUrl" data-bind="route: \'' + hashMockUrl + '\'"></a>\
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

      it('can have a route bound link correctly composed using the elements existing href attribute', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
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

        testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a href="' + mockUrl + '" data-bind="route"></a>\
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

      it('can have a route bound link correctly composed with an href attribute using an observable', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var routerNamespaceName = _.uniqueId('random');
        var viewModelNamespaceName = _.uniqueId('random');
        var viewModelInitializeSpy;
        var routerInitializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');
        var changedRouteSpy = jasmine.createSpy('changedRouteSpy');

        fw.router.register(routerNamespaceName, routerInitializeSpy = jasmine.createSpy('routerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespaceName,
            routes: [
              {
                path: '/routeHrefBindingObservable',
                controller: routeSpy
              }, {
                path: '/routeHrefBindingObservableChangedRoute',
                controller: changedRouteSpy
              }
            ]
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

        testContainer = getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <viewModel module="' + viewModelNamespaceName + '">\
            <a data-bind="route: routeHrefBindingObservable"></a>\
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

      it('can have a route bound link that uses replaceState on its parent router', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
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
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: { url: \'' + mockUrl + '\', history: \'replace\' }"></a>\
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

      it('can have a route bound link that expresses the default active class when the route matches', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
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
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: \'' + mockUrl + '\'"></a>\
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

      it('can have a route bound link that expresses a custom \'active\' class when the route matches', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var activeClassName = _.uniqueId('random');
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: { url: \'' + mockUrl + '\', activeClass: \'' + activeClassName + '\' }"></a>\
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

      it('can have a route bound link that expresses a custom \'active\' class defined by an observable when the route matches', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var routerNamespaceName = _.uniqueId('random');
        var viewModelNamespaceName = _.uniqueId('random');
        var activeClassName = _.uniqueId('random');
        var parentClassName = _.uniqueId('random');
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
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(viewModelInitializeSpy).not.toHaveBeenCalled();
        expect(routerInitializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        testContainer = getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <viewModel module="' + viewModelNamespaceName + '">\
            <a data-bind="route: { url: \'' + mockUrl + '\', activeClass: activeClassObservable }"></a>\
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

      it('can have a route bound link that disables the active class state based on activeClass being falsey', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: { url: \'' + mockUrl + '\', activeClass: false }"></a>\
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

      it('can have a route bound link that disables the active class state using an observable', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
          this.disableActiveClass = fw.observable(false);
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: { url: \'' + mockUrl + '\', activeClass: disableActiveClass }"></a>\
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

      it('can have a route bound link with its active class removed properly when the route switches away from it', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var mockUrl2 = generateUrl();
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');
        var theRouter;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              },
              {
                path: mockUrl2,
                controller: routeSpy
              }
            ]
          });
          theRouter = this;
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a class="' + mockUrl.replace('/', '') + '" data-bind="route: \'' + mockUrl + '\'"></a>\
          <a class="' + mockUrl2.replace('/', '') + '" data-bind="route: \'' + mockUrl2 + '\'"></a>\
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

      it('can have a route bound link that triggers based on a custom event defined by a string', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: { url: \'' + mockUrl + '\', on: \'dblclick\' }"></a>\
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

      it('can have a route bound link that triggers based on a custom event defined by a callback/observable', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var initializeSpy;
        var routeSpy = jasmine.createSpy('routeSpy');

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              }
            ]
          });
          this.customEvent = fw.observable('dblclick');
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(routeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a data-bind="route: { url: \'' + mockUrl + '\', on: customEvent }"></a>\
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

      it('can have a route bound link correctly composed with a custom callback handler', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var routerNamespaceName = _.uniqueId('random');
        var viewModelNamespaceName = _.uniqueId('random');
        var viewModelInitializeSpy;
        var routerInitializeSpy;
        var customHandlerSpy;
        var routeSpy = jasmine.createSpy('routeSpy');
        var allowHandlerEvent;
        var alternateRoute = generateUrl();
        var alternateRouteSpy = jasmine.createSpy('alternateRouteSpy');

        fw.router.register(routerNamespaceName, routerInitializeSpy = jasmine.createSpy('routerInitializeSpy', function() {
          fw.router.boot(this, {
            namespace: routerNamespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              },
              {
                path: alternateRoute,
                controller: alternateRouteSpy
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

        testContainer = getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <viewModel module="' + viewModelNamespaceName + '">\
            <a data-bind="route: { url: \'' + mockUrl + '\', handler: routeHrefBindingCustomHandler }"></a>\
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

            allowHandlerEvent = alternateRoute;
            $link.click();
            expect(alternateRouteSpy).toHaveBeenCalled();
            expect(customHandlerSpy).toHaveBeenCalledTimes(3);

            done();
          }, ajaxWait);
        }, 0);
      });

      it('can have a route bound link correctly composed with a custom URL callback', function(done) {
        var testContainer;
        var mockUrl = generateUrl();
        var routerNamespaceName = _.uniqueId('random');
        var viewModelNamespaceName = _.uniqueId('random');
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

        testContainer = getFixtureContainer('<router module="' + routerNamespaceName + '">\
          <a data-bind="route: { url: routeHrefBindingCustomUrlCallback }"></a>\
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

      it('can trigger a scroll based on a url fragment after outlet loading', function(done) {
        var testContainer;
        var fragmentIdentifier = 'test-fragment';
        var mockUrl = generateUrl();
        var namespaceName = generateNamespaceName();
        var outletDisplayName = generateNamespaceName();
        var initializeSpy;
        var routeSpy;

        fw.router.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy = jasmine.createSpy('routeSpy', function() {
                  this.outlet('display', outletDisplayName);
                }).and.callThrough()
              }
            ]
          });
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.components.register(outletDisplayName, { template: '<div id="' + fragmentIdentifier + '">fragmentIdentifier</div>' });

        fw.start(testContainer = getFixtureContainer('<router module="' + namespaceName + '">\
          <a class="mockUrl" data-bind="route: \'' + mockUrl + '#' + fragmentIdentifier + '\'"></a>\
          <outlet name="display"></outlet>\
        </router>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();

          var $link = $(testContainer).find('a.mockUrl');

          expect(routeSpy).not.toHaveBeenCalled();
          expect($link.attr('href')).toBe(mockUrl + '#' + fragmentIdentifier);

          $link.click();
          expect(routeSpy).toHaveBeenCalled();

          done();
        }, ajaxWait);
      });

      it('can be activated and deactivated', function() {
        var namespaceName = generateNamespaceName();
        var mockUrl = generateUrl();
        var mockUrl2 = generateUrl();
        var routeSpy = jasmine.createSpy('routeSpy');
        var MyRouter = function() {
          fw.router.boot(this, {
            namespace: namespaceName,
            routes: [
              {
                path: mockUrl,
                controller: routeSpy
              },
              {
                path: mockUrl2,
                controller: routeSpy
              }
            ]
          });
        };

        var router = new MyRouter();
        expect(routeSpy).not.toHaveBeenCalled();

        router.activated(true);
        expect(routeSpy).not.toHaveBeenCalled();

        var routerNS = fw.namespace(namespaceName);

        router.replaceState(mockUrl);
        expect(routeSpy).toHaveBeenCalled();
        router.activated(false);

        router.replaceState(mockUrl2);
        expect(routeSpy).toHaveBeenCalledTimes(1);
        router.activated(true);

        router.replaceState(mockUrl2);
        expect(routeSpy).toHaveBeenCalledTimes(2);
        router.activated(false);

        router.replaceState(mockUrl);
        expect(routeSpy).toHaveBeenCalledTimes(2);
        router.activated(true);

        router.replaceState(mockUrl);
        expect(routeSpy).toHaveBeenCalledTimes(3);
      });
    });
  }
);
