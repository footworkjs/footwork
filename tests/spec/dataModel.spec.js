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
  });
});
