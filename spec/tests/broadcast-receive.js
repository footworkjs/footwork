'use strict';

describe('broadcast-receive', function () {
  it('has the ability to create model with a broadcastable', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcaster');
      }
    });
    var modelA = new ModelA();

    expect(ModelA).to.be.a('function');
    expect(fw.isBroadcastable(modelA.broadcaster)).to.be(true);
  });

  it('has the ability to create model with a receivable', function() {
    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.receiver = fw.observable().receiveFrom('ModelA', 'broadcaster');
      }
    });
    var modelB = new ModelB();

    expect(ModelB).to.be.a('function');
    expect(fw.isReceivable(modelB.receiver)).to.be(true);
  });

  it('modelB receivable can receive data from the modelA broadcastable', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcaster');
      }
    });
    var modelA = new ModelA();

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.receiver = fw.observable().receiveFrom('ModelA', 'broadcaster');
      }
    });
    var modelB = new ModelB();

    var testValue = 'a-specific-value';
    modelA.broadcaster(testValue);
    expect(modelB.receiver()).to.eql(testValue);
  });

  it('can have receivable created with a passed in instantiated namespace', function() {
    var namespace = fw.namespace('receivableInstantiatedNamespace');
    var receivable = fw.observable(null).receiveFrom(namespace, 'broadcaster');

    expect(receivable()).to.be(null);

    var broadcastable = fw.observable('testValue').broadcastAs({ name: 'broadcaster', namespace: namespace });

    expect(receivable()).to.be(broadcastable());
  });

  it('can have standalone broadcastable created with alternative syntax', function() {
    var receivable = fw.observable(null).receiveFrom('alternativeSyntaxTestNamespace', 'broadcaster');

    expect(receivable()).to.be(null);

    var broadcastable = fw.observable('testValue').broadcastAs({ name: 'broadcaster', namespace: 'alternativeSyntaxTestNamespace' });

    expect(receivable()).to.be(broadcastable());
  });

  it('can have standalone broadcastable created with alternative syntax and a passed in instantiated namespace', function() {
    var namespace = fw.namespace('alternativeSyntaxTestNamespaceInstance');
    var receivable = fw.observable(null).receiveFrom('alternativeSyntaxTestNamespaceInstance', 'broadcaster');

    expect(receivable()).to.be(null);

    var broadcastable = fw.observable('testValue').broadcastAs({ name: 'broadcaster', namespace: namespace });

    expect(receivable()).to.be(broadcastable());
  });

  it('modelB can write to a receivable and modelA sees the new data on a writable broadcastable', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.writableBroadcaster = fw.observable().broadcastAs('writableBroadcaster', true);
      }
    });
    var modelA = new ModelA();

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.writableReceiver = fw.observable().receiveFrom('ModelA', 'writableBroadcaster', true);
      }
    });
    var modelB = new ModelB();

    var testValue = 'a-different-specific-value';
    modelB.writableReceiver(testValue);
    expect(modelA.writableBroadcaster()).to.eql(testValue);
  });

  it('when modelB tries to write to receivable modelA does not see the data on a non-writable broadcastable and the receivable is not set to the new value', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.nonwritableBroadcaster = fw.observable().broadcastAs('nonwritableBroadcaster');
      }
    });
    var modelA = new ModelA();

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.nonwritableReceiver = fw.observable().receiveFrom('ModelA', 'nonwritableBroadcaster', true);
      }
    });
    var modelB = new ModelB();

    var testValue = 'specific-value-that-should-not-be-seen';
    modelB.nonwritableReceiver(testValue);
    expect(modelB.nonwritableReceiver()).not.to.eql(testValue);
    expect(modelA.nonwritableBroadcaster()).not.to.eql(testValue);
  });

  it('receivable with .when() specified writes when callback returns true', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback');
      }
    });
    var modelA = new ModelA();

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.receiver = fw.observable().receiveFrom('ModelA', 'broadcasterToTestWhenCallback').when(function() { return true; });
      }
    });
    var modelB = new ModelB();

    var testValue = 'value-that-should-be-visible-from-ModelB';
    modelA.broadcaster(testValue);
    expect(modelB.receiver()).to.eql(testValue);
  });

  it('receivable with .when() specified does NOT write when callback returns false', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback');
      }
    });
    var modelA = new ModelA();

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.receiver = fw.observable().receiveFrom('ModelA', 'broadcasterToTestWhenCallback').when(function() { return false; });
      }
    });
    var modelB = new ModelB();

    modelA.broadcaster('value-that-should-NOT-be-visible-from-ModelB');
    expect(modelB.receiver()).to.eql(undefined);
  });

  it('receivable with .when() sees correct value passed to it in the callback', function() {
    var valueInsideCallback = null;

    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcasterToTestWhenCallback');
      }
    });
    var modelA = new ModelA();

    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.receiver = fw.observable().receiveFrom('ModelA', 'broadcasterToTestWhenCallback').when(function(val) { valueInsideCallback = val; });
      }
    });
    var modelB = new ModelB();

    var testValue = 'value-that-should-be-visible-from-ModelB-callback';
    modelA.broadcaster(testValue);
    expect(valueInsideCallback).to.eql(testValue);
  });
});
