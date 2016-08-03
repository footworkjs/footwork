define(['footwork', 'lodash', 'jquery'],
  function(fw, _, $) {
    describe('broadcast-receive', function() {
      var testContainer;

      beforeEach(function() {
        resetCallbackOrder();
        jasmine.addMatchers(customMatchers);
        fixture.setBase('tests/assets/fixtures');
      });
      afterEach(function() {
        fixture.cleanup(testContainer);
      });

      it('has the ability to create model with a broadcastable', function() {
        var initializeSpy;

        var ModelA = fw.viewModel.create({
          namespace: 'ModelA',
          initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
            this.broadcaster = fw.observable().broadcastAs('broadcaster');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(initializeSpy).toHaveBeenCalled();

        expect(fw.isBroadcastable(modelA.broadcaster)).toBe(true);
      });

      it('has the ability to create model with a receivable', function() {
        var initializeSpy;

        var ModelA = fw.viewModel.create({
          namespace: 'ModelA',
          initialize: ensureCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function() {
            this.receiver = fw.observable().receiveFrom('ModelA', 'broadcaster');
          }).and.callThrough())
        });

        expect(initializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(initializeSpy).toHaveBeenCalled();

        expect(fw.isReceivable(modelA.receiver)).toBe(true);
      });

      it('modelB receivable can receive data from the modelA broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;

        var ModelA = fw.viewModel.create({
          namespace: 'ModelA',
          initialize: ensureCallOrder(0, modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
            this.broadcaster = fw.observable().broadcastAs('broadcaster');
          }).and.callThrough())
        });

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = fw.viewModel.create({
          namespace: 'ModelB',
          initialize: ensureCallOrder(1, modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
            this.receiver = fw.observable().receiveFrom('ModelA', 'broadcaster');
          }).and.callThrough())
        });

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = 'a-specific-value';
        modelA.broadcaster(testValue);
        expect(modelB.receiver()).toBe(testValue);
      });

      it('can have receivable created with a passed in instantiated namespace', function() {
        var namespace = fw.namespace(fw.utils.guid());

        var receivable = fw.observable(null).receiveFrom(namespace, 'broadcaster');
        expect(receivable()).toBe(null);

        var broadcastable = fw.observable('testValue').broadcastAs({ name: 'broadcaster', namespace: namespace });
        expect(receivable()).toBe(broadcastable());
      });

      it('can have standalone broadcastable created with alternative syntax', function() {
        var receivable = fw.observable(null).receiveFrom('alternativeSyntaxTestNamespace', 'broadcaster');

        expect(receivable()).toBe(null);

        var broadcastable = fw.observable('testValue').broadcastAs({ name: 'broadcaster', namespace: 'alternativeSyntaxTestNamespace' });
        expect(receivable()).toBe(broadcastable());

        var broadcastable = fw.observable('testValue2').broadcastAs('broadcaster', 'alternativeSyntaxTestNamespace');
        expect(receivable()).toBe(broadcastable());
      });

      it('can have standalone broadcastable created with alternative syntax and a passed in instantiated namespace', function() {
        var namespace = fw.namespace('alternativeSyntaxTestNamespaceInstance');
        var receivable = fw.observable(null).receiveFrom('alternativeSyntaxTestNamespaceInstance', 'broadcaster');

        expect(receivable()).toBe(null);

        var broadcastable = fw.observable('testValue').broadcastAs({ name: 'broadcaster', namespace: namespace });

        expect(receivable()).toBe(broadcastable());
      });
    });
  }
);
