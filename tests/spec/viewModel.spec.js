define(['footwork', 'lodash', 'fetch-mock'],
  function(fw, _) {
    describe('viewModel', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('has the ability to create a viewModel', function() {
        var BadViewModel = function ViewModel() {
          var self = fw.viewModel.boot();
        };
        expect(function() { new BadViewModel() }).toThrow();

        var ViewModel = function ViewModel() {
          var self = fw.viewModel.boot(this);
          expect(self).toBe(this);
        };

        var vm = new ViewModel();

        expect(vm).toBeA('viewModel');
        expect(vm).toBeInstanceOf(ViewModel);
      });

      it('has the ability to create a viewModel with a correctly defined namespace whos name we can retrieve', function() {
        var namespaceName = generateNamespaceName();
        var Model = function () {
          var self = fw.viewModel.boot(this, {
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
          fw.viewModel.boot(this, {
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

      it('can register and get a registered viewModel', function() {
        var namespaceName = generateNamespaceName();
        expect(fw.viewModel.isRegistered(namespaceName)).toBe(false);

        var Model = jasmine.createSpy('Model');
        fw.viewModel.register(namespaceName, Model);

        expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
        expect(fw.viewModel.getRegistered(namespaceName)).toBe(Model);
        expect(Model).not.toHaveBeenCalled();
      });

      it('can get all instantiated viewModels', function() {
        var ViewModel = function() {
          fw.viewModel.boot(this);
        };
        var viewModels = [ new ViewModel(), new ViewModel() ];

        expect(_.keys(fw.viewModel.get())).lengthToBeGreaterThan(0);
      });

      it('can get instantiated viewModels', function() {
        var viewModels = [];
        var specificViewModelNamespace = generateNamespaceName();
        var ViewModel = function() {
          fw.viewModel.boot(this, { namespace: specificViewModelNamespace });
        };
        var numToMake = 8;

        for(var x = numToMake; x; x--) {
          viewModels.push(new ViewModel());
        }

        var singleViewModelNamespace = generateNamespaceName();
        new (function() {
          fw.viewModel.boot(this, { namespace: singleViewModelNamespace });
        })();
        expect(fw.viewModel.get(singleViewModelNamespace)).toBeAn('object');

        expect(fw.viewModel.get(generateNamespaceName())).toBe(undefined);
        expect(fw.viewModel.get(specificViewModelNamespace)).lengthToBe(numToMake);
        expect(fw.viewModel.get([specificViewModelNamespace])[specificViewModelNamespace]).lengthToBe(numToMake);
      });

      it('can bind to the DOM using a viewModel declaration', function(done) {
        var wasInitialized = false;
        var namespaceName = generateNamespaceName();
        var ViewModelSpy = jasmine.createSpy('ViewModelSpy', function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName
          });
        }).and.callThrough();

        fw.viewModel.register(namespaceName, ViewModelSpy);

        expect(ViewModelSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(ViewModelSpy).toHaveBeenCalledTimes(1);
          done();
        }, ajaxWait);
      });

      it('can bind to the DOM using a shared instance', function(done) {
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = randomString();

        fw.viewModel.register(namespaceName, {
          instance: {
            boundProperty: boundPropertyValue
          }
        });

        testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '">\
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
        var namespaceName = generateNamespaceName();
        var boundPropertyValue = randomString();
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

      it('can disable animation class addition', function(done) {
        var namespaceName = generateNamespaceName();
        var theElement;
        var initializeSpy;
        var afterRenderSpy;

        var oldAnimateIn = fw.animationClass.animateIn;
        fw.animationClass.animateIn = null;

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
          expect(theElement.className.indexOf(fw.animationClass.animateIn)).toBe(-1);

          fw.animationClass.animateIn = oldAnimateIn;
          done();
        }, ajaxWait);
      });

      it('can nest viewModel declarations', function(done) {
        var namespaceNameOuter = randomString();
        var namespaceNameInner = randomString();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.viewModel.boot(this); });

        fw.viewModel.register(namespaceNameOuter, initializeSpy);
        fw.viewModel.register(namespaceNameInner, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceNameOuter + '">\
          <viewModel module="' + namespaceNameInner + '"></viewModel>\
        </viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalledTimes(2);
          done();
        }, ajaxWait);
      });

      it('can pass parameters through a viewModel declaration', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy;

        fw.viewModel.register(namespaceName, initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          fw.viewModel.boot(this);
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough());

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can dispose of items properly', function() {
        var namespaceName = generateNamespaceName();
        var checkValue = randomString();
        var initializeSpy;
        var callbackSpy = jasmine.createSpy('callbackSpy');
        var callbackArraySpy = jasmine.createSpy('callbackArraySpy');
        var ns = fw.namespace(namespaceName);

        function MyViewModel(params) {
          fw.viewModel.boot(this);
          var ns = fw.namespace(namespaceName);
          this.disposeWithInstance(ns.subscribe('testCall', callbackSpy));
          this.disposeWithInstance([ns.subscribe('testCall', callbackArraySpy)]);
        };

        var myVM = new MyViewModel();
        expect(callbackSpy).not.toHaveBeenCalled();

        ns.publish('testCall');
        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackArraySpy).toHaveBeenCalled();

        myVM.dispose();

        ns.publish('testCall');
        expect(callbackSpy).toHaveBeenCalledTimes(1);
        expect(callbackArraySpy).toHaveBeenCalledTimes(1);
      });

      it('calls onDispose when the containing element is removed from the DOM', function(done) {
        var namespaceName = generateNamespaceName();
        var theElement;
        var afterRenderSpy;
        var onDisposeSpy;

        var WrapperViewModel = jasmine.createSpy('WrapperViewModelSpy', function() {
          fw.viewModel.boot(this);
          this.showIt = fw.observable(true);
        }).and.callThrough();

        fw.viewModel.register(namespaceName, function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName,
            afterRender: afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
              theElement = element;
              expect(theElement.tagName).toBe('VIEWMODEL');
            }).and.callThrough(),
            onDispose: onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
              expect(element).toBe(theElement);
            }).and.callThrough()
          });
        });

        expect(WrapperViewModel).not.toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        var wrapper = new WrapperViewModel();

        expect(WrapperViewModel).toHaveBeenCalled();
        expect(afterRenderSpy).toBe(undefined);

        fw.applyBindings(wrapper, testContainer = getFixtureContainer('<div data-bind="if: showIt">\
          <viewModel module="' + namespaceName + '"></viewModel>\
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
        fw.viewModel.registerLocation(namespaceName, '/bogus/path');
        expect(fw.viewModel.getLocation(namespaceName)).toBe('/bogus/path');
        fw.viewModel.registerLocation(/regexp.*/, '/bogus/path');
        expect(fw.viewModel.getLocation('regexp-model')).toBe('/bogus/path');
      });

      it('can have an array of models registered to a location and retrieved proplerly', function() {
        var namespaceNames = [ generateNamespaceName(), generateNamespaceName() ];
        fw.viewModel.registerLocation(namespaceNames, '/bogus/path');
        expect(fw.viewModel.getLocation(namespaceNames[0])).toBe('/bogus/path');
        expect(fw.viewModel.getLocation(namespaceNames[1])).toBe('/bogus/path');
      });

      it('can have a registered location with filename set and retrieved proplerly', function() {
        var namespaceName = generateNamespaceName();
        fw.viewModel.registerLocation(namespaceName, '/bogus/path/__file__.js');
        expect(fw.viewModel.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
      });

      it('can have a specific file extension set and used correctly', function() {
        var namespaceName = generateNamespaceName();
        var customExtension = '.jscript';
        fw.viewModel.fileExtensions = customExtension;
        fw.viewModel.registerLocation(namespaceName, '/bogus/path/');

        expect(fw.viewModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

        fw.viewModel.fileExtensions = '.js';
      });

      it('can load via registered viewModel with a declarative initialization', function(done) {
        var namespaceName = generateNamespaceName();
        var initializeSpy = jasmine.createSpy('initializeSpy', function() { fw.viewModel.boot(this, { namespace: namespaceName }); });

        fw.viewModel.register(namespaceName, initializeSpy);

        expect(initializeSpy).not.toHaveBeenCalled();
        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location', function(done) {
        var namespaceName = 'AMDViewModel';

        fw.viewModel.registerLocation(namespaceName, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
        var namespaceName = 'AMDViewModelRegexp-test';

        fw.viewModel.registerLocation(/AMDViewModelRegexp-.*/, 'tests/assets/fixtures/');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
        var namespaceName = 'AMDViewModelFullName';

        fw.viewModel.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

        expect(namespaceName).not.toBeLoaded();

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

        setTimeout(function() {
          expect(namespaceName).toBeLoaded();
          done();
        }, ajaxWait);
      });

      it('can wait for a sub-component to be resolved before its parent is resolved', function(done) {
        var parentNamespaceName = generateNamespaceName();
        var childNamespaceName = generateNamespaceName();
        var parentResolver;
        var childResolver;

        fw.viewModel.register(parentNamespaceName, function() {
          fw.viewModel.boot(this, {
            namespace: parentNamespaceName,
            afterResolve: parentResolver = jasmine.createSpy('parentResolver', function(resolve) {
              expect(childResolver).toHaveBeenCalled();
              expect(resolve()).toBeA('promise');
              done();
            }).and.callThrough()
          });
        });

        fw.viewModel.register(childNamespaceName, function() {
          fw.viewModel.boot(this, {
            namespace: childNamespaceName,
            afterResolve: childResolver = jasmine.createSpy('childResolver', function(resolve) {
              setTimeout(function() {
                expect(parentResolver).not.toHaveBeenCalled();
                resolve();
              }, 150);
            }).and.callThrough()
          });
        });

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + parentNamespaceName + '">' +
          '<viewModel module="' + childNamespaceName + '"></viewModel>' +
        '</viewModel>'));
      });

      it('can wait for a sub-component with promises to be resolved before its parent is resolved', function(done) {
        var parentNamespaceName = generateNamespaceName();
        var childNamespaceName = generateNamespaceName();
        var parentResolver;
        var childResolver;

        fw.viewModel.register(parentNamespaceName, function() {
          fw.viewModel.boot(this, {
            namespace: parentNamespaceName,
            afterResolve: parentResolver = jasmine.createSpy('parentResolver', function(resolve) {
              expect(childResolver).toHaveBeenCalled();
              expect(promiseResolvedSpy).toHaveBeenCalledTimes(2);
              expect(resolve()).toBeA('promise');
              done();
            }).and.callThrough()
          });
        });

        var promiseResolvedSpy = jasmine.createSpy('promiseResolvedSpy');
        var promiseA = new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          }, 60);
        }).then(promiseResolvedSpy);
        var promiseB = new Promise(function(resolve) {
          setTimeout(function() {
            resolve();
          }, 75);
        }).then(promiseResolvedSpy);
        fw.viewModel.register(childNamespaceName, function() {
          fw.viewModel.boot(this, {
            namespace: childNamespaceName,
            afterResolve: childResolver = jasmine.createSpy('childResolver', function(resolve) {
              setTimeout(function() {
                expect(parentResolver).not.toHaveBeenCalled();
                resolve([promiseA, promiseB]).then(function() {
                  expect(promiseResolvedSpy).toHaveBeenCalledTimes(2);
                });
              }, 25);
            }).and.callThrough()
          });
        });

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + parentNamespaceName + '">' +
          '<viewModel module="' + childNamespaceName + '"></viewModel>' +
        '</viewModel>'));
      });

      it('will correctly throw an error when a non-promise is passed in to resolve as part of array of promises', function(done) {
        var namespaceName = generateNamespaceName();

        fw.viewModel.register(namespaceName, function() {
          fw.viewModel.boot(this, {
            namespace: namespaceName,
            afterResolve: function(resolve) {
              expect(function() {
                resolve([false]);
              }).toThrow();
              done();
            }
          });
        });

        fw.start(testContainer = getFixtureContainer('<viewModel module="' + namespaceName + '"></viewModel>'))
      });
    });
  }
);
