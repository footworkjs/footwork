define(['footwork', 'lodash', 'jquery'], function(fw, _, $) {

  describe('viewModel', function() {
    var testContainer;

    beforeEach(function() {
      resetCallbackOrder();
      jasmine.addMatchers(customMatchers);
      fixture.setBase('tests/assets/fixtures');
    });
    afterEach(function() {
      fixture.cleanup(testContainer);
    });

    it('has the ability to create a viewModel', function() {
      expect(fw.viewModel.create).toBeA('function');
      expect(fw.viewModel.create()).toBeA('function');
    });

    it('has the ability to create a viewModel with a correctly defined namespace whos name we can retrieve', function() {
      var ModelA = fw.viewModel.create({
        namespace: 'ModelA'
      });
      var modelA = new ModelA();

      expect(modelA.$namespace).toBeAn('object');
      expect(modelA.$namespace.getName()).toBe('ModelA');
    });

    it('has the ability to be instantiated with with extended attributes', function() {
      var ModelA = fw.viewModel.create({
        extend: {
          extendedAttribute: true
        }
      });
      var modelA = new ModelA();

      expect(modelA.extendedAttribute).toBe(true);
    });

    it('correctly names and increments counter for indexed viewModels', function() {
      var namespaceName = 'IndexedViewModel';
      var IndexedViewModel = fw.viewModel.create({
        namespace: namespaceName,
        autoIncrement: true
      });

      var firstViewModel = new IndexedViewModel();
      var secondViewModel = new IndexedViewModel();
      var thirdViewModel = new IndexedViewModel();

      expect(firstViewModel.$namespace.getName()).toBe(namespaceName + '0');
      expect(secondViewModel.$namespace.getName()).toBe(namespaceName + '1');
      expect(thirdViewModel.$namespace.getName()).toBe(namespaceName + '2');
    });

    it('correctly applies a mixin to a viewModel', function() {
      var namespaceName = 'IndexedViewModel';
      var preInitCallback = jasmine.createSpy('preInitCallback').and.callThrough();
      var postInitCallback = jasmine.createSpy('postInitCallback').and.callThrough();

      var ViewModelWithMixin = fw.viewModel.create({
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

      var viewModel = new ViewModelWithMixin();

      expect(preInitCallback).toHaveBeenCalled();
      expect(viewModel.mixinPresent).toBe(true);
      expect(postInitCallback).toHaveBeenCalled();
    });

    it('has the ability to create nested viewModels with correctly defined namespaces', function() {
      var ModelA = fw.viewModel.create({
        namespace: 'ModelA',
        initialize: function() {
          this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
          this.subModelB = new ModelB();
          this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
        }
      });

      var ModelB = fw.viewModel.create({
        namespace: 'ModelB',
        initialize: function() {
          this.preSubModelNamespaceName = fw.utils.currentNamespaceName();
          this.subModelC = new ModelC();
          this.postSubModelNamespaceName = fw.utils.currentNamespaceName();
        }
      });

      var ModelC = fw.viewModel.create({
        namespace: 'ModelC',
        initialize: function() {
          this.recordedNamespaceName = fw.utils.currentNamespaceName();
        }
      });

      var modelA = new ModelA();
      expect(modelA.preSubModelNamespaceName).toBe('ModelA');
      expect(modelA.postSubModelNamespaceName).toBe('ModelA');
      expect(modelA.subModelB.preSubModelNamespaceName).toBe('ModelB');
      expect(modelA.subModelB.postSubModelNamespaceName).toBe('ModelB');
      expect(modelA.subModelB.subModelC.recordedNamespaceName).toBe('ModelC');
    });

    it('calls afterBinding after initialize with the correct target element when creating and binding a new instance', function() {
      var checkForClass = 'check-for-class';

      var ModelA = fw.viewModel.create({
        namespace: 'ModelA',
        initialize: ensureCallOrder(0),
        afterRender: ensureCallOrder(1, function(containingElement) {
          expect(containingElement.className).toBe(checkForClass);
        })
      });

      fw.applyBindings(new ModelA(), makeTestContainer('', '<div class="' + checkForClass + '"></div>'));
    });

    it('can register a viewModel', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.components.isRegistered(namespaceName)).toBe(false);

      fw.viewModel.register(namespaceName, function() {});

      expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
    });

    it('can get a registered viewModel', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.components.isRegistered(namespaceName)).toBe(false);

      var RegisteredViewModel = function() {};
      fw.viewModel.register(namespaceName, RegisteredViewModel);

      expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
      expect(fw.viewModel.getRegistered(namespaceName)).toBe(RegisteredViewModel);
    });

    it('can get all instantiated viewModels', function() {
      var ViewModel = fw.viewModel.create();
      var viewModels = [ new ViewModel(), new ViewModel() ];

      expect(_.keys(fw.viewModel.getAll()).length).toBeGreaterThan(0);
    });

    it('can get all instantiated viewModels of a specific type/name', function() {
      var viewModels = [];
      var specificViewModelNamespace = fw.utils.guid();
      var ViewModel = fw.viewModel.create({ namespace: specificViewModelNamespace });
      var numToMake = _.random(1,15);

      for(var x = numToMake; x; x--) {
        viewModels.push( new ViewModel() );
      }

      expect(fw.viewModel.getAll('getAllSpecificViewModelDoesNotExist').length).toBe(0);
      expect(fw.viewModel.getAll(specificViewModelNamespace).length).toBe(numToMake);
    });

    it('can autoRegister a viewModel during class method creation', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.viewModel.isRegistered(namespaceName)).toBe(false);

      fw.viewModel.create({
        namespace: namespaceName,
        autoRegister: true
      });

      expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
    });

    it('can bind to the DOM using a <viewModel> declaration', function(done) {
      var wasInitialized = false;
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      fw.viewModel.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: initializeSpy
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('can bind to the DOM using a shared instance', function(done) {
      var boundPropertyValue = fw.utils.guid();

      fw.viewModel.register(boundPropertyValue, {
        instance: {
          boundProperty: boundPropertyValue
        }
      });

      var $container = $(makeTestContainer('<viewModel module="' + boundPropertyValue + '">\
                                              <span class="result" data-bind="text: boundProperty"></span>\
                                            </viewModel>'));
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
      var createViewModelInstance;

      fw.viewModel.register(boundPropertyValue, {
        createViewModel: createViewModelInstance = jasmine.createSpy('createViewModel', function(params, info) {
          expect(params.var).toBe(boundPropertyValue);
          expect(info.element.getAttribute('id')).toBe(boundPropertyValueElement);

          return {
            boundProperty: boundPropertyValue
          };
        }).and.callThrough()
      });

      expect(createViewModelInstance).not.toHaveBeenCalled();
      var $container = $(makeTestContainer('<viewModel module="' + boundPropertyValue + '" id="' + boundPropertyValueElement + '" params="var: \'' + boundPropertyValue + '\'">\
                                              <span class="result" data-bind="text: boundProperty"></span>\
                                            </viewModel>'));

      expect($container.find('.result').text()).not.toBe(boundPropertyValue);
      fw.start($container.get(0));

      setTimeout(function() {
        expect(createViewModelInstance).toHaveBeenCalled();
        expect($container.find('.result').text()).toBe(boundPropertyValue);
        done();
      }, 20);
    });

    it('has the animation classes applied properly', function() {
      var namespaceName = fw.utils.guid();
      var $theElement;
      var initializeSpy;
      var afterRenderSpy;

      fw.viewModel.create({
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
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).toHaveBeenCalled();
      expect($theElement.hasClass('fw-entity-animate')).toBe(true);
    });

    it('can nest <viewModel> declarations', function() {
      var namespaceNameOuter = fw.utils.guid();
      var namespaceNameInner = fw.utils.guid();
      var initializeSpy = jasmine.createSpy('initializeSpy');

      fw.viewModel.create({
        namespace: namespaceNameOuter,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy)
      });

      fw.viewModel.create({
        namespace: namespaceNameInner,
        autoRegister: true,
        initialize: ensureCallOrder(1, initializeSpy)
      });

      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<viewModel module="' + namespaceNameOuter + '">\
        <viewModel module="' + namespaceNameInner + '"></viewModel>\
      </viewModel>'));

      expect(initializeSpy).toHaveBeenCalledTimes(2);
    });

    it('can pass parameters through a <viewModel> declaration', function() {
      var namespaceName = fw.utils.guid();
      var initializeSpy;

      fw.viewModel.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough()
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></viewModel>'));
      expect(initializeSpy).toHaveBeenCalled();
    });

    it('calls onDispose when the containing element is removed from the DOM', function() {
      var namespaceName = 'ViewModelWithDispose';
      var theElement;
      var initializeSpy;
      var afterRenderSpy;
      var onDisposeSpy;

      var WrapperViewModel = fw.viewModel.create({
        initialize: ensureCallOrder(0, jasmine.createSpy('initializeSpy', function() {
          this.showIt = fw.observable(true);
        }).and.callThrough())
      });

      var ViewModelWithDispose = fw.viewModel.create({
        namespace: namespaceName,
        autoRegister: true,
        afterRender: ensureCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
          theElement = element;
          expect(theElement.tagName).toBe('VIEWMODEL');
        }).and.callThrough()),
        onDispose: ensureCallOrder(2, onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
          expect(element).toBe(theElement);
        }).and.callThrough())
      });

      var wrapper = new WrapperViewModel();
      fw.applyBindings(wrapper, makeTestContainer('<div data-bind="if: showIt">\
        <viewModel module="' + namespaceName + '"></viewModel>\
      </div>'));

      expect(onDisposeSpy).not.toHaveBeenCalled();

      wrapper.showIt(false);

      expect(onDisposeSpy).toHaveBeenCalled();
    });
  });
});

// describe('viewModel', function () {


//   it('can have a registered location set and retrieved proplerly', function() {
//     fw.viewModel.registerLocation('registeredLocationRetrieval', '/bogus/path');
//     expect(fw.viewModel.getLocation('registeredLocationRetrieval')).to.be('/bogus/path');
//     fw.viewModel.registerLocation(/regexp.*/, '/bogus/path');
//     expect(fw.viewModel.getLocation('regexp-model')).to.be('/bogus/path');
//   });

//   it('can have an array of models registered to a location and retrieved proplerly', function() {
//     fw.viewModel.registerLocation(['registeredLocationRetrievalArray1', 'registeredLocationRetrievalArray2'], '/bogus/path');
//     expect(fw.viewModel.getLocation('registeredLocationRetrievalArray1')).to.be('/bogus/path');
//     expect(fw.viewModel.getLocation('registeredLocationRetrievalArray2')).to.be('/bogus/path');
//   });

//   it('can have a registered location with filename set and retrieved proplerly', function() {
//     fw.viewModel.registerLocation('registeredLocationWithFilenameRetrieval', '/bogus/path/__file__.js');
//     expect(fw.viewModel.getLocation('registeredLocationWithFilenameRetrieval')).to.be('/bogus/path/__file__.js');
//   });

//   it('can have a specific file extension set and used correctly', function() {
//     fw.viewModel.fileExtensions('.jscript');
//     fw.viewModel.registerLocation('registeredLocationWithExtensionRetrieval', '/bogus/path/');

//     expect(fw.viewModel.getFileName('registeredLocationWithExtensionRetrieval')).to.be('registeredLocationWithExtensionRetrieval.jscript');

//     fw.viewModel.fileExtensions('.js');
//   });

//   it('can have a callback specified as the extension with it invoked and the return value used', function() {
//     fw.viewModel.fileExtensions(function(moduleName) {
//       expect(moduleName).to.be('registeredLocationWithFunctionExtensionRetrieval');
//       return '.jscriptFunction';
//     });
//     fw.viewModel.registerLocation('registeredLocationWithFunctionExtensionRetrieval', '/bogus/path/');

//     expect(fw.viewModel.getFileName('registeredLocationWithFunctionExtensionRetrieval')).to.be('registeredLocationWithFunctionExtensionRetrieval.jscriptFunction');

//     fw.viewModel.fileExtensions('.js');
//   });

//   it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
//     var container = document.getElementById('AMDPreRegisteredViewModel');
//     var viewModelLoaded = false;

//     define('AMDPreRegisteredViewModel', ['footwork'], function(fw) {
//       return fw.viewModel.create({
//         initialize: function() {
//           viewModelLoaded = true;
//         }
//       });
//     });

//     expect(viewModelLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(viewModelLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via registered viewModel with a declarative initialization', function(done) {
//     var container = document.getElementById('registeredViewModel');
//     var registeredViewModelWasLoaded = false;

//     fw.viewModel.register('registeredViewModel', fw.viewModel.create({
//       initialize: function() {
//         registeredViewModelWasLoaded = true;
//       }
//     }));

//     expect(registeredViewModelWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(registeredViewModelWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via requirejs with a declarative initialization from a specified location', function(done) {
//     var container = document.getElementById('AMDViewModel');
//     window.AMDViewModelWasLoaded = false;

//     fw.viewModel.registerLocation('AMDViewModel', 'testAssets/');

//     expect(window.AMDViewModelWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(window.AMDViewModelWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
//     var container = document.getElementById('AMDViewModelRegexp');
//     window.AMDViewModelRegexpWasLoaded = false;

//     fw.viewModel.registerLocation(/AMDViewModelRegexp-.*/, 'testAssets/');

//     expect(window.AMDViewModelRegexpWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(window.AMDViewModelRegexpWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
//     var container = document.getElementById('AMDViewModelFullName');
//     window.AMDViewModelFullNameWasLoaded = false;

//     fw.viewModel.registerLocation('AMDViewModelFullName', 'testAssets/AMDViewModelFullName.js');

//     expect(window.AMDViewModelFullNameWasLoaded).to.be(false);
//     fw.start(container);

//     setTimeout(function() {
//       expect(window.AMDViewModelFullNameWasLoaded).to.be(true);
//       done();
//     }, 40);
//   });

//   it('can specify and load via requirejs with the default location', function(done) {
//     var container = document.getElementById('defaultViewModelLocation');
//     window.defaultViewModelLocationLoaded = false;

//     fw.viewModel.defaultLocation('testAssets/defaultViewModelLocation/');

//     expect(window.defaultViewModelLocationLoaded).to.be(false);

//     fw.start(container);

//     setTimeout(function() {
//       expect(window.defaultViewModelLocationLoaded).to.be(true);
//       done();
//     }, 40);
//   });
// });
