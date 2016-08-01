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
      var namespaceName = fw.utils.guid();
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
      var namespaceName = fw.utils.guid();
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
      var initializeSpyA;
      var initializeSpyB;
      var initializeSpyC;

      var ModelA = fw.viewModel.create({
        namespace: 'ModelA',
        initialize: ensureCallOrder(0, initializeSpyA = jasmine.createSpy('initializeSpyA', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelA');
          this.subModelB = new ModelB();
          expect(fw.utils.currentNamespaceName()).toBe('ModelA');
        }).and.callThrough())
      });

      var ModelB = fw.viewModel.create({
        namespace: 'ModelB',
        initialize: ensureCallOrder(1, initializeSpyB = jasmine.createSpy('initializeSpyB', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelB');
          this.subModelC = new ModelC();
          expect(fw.utils.currentNamespaceName()).toBe('ModelB');
        }).and.callThrough())
      });

      var ModelC = fw.viewModel.create({
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

      var ModelA = fw.viewModel.create({
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

    it('can register a viewModel', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.viewModel.isRegistered(namespaceName)).toBe(false);

      fw.viewModel.register(namespaceName, function() {});

      expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
    });

    it('can get a registered viewModel', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.viewModel.isRegistered(namespaceName)).toBe(false);

      var Model = function() {};
      fw.viewModel.register(namespaceName, Model);

      expect(fw.viewModel.isRegistered(namespaceName)).toBe(true);
      expect(fw.viewModel.getRegistered(namespaceName)).toBe(Model);
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
      var namespaceName = fw.utils.guid();
      var theElement;
      var initializeSpy;
      var afterRenderSpy;
      var onDisposeSpy;

      var WrapperViewModel = fw.viewModel.create({
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
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

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();

      var wrapper = new WrapperViewModel();

      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();

      fw.applyBindings(wrapper, makeTestContainer('<div data-bind="if: showIt">\
        <viewModel module="' + namespaceName + '"></viewModel>\
      </div>'));

      expect(onDisposeSpy).not.toHaveBeenCalled();

      wrapper.showIt(false);

      expect(afterRenderSpy).toHaveBeenCalled();
      expect(onDisposeSpy).toHaveBeenCalled();
    });

    it('can have a registered location set and retrieved proplerly', function() {
      var namespaceName = fw.utils.guid();
      fw.viewModel.registerLocation(namespaceName, '/bogus/path');
      expect(fw.viewModel.getLocation(namespaceName)).toBe('/bogus/path');
      fw.viewModel.registerLocation(/regexp.*/, '/bogus/path');
      expect(fw.viewModel.getLocation('regexp-model')).toBe('/bogus/path');
    });

    it('can have an array of models registered to a location and retrieved proplerly', function() {
      var namespaceNames = [ fw.utils.guid(), fw.utils.guid() ];
      fw.viewModel.registerLocation(namespaceNames, '/bogus/path');
      expect(fw.viewModel.getLocation(namespaceNames[0])).toBe('/bogus/path');
      expect(fw.viewModel.getLocation(namespaceNames[1])).toBe('/bogus/path');
    });

    it('can have a registered location with filename set and retrieved proplerly', function() {
      var namespaceName = fw.utils.guid();
      fw.viewModel.registerLocation(namespaceName, '/bogus/path/__file__.js');
      expect(fw.viewModel.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
    });

    it('can have a specific file extension set and used correctly', function() {
      var namespaceName = fw.utils.guid();
      var customExtension = '.jscript';
      fw.viewModel.fileExtensions(customExtension);
      fw.viewModel.registerLocation(namespaceName, '/bogus/path/');

      expect(fw.viewModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

      fw.viewModel.fileExtensions('.js');
    });

    it('can have a callback specified as the extension with it invoked and the return value used', function() {
      var namespaceName = fw.utils.guid();
      var customExtension = '.jscriptFunction';
      fw.viewModel.fileExtensions(function(moduleName) {
        expect(moduleName).toBe(namespaceName);
        return customExtension;
      });
      fw.viewModel.registerLocation(namespaceName, '/bogus/path/');

      expect(fw.viewModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

      fw.viewModel.fileExtensions('.js');
    });

    it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      define(namespaceName, ['footwork'], function(fw) {
        return fw.viewModel.create({
          initialize: initializeSpy
        });
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can load via registered viewModel with a declarative initialization', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      fw.viewModel.register(namespaceName, fw.viewModel.create({
        initialize: initializeSpy
      }));

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can load via requirejs with a declarative initialization from a specified location', function(done) {
      var namespaceName = 'AMDViewModel';
      window.AMDViewModelWasLoaded = false;

      fw.viewModel.registerLocation(namespaceName, 'tests/assets/fixtures/');

      expect(window.AMDViewModelWasLoaded).toBe(false);
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

      setTimeout(function() {
        expect(window.AMDViewModelWasLoaded).toBe(true);
        done();
      }, 40);
    });

    it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
      window.AMDViewModelRegexpWasLoaded = false;

      fw.viewModel.registerLocation(/AMDViewModelRegexp-.*/, 'tests/assets/fixtures/');

      expect(window.AMDViewModelRegexpWasLoaded).toBe(false);
      fw.start(makeTestContainer('<viewModel module="AMDViewModelRegexp-test"></viewModel>'));

      setTimeout(function() {
        expect(window.AMDViewModelRegexpWasLoaded).toBe(true);
        done();
      }, 40);
    });

    it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
      var namespaceName = 'AMDViewModelFullName';
      window.AMDViewModelFullNameWasLoaded = false;

      fw.viewModel.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

      expect(window.AMDViewModelFullNameWasLoaded).toBe(false);
      fw.start(makeTestContainer('<viewModel module="' + namespaceName + '"></viewModel>'));

      setTimeout(function() {
        expect(window.AMDViewModelFullNameWasLoaded).toBe(true);
        done();
      }, 40);
    });

    it('can specify and load via requirejs with the default location', function(done) {
      window.defaultViewModelLoaded = false;

      fw.viewModel.defaultLocation('tests/assets/fixtures/defaultViewModelLocation/');

      expect(window.defaultViewModelLoaded).toBe(false);

      fw.start(makeTestContainer('<viewModel module="defaultViewModel"></viewModel>'));

      setTimeout(function() {
        expect(window.defaultViewModelLoaded).toBe(true);
        done();
      }, 40);
    });
  });
});
