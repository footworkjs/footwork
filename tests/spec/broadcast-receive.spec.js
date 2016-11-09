define(['footwork'],
  function(fw) {
    describe('broadcast-receive', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('has the ability to create model with a broadcastable', function() {
        var initializeSpy;

        var ModelA = initializeSpy = jasmine.createSpy('initializeSpy', function() {
          fw.viewModel.boot(this);
          this.broadcaster = fw.observable().broadcast('broadcaster', this);
        }).and.callThrough();

        expect(initializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(initializeSpy).toHaveBeenCalled();

        expect(fw.isBroadcastable(modelA.broadcaster)).toBe(true);
      });

      it('has the ability to create a broadcastable based on a string identifier', function() {
        var namespaceName = randomString();
        var testValue = randomString();

        var broadcaster = fw.observable(testValue).broadcast('broadcaster', namespaceName);
        var receiver = fw.observable().receive('broadcaster', namespaceName);

        expect(receiver()).toBe(testValue);
      });

      it('throws an error when an invalid namespace is specified for a broadcastable', function() {
        expect(function() {fw.observable().broadcast('something', null)}).toThrow();
      });

      it('throws an error when an invalid namespace is specified for a receivable', function() {
        expect(function() {fw.observable().receive('something', null)}).toThrow();
      });

      it('can create and dispose of a broadcastable correctly', function() {
        var namespaceName = randomString();
        var testValue = randomString();
        var testValue2 = randomString();
        var testValue3 = randomString();

        var broadcaster = fw.observable(testValue).broadcast('broadcaster', namespaceName);
        var receiver = fw.observable().receive('broadcaster', namespaceName);

        expect(receiver()).toBe(testValue);
        broadcaster(testValue2);
        expect(receiver()).toBe(testValue2);

        broadcaster.dispose();
        broadcaster(testValue3);
        expect(receiver()).not.toBe(testValue3);
      });

      it('can create and dispose of a receivable correctly', function() {
        var namespaceName = randomString();
        var testValue = randomString();
        var testValue2 = randomString();
        var testValue3 = randomString();

        var broadcaster = fw.observable(testValue).broadcast('broadcaster', namespaceName);
        var receiver = fw.observable().receive('broadcaster', namespaceName);

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
          this.receiver = fw.observable().receive('broadcaster', 'ModelA');
        }).and.callThrough();

        expect(initializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(initializeSpy).toHaveBeenCalled();

        expect(fw.isReceivable(modelA.receiver)).toBe(true);
      });

      it('modelB receivable can receive data from the modelA broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var modelANamespaceName = generateNamespaceName();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName
          });
          this.broadcaster = fw.observable().broadcast('broadcaster', this);
        }).and.callThrough();

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          fw.viewModel.boot(this);
          this.receiver = fw.observable().receive('broadcaster', modelANamespaceName);
        }).and.callThrough();

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = randomString();
        modelA.broadcaster(testValue);
        expect(modelB.receiver()).toBe(testValue);
      });

      it('can have receivable created with a passed in instantiated namespace', function() {
        var namespace = fw.namespace(generateNamespaceName());

        var receivable = fw.observable(null).receive('broadcaster', namespace);
        expect(receivable()).toBe(null);

        var broadcastable = fw.observable(randomString()).broadcast('broadcaster', namespace);
        expect(receivable()).toBe(broadcastable());
      });

      it('modelB can write to a receivable and modelA sees the new data on a writable broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var modelANamespaceName = generateNamespaceName();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName
          });
          this.writableBroadcaster = fw.observable().broadcast('writableBroadcaster', this, true);
        }).and.callThrough()

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          fw.viewModel.boot(this);
          this.writableReceiver = fw.observable().receive('writableBroadcaster', modelANamespaceName);
        }).and.callThrough()

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = randomString();
        modelB.writableReceiver(testValue);

        expect(modelA.writableBroadcaster()).toBe(testValue);
      });

      it('cannot write to non-writable broadcastable', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var modelANamespaceName = generateNamespaceName();

        var nonwritableBroadcaster = fw.observable().broadcast('nonwritableBroadcaster', modelANamespaceName);
        var nonwritableReceiver = fw.observable().receive('nonwritableBroadcaster', modelANamespaceName);

        var testValue = randomString();
        nonwritableReceiver(testValue);
        expect(nonwritableReceiver()).not.toBe(testValue);
        expect(nonwritableBroadcaster()).not.toBe(testValue);
      });

      it('receivable with .when() specified writes when callback returns true', function() {
        var whenSpy;
        var modelANamespaceName = generateNamespaceName();

        var broadcaster = fw.observable().broadcast('broadcasterToTestWhenCallback', modelANamespaceName);
        var receiver = fw.observable().receive('broadcasterToTestWhenCallback', modelANamespaceName).when(whenSpy = jasmine.createSpy('whenSpy', function() {
          return true;
        }).and.callThrough());

        expect(whenSpy).not.toHaveBeenCalled();

        var testValue = randomString();
        broadcaster(testValue);
        expect(whenSpy).toHaveBeenCalled();
        expect(receiver()).toBe(testValue);
      });

      it('receivable with .when() specified writes when callback matches a specific value', function() {
        var modelANamespaceName = generateNamespaceName();
        var writableValue = randomString();

        var broadcaster = fw.observable().broadcast('broadcasterToTestWhenCallback', modelANamespaceName);
        var receiver = fw.observable().receive('broadcasterToTestWhenCallback', modelANamespaceName).when(writableValue);

        var testValue = randomString();
        broadcaster(testValue);
        expect(receiver()).not.toBe(testValue);

        broadcaster(writableValue);
        expect(receiver()).toBe(writableValue);
      });

      it('receivable with .when() specified does NOT write when callback returns false', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var whenSpy;
        var modelANamespaceName = generateNamespaceName();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName,
          });
          this.broadcaster = fw.observable().broadcast('broadcasterToTestWhenCallback', this);
        }).and.callThrough();

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          fw.viewModel.boot(this);
          this.receiver = fw.observable().receive('broadcasterToTestWhenCallback', modelANamespaceName).when(whenSpy = jasmine.createSpy('whenSpy', function() {
            return false;
          }).and.callThrough());
        }).and.callThrough();

        expect(modelBInitializeSpy).not.toHaveBeenCalled();
        var modelB = new ModelB();
        expect(whenSpy).not.toHaveBeenCalled();
        expect(modelBInitializeSpy).toHaveBeenCalled();

        var testValue = randomString();
        modelA.broadcaster(testValue);
        expect(whenSpy).toHaveBeenCalled();
        expect(modelB.receiver()).toBe(undefined);
      });

      it('receivable with .when() sees correct value passed to it in the callback', function() {
        var modelAInitializeSpy;
        var modelBInitializeSpy;
        var whenSpy;
        var modelANamespaceName = generateNamespaceName();
        var writableTestValue = randomString();
        var nonWrittenTestValue = randomString();

        var ModelA = modelAInitializeSpy = jasmine.createSpy('modelAInitializeSpy', function() {
          fw.viewModel.boot(this, {
            namespace: modelANamespaceName,
          });
          this.broadcaster = fw.observable().broadcast('broadcasterToTestWhenCallback', this);
        }).and.callThrough();

        expect(modelAInitializeSpy).not.toHaveBeenCalled();
        var modelA = new ModelA();
        expect(modelAInitializeSpy).toHaveBeenCalled();

        var ModelB = modelBInitializeSpy = jasmine.createSpy('modelBInitializeSpy', function() {
          this.receiver = fw.observable().receive('broadcasterToTestWhenCallback', modelANamespaceName).when(whenSpy = jasmine.createSpy('whenSpy', function(val) {
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
