define(['footwork', 'lodash', 'jquery', 'tools', 'fetch-mock'],
  function(fw, _, $, tools, fetchMock) {
    describe('broadcast-receive', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      it('has the ability to create model with a broadcastable', function() {
        var initializeSpy;

        var ModelA = initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this);
          this.broadcaster = fw.observable().broadcastAs('broadcaster', this);
        }).and.callThrough();

        expect(initializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(initializeSpy).toHaveBeenCalled();

        expect(fw.isBroadcastable(modelA.broadcaster)).toBe(true);
      });

      it('has the ability to create a broadcastable based on a string identifier', function() {
        var namespaceName = tools.randomString();
        var testValue = tools.randomString();

        var broadcaster = fw.observable(testValue).broadcastAs('broadcaster', namespaceName);
        var receiver = fw.observable().receiveFrom(namespaceName, 'broadcaster');

        expect(receiver()).toBe(testValue);
      });

      it('throws an error when an invalid namespace is specified for a broadcastable', function() {
        expect(function() {fw.observable().broadcastAs('something', null)}).toThrow();
      });

      it('throws an error when an invalid namespace is specified for a receivable', function() {
        expect(function() {fw.observable().receiveFrom(null, 'something')}).toThrow();
      });

      it('can create and dispose of a broadcastable correctly', function() {
        var namespaceName = tools.randomString();
        var testValue = tools.randomString();
        var testValue2 = tools.randomString();
        var testValue3 = tools.randomString();

        var broadcaster = fw.observable(testValue).broadcastAs('broadcaster', namespaceName);
        var receiver = fw.observable().receiveFrom(namespaceName, 'broadcaster');

        expect(receiver()).toBe(testValue);
        broadcaster(testValue2);
        expect(receiver()).toBe(testValue2);

        broadcaster.dispose();
        broadcaster(testValue3);
        expect(receiver()).not.toBe(testValue3);
      });

      it('can create and dispose of a receivable correctly', function() {
        var namespaceName = tools.randomString();
        var testValue = tools.randomString();
        var testValue2 = tools.randomString();
        var testValue3 = tools.randomString();

        var broadcaster = fw.observable(testValue).broadcastAs('broadcaster', namespaceName);
        var receiver = fw.observable().receiveFrom(namespaceName, 'broadcaster');

        expect(receiver()).toBe(testValue);
        broadcaster(testValue2);
        expect(receiver()).toBe(testValue2);

        receiver.dispose();
        broadcaster(testValue3);
        expect(receiver()).not.toBe(testValue3);
      });

      it('has the ability to create model with a receivable', function() {
        var initializeSpy;

        var ModelA = initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this);
          this.receiver = fw.observable().receiveFrom('ModelA', 'broadcaster');
        }).and.callThrough();

        expect(initializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(initializeSpy).toHaveBeenCalled();

        expect(fw.isReceivable(modelA.receiver)).toBe(true);
      });

      it('modelB receivable can receive data from the modelA broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var modelANamespaceName = tools.generateNamespaceName();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName
          });
          this.broadcaster = fw.observable().broadcastAs('broadcaster', this);
        }).and.callThrough();

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          fw.viewModel.boot(this);
          this.receiver = fw.observable().receiveFrom(modelANamespaceName, 'broadcaster');
        }).and.callThrough();

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = tools.randomString();
        modelA.broadcaster(testValue);
        expect(modelB.receiver()).toBe(testValue);
      });

      it('can have receivable created with a passed in instantiated namespace', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());

        var receivable = fw.observable(null).receiveFrom(namespace, 'broadcaster');
        expect(receivable()).toBe(null);

        var broadcastable = fw.observable(tools.randomString()).broadcastAs('broadcaster', namespace);
        expect(receivable()).toBe(broadcastable());
      });

      it('modelB can write to a receivable and modelA sees the new data on a writable broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var modelANamespaceName = tools.generateNamespaceName();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName,
          });
          this.writableBroadcaster = fw.observable().broadcastAs('writableBroadcaster', this, true);
        }).and.callThrough()

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          fw.viewModel.boot(this);
          this.writableReceiver = fw.observable().receiveFrom(modelANamespaceName, 'writableBroadcaster');
        }).and.callThrough()

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = tools.randomString();
        modelB.writableReceiver(testValue);

        expect(modelA.writableBroadcaster()).toBe(testValue);
      });

      it('cannot write to non-writable broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var modelANamespaceName = tools.generateNamespaceName();

        var nonwritableBroadcaster = fw.observable().broadcastAs('nonwritableBroadcaster', modelANamespaceName);
        var nonwritableReceiver = fw.observable().receiveFrom(modelANamespaceName, 'nonwritableBroadcaster');

        var testValue = tools.randomString();
        nonwritableReceiver(testValue);
        expect(nonwritableReceiver()).not.toBe(testValue);
        expect(nonwritableBroadcaster()).not.toBe(testValue);
      });

      it('receivable with .when() specified writes when callback returns true', function() {
        var whenSpy;
        var modelANamespaceName = tools.generateNamespaceName();

        var broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback', modelANamespaceName);
        var receiver = fw.observable().receiveFrom(modelANamespaceName, 'broadcasterToTestWhenCallback').when(whenSpy = jasmine.createSpy('whenSpy', function() {
          return true;
        }).and.callThrough());

        expect(whenSpy).not.toHaveBeenCalled();

        var testValue = tools.randomString();
        broadcaster(testValue);
        expect(whenSpy).toHaveBeenCalled();
        expect(receiver()).toBe(testValue);
      });

      it('receivable with .when() specified writes when callback matches a specific value', function() {
        var modelANamespaceName = tools.generateNamespaceName();
        var writableValue = tools.randomString();

        var broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback', modelANamespaceName);
        var receiver = fw.observable().receiveFrom(modelANamespaceName, 'broadcasterToTestWhenCallback').when(writableValue);

        var testValue = tools.randomString();
        broadcaster(testValue);
        expect(receiver()).not.toBe(testValue);

        broadcaster(writableValue);
        expect(receiver()).toBe(writableValue);
      });

      it('receivable with .when() specified does NOT write when callback returns false', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var whenSpy;
        var modelANamespaceName = tools.generateNamespaceName();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName,
          });
          this.broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback', this);
        }).and.callThrough();

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          fw.viewModel.boot(this);
          this.receiver = fw.observable().receiveFrom(modelANamespaceName, 'broadcasterToTestWhenCallback').when(whenSpy = jasmine.createSpy('whenSpy', function() {
            return false;
          }).and.callThrough());
        }).and.callThrough();

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(whenSpy).not.toHaveBeenCalled();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = tools.randomString();
        modelA.broadcaster(testValue);
        expect(whenSpy).toHaveBeenCalled();
        expect(modelB.receiver()).toBe(undefined);
      });

      it('receivable with .when() sees correct value passed to it in the callback', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var whenSpy;
        var modelANamespaceName = tools.generateNamespaceName();
        var writableTestValue = tools.randomString();
        var nonWrittenTestValue = tools.randomString();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName,
          });
          this.broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback', this);
        }).and.callThrough();

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          this.receiver = fw.observable().receiveFrom(modelANamespaceName, 'broadcasterToTestWhenCallback').when(whenSpy = jasmine.createSpy('whenSpy', function(val) {
            return val === writableTestValue;
          }).and.callThrough());
        }).and.callThrough();


        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(whenSpy).not.toHaveBeenCalled();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        modelA.broadcaster(nonWrittenTestValue);
        expect(whenSpy).toHaveBeenCalledTimes(1);
        expect(modelB.receiver()).not.toBe(nonWrittenTestValue);

        modelA.broadcaster(writableTestValue);
        expect(whenSpy).toHaveBeenCalledTimes(2);
        expect(modelB.receiver()).toBe(writableTestValue);

        modelA.broadcaster(nonWrittenTestValue);
        expect(whenSpy).toHaveBeenCalledTimes(3);
        expect(modelB.receiver()).not.toBe(nonWrittenTestValue);
      });
    });
  }
);
