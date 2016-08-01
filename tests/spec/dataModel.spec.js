define(['footwork', 'lodash', 'jquery'], function(fw, _, $) {

  describe('dataModel', function() {
    var testContainer;

    beforeEach(function() {
      resetCallbackOrder();
      jasmine.addMatchers(customMatchers);
      fixture.setBase('tests/assets/fixtures');
    });
    afterEach(function() {
      fixture.cleanup(testContainer);
    });

    it('has the ability to create a dataModel', function() {
      expect(fw.dataModel.create).toBeA('function');
      expect(fw.dataModel.create()).toBeA('function');

      var dataModel = new (fw.dataModel.create())();

      expect(dataModel.fetch).toBeA('function');
      expect(dataModel.save).toBeA('function');
      expect(dataModel.destroy).toBeA('function');
      expect(dataModel.set).toBeA('function');
      expect(dataModel.get).toBeA('function');
    });

    it('has the ability to create a dataModel with a correctly defined namespace whos name we can retrieve', function() {
      var namespaceName = fw.utils.guid();
      var ModelA = fw.dataModel.create({
        namespace: namespaceName
      });
      var modelA = new ModelA();

      expect(modelA.$namespace).toBeAn('object');
      expect(modelA.$namespace.getName()).toBe(namespaceName);
    });

    it('has the ability to be instantiated with with extended attributes', function() {
      var ModelA = fw.dataModel.create({
        extend: {
          extendedAttribute: true
        }
      });
      var modelA = new ModelA();

      expect(modelA.extendedAttribute).toBe(true);
    });

    it('correctly names and increments counter for indexed dataModels', function() {
      var IndexedDataModel = fw.dataModel.create({
        namespace: 'IndexedDataModel',
        autoIncrement: true
      });

      var firstDataModel = new IndexedDataModel();
      var secondDataModel = new IndexedDataModel();
      var thirdDataModel = new IndexedDataModel();

      expect(firstDataModel.$namespace.getName()).toBe('IndexedDataModel0');
      expect(secondDataModel.$namespace.getName()).toBe('IndexedDataModel1');
      expect(thirdDataModel.$namespace.getName()).toBe('IndexedDataModel2');
    });

    it('correctly applies a mixin to a dataModel', function() {
      var namespaceName = fw.utils.guid();
      var preInitCallback = jasmine.createSpy('preInitCallback').and.callThrough();
      var postInitCallback = jasmine.createSpy('postInitCallback').and.callThrough();

      var DataModelWithMixin = fw.dataModel.create({
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

      var dataModel = new DataModelWithMixin();

      expect(preInitCallback).toHaveBeenCalled();
      expect(dataModel.mixinPresent).toBe(true);
      expect(postInitCallback).toHaveBeenCalled();
    });

    it('has the ability to create nested dataModels with correctly defined namespaces', function() {
      var initializeSpyA;
      var initializeSpyB;
      var initializeSpyC;

      var ModelA = fw.dataModel.create({
        namespace: 'ModelA',
        initialize: ensureCallOrder(0, initializeSpyA = jasmine.createSpy('initializeSpyA', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelA');
          this.subModelB = new ModelB();
          expect(fw.utils.currentNamespaceName()).toBe('ModelA');
        }).and.callThrough())
      });

      var ModelB = fw.dataModel.create({
        namespace: 'ModelB',
        initialize: ensureCallOrder(1, initializeSpyB = jasmine.createSpy('initializeSpyB', function() {
          expect(fw.utils.currentNamespaceName()).toBe('ModelB');
          this.subModelC = new ModelC();
          expect(fw.utils.currentNamespaceName()).toBe('ModelB');
        }).and.callThrough())
      });

      var ModelC = fw.dataModel.create({
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

      var ModelA = fw.dataModel.create({
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

    it('can register a dataModel', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.dataModel.isRegistered(namespaceName)).toBe(false);

      fw.dataModel.register(namespaceName, function() {});

      expect(fw.dataModel.isRegistered(namespaceName)).toBe(true);
    });

    it('can get a registered dataModel', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.dataModel.isRegistered(namespaceName)).toBe(false);

      var Model = function() {};
      fw.dataModel.register(namespaceName, Model);

      expect(fw.dataModel.isRegistered(namespaceName)).toBe(true);
      expect(fw.dataModel.getRegistered(namespaceName)).toBe(Model);
    });

    ////

    it('can get all instantiated dataModels', function() {
      var DataModel = fw.dataModel.create();
      var dataModels = [ new DataModel(), new DataModel() ];

      expect(_.keys(fw.dataModel.getAll()).length).toBeGreaterThan(0);
    });

    it('can get all instantiated dataModels of a specific type/name', function() {
      var dataModels = [];
      var specificDataModelNamespace = fw.utils.guid();
      var DataModel = fw.dataModel.create({ namespace: specificDataModelNamespace });
      var numToMake = _.random(1,15);

      for(var x = numToMake; x; x--) {
        dataModels.push( new DataModel() );
      }

      expect(fw.dataModel.getAll('getAllSpecificDataModelDoesNotExist').length).toBe(0);
      expect(fw.dataModel.getAll(specificDataModelNamespace).length).toBe(numToMake);
    });

    it('can autoRegister a dataModel during class method creation', function() {
      var namespaceName = fw.utils.guid();
      expect(fw.dataModel.isRegistered(namespaceName)).toBe(false);

      fw.dataModel.create({
        namespace: namespaceName,
        autoRegister: true
      });

      expect(fw.dataModel.isRegistered(namespaceName)).toBe(true);
    });

    it('can bind to the DOM using a <dataModel> declaration', function(done) {
      var wasInitialized = false;
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      fw.dataModel.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: initializeSpy
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('can bind to the DOM using a shared instance', function(done) {
      var boundPropertyValue = fw.utils.guid();

      fw.dataModel.register(boundPropertyValue, {
        instance: {
          boundProperty: boundPropertyValue
        }
      });

      var $container = $(makeTestContainer('<dataModel module="' + boundPropertyValue + '">\
                                              <span class="result" data-bind="text: boundProperty"></span>\
                                            </dataModel>'));
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
      var createDataModelInstance;

      fw.dataModel.register(boundPropertyValue, {
        createDataModel: createDataModelInstance = jasmine.createSpy('createDataModel', function(params, info) {
          expect(params.var).toBe(boundPropertyValue);
          expect(info.element.getAttribute('id')).toBe(boundPropertyValueElement);

          return {
            boundProperty: boundPropertyValue
          };
        }).and.callThrough()
      });

      expect(createDataModelInstance).not.toHaveBeenCalled();
      var $container = $(makeTestContainer('<dataModel module="' + boundPropertyValue + '" id="' + boundPropertyValueElement + '" params="var: \'' + boundPropertyValue + '\'">\
                                              <span class="result" data-bind="text: boundProperty"></span>\
                                            </dataModel>'));

      expect($container.find('.result').text()).not.toBe(boundPropertyValue);
      fw.start($container.get(0));

      setTimeout(function() {
        expect(createDataModelInstance).toHaveBeenCalled();
        expect($container.find('.result').text()).toBe(boundPropertyValue);
        done();
      }, 20);
    });

    it('has the animation classes applied properly', function() {
      var namespaceName = fw.utils.guid();
      var $theElement;
      var initializeSpy;
      var afterRenderSpy;

      fw.dataModel.create({
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
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).toHaveBeenCalled();
      expect($theElement.hasClass('fw-entity-animate')).toBe(true);
    });

    it('can nest <dataModel> declarations', function() {
      var namespaceNameOuter = fw.utils.guid();
      var namespaceNameInner = fw.utils.guid();
      var initializeSpy = jasmine.createSpy('initializeSpy');

      fw.dataModel.create({
        namespace: namespaceNameOuter,
        autoRegister: true,
        initialize: ensureCallOrder(0, initializeSpy)
      });

      fw.dataModel.create({
        namespace: namespaceNameInner,
        autoRegister: true,
        initialize: ensureCallOrder(1, initializeSpy)
      });

      expect(initializeSpy).not.toHaveBeenCalled();

      fw.start(makeTestContainer('<dataModel module="' + namespaceNameOuter + '">\
        <dataModel module="' + namespaceNameInner + '"></dataModel>\
      </dataModel>'));

      expect(initializeSpy).toHaveBeenCalledTimes(2);
    });

    it('can pass parameters through a <dataModel> declaration', function() {
      var namespaceName = fw.utils.guid();
      var initializeSpy;

      fw.dataModel.create({
        namespace: namespaceName,
        autoRegister: true,
        initialize: initializeSpy = jasmine.createSpy('initializeSpy', function(params) {
          expect(params.testValueOne).toBe(1);
          expect(params.testValueTwo).toEqual([1,2,3]);
        }).and.callThrough()
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '" params="testValueOne: 1, testValueTwo: [1,2,3]"></dataModel>'));
      expect(initializeSpy).toHaveBeenCalled();
    });

    it('calls onDispose when the containing element is removed from the DOM', function() {
      var namespaceName = fw.utils.guid();
      var theElement;
      var initializeSpy;
      var afterRenderSpy;
      var onDisposeSpy;

      var WrapperDataModel = fw.dataModel.create({
        initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
          this.showIt = fw.observable(true);
        }).and.callThrough())
      });

      var DataModelWithDispose = fw.dataModel.create({
        namespace: namespaceName,
        autoRegister: true,
        afterRender: ensureCallOrder(1, afterRenderSpy = jasmine.createSpy('afterRenderSpy', function(element) {
          theElement = element;
          expect(theElement.tagName).toBe('DATAMODEL');
        }).and.callThrough()),
        onDispose: ensureCallOrder(2, onDisposeSpy = jasmine.createSpy('onDisposeSpy', function(element) {
          expect(element).toBe(theElement);
        }).and.callThrough())
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();

      var wrapper = new WrapperDataModel();

      expect(initializeSpy).toHaveBeenCalled();
      expect(afterRenderSpy).not.toHaveBeenCalled();

      fw.applyBindings(wrapper, makeTestContainer('<div data-bind="if: showIt">\
        <dataModel module="' + namespaceName + '"></dataModel>\
      </div>'));

      expect(onDisposeSpy).not.toHaveBeenCalled();

      wrapper.showIt(false);

      expect(afterRenderSpy).toHaveBeenCalled();
      expect(onDisposeSpy).toHaveBeenCalled();
    });

    it('can have a registered location set and retrieved proplerly', function() {
      var namespaceName = fw.utils.guid();
      fw.dataModel.registerLocation(namespaceName, '/bogus/path');
      expect(fw.dataModel.getLocation(namespaceName)).toBe('/bogus/path');
      fw.dataModel.registerLocation(/regexp.*/, '/bogus/path');
      expect(fw.dataModel.getLocation('regexp-model')).toBe('/bogus/path');
    });

    it('can have an array of models registered to a location and retrieved proplerly', function() {
      var namespaceNames = [ fw.utils.guid(), fw.utils.guid() ];
      fw.dataModel.registerLocation(namespaceNames, '/bogus/path');
      expect(fw.dataModel.getLocation(namespaceNames[0])).toBe('/bogus/path');
      expect(fw.dataModel.getLocation(namespaceNames[1])).toBe('/bogus/path');
    });

    it('can have a registered location with filename set and retrieved proplerly', function() {
      var namespaceName = fw.utils.guid();
      fw.dataModel.registerLocation(namespaceName, '/bogus/path/__file__.js');
      expect(fw.dataModel.getLocation(namespaceName)).toBe('/bogus/path/__file__.js');
    });

    it('can have a specific file extension set and used correctly', function() {
      var namespaceName = fw.utils.guid();
      var customExtension = '.jscript';
      fw.dataModel.fileExtensions(customExtension);
      fw.dataModel.registerLocation(namespaceName, '/bogus/path/');

      expect(fw.dataModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

      fw.dataModel.fileExtensions('.js');
    });

    it('can have a callback specified as the extension with it invoked and the return value used', function() {
      var namespaceName = fw.utils.guid();
      var customExtension = '.jscriptFunction';
      fw.dataModel.fileExtensions(function(moduleName) {
        expect(moduleName).toBe(namespaceName);
        return customExtension;
      });
      fw.dataModel.registerLocation(namespaceName, '/bogus/path/');

      expect(fw.dataModel.getFileName(namespaceName)).toBe(namespaceName + customExtension);

      fw.dataModel.fileExtensions('.js');
    });

    it('can load via requirejs with a declarative initialization from an already registered module', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      define(namespaceName, ['footwork'], function(fw) {
        return fw.dataModel.create({
          initialize: initializeSpy
        });
      });

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can load via registered dataModel with a declarative initialization', function(done) {
      var namespaceName = fw.utils.guid();
      var initializeSpy = jasmine.createSpy();

      fw.dataModel.register(namespaceName, fw.dataModel.create({
        initialize: initializeSpy
      }));

      expect(initializeSpy).not.toHaveBeenCalled();
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

      setTimeout(function() {
        expect(initializeSpy).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can load via requirejs with a declarative initialization from a specified location', function(done) {
      var namespaceName = 'AMDDataModel';
      window.AMDDataModelWasLoaded = false;

      fw.dataModel.registerLocation(namespaceName, 'tests/assets/fixtures/');

      expect(window.AMDDataModelWasLoaded).toBe(false);
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

      setTimeout(function() {
        expect(window.AMDDataModelWasLoaded).toBe(true);
        done();
      }, 40);
    });

    it('can load via requirejs with a declarative initialization from a specified RegExp-based location', function(done) {
      window.AMDDataModelRegexpWasLoaded = false;

      fw.dataModel.registerLocation(/AMDDataModelRegexp-.*/, 'tests/assets/fixtures/');

      expect(window.AMDDataModelRegexpWasLoaded).toBe(false);
      fw.start(makeTestContainer('<dataModel module="AMDDataModelRegexp-test"></dataModel>'));

      setTimeout(function() {
        expect(window.AMDDataModelRegexpWasLoaded).toBe(true);
        done();
      }, 40);
    });

    it('can load via requirejs with a declarative initialization from a specified location with the full file name', function(done) {
      var namespaceName = 'AMDDataModelFullName';
      window.AMDDataModelFullNameWasLoaded = false;

      fw.dataModel.registerLocation(namespaceName, 'tests/assets/fixtures/' + namespaceName + '.js');

      expect(window.AMDDataModelFullNameWasLoaded).toBe(false);
      fw.start(makeTestContainer('<dataModel module="' + namespaceName + '"></dataModel>'));

      setTimeout(function() {
        expect(window.AMDDataModelFullNameWasLoaded).toBe(true);
        done();
      }, 40);
    });

    it('can specify and load via requirejs with the default location', function(done) {
      window.defaultDataModelLoaded = false;

      fw.dataModel.defaultLocation('tests/assets/fixtures/defaultDataModelLocation/');

      expect(window.defaultDataModelLoaded).toBe(false);

      fw.start(makeTestContainer('<dataModel module="defaultDataModel"></dataModel>'));

      setTimeout(function() {
        expect(window.defaultDataModelLoaded).toBe(true);
        done();
      }, 40);
    });

  });
});
