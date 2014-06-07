'use strict';

describe('Communication', function () {
  var ModelA, ModelB, modelA, modelB;

  it('can create a model that has the correctly defined namespace', function() {
    ModelA = ko.model({
      namespace: 'ModelA'
    });
    modelA = new ModelA();

    expect(modelA.namespaceName).to.eql('ModelA');
  });

  it('has the ability to create model with an observable that broadcasts', function() {
    ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.broadcaster = ko.observable().broadcastAs('broadcaster');
      }
    });
    modelA = new ModelA();

    expect(ModelA).to.be.a('function');
    expect(modelA.broadcaster).to.be.a('function');
  });

  it('has the ability to create model with an observable that listens', function() {
    ModelB = ko.model({
      namespace: 'ModelB',
      factory: function() {
        this.receiver = ko.observable().receiveFrom('ModelA', 'broadcaster');
      }
    });
    modelB = new ModelB();

    expect(ModelB).to.be.a('function');
    expect(modelB.receiver).to.be.a('function');
  });

  it('has the ability to create model with an observable that broadcasts', function() {
    ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.broadcaster = ko.observable().broadcastAs('broadcaster');
      }
    });
    modelA = new ModelA();

    expect(ModelA).to.be.a('function');
    expect(modelA.broadcaster).to.be.a('function');
  });

  it('modelB receiver() can receive data from the modelA broadcaster()', function() {
    ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.broadcaster = ko.observable().broadcastAs('broadcaster');
      }
    });
    modelA = new ModelA();

    ModelB = ko.model({
      namespace: 'ModelB',
      factory: function() {
        this.receiver = ko.observable().receiveFrom('ModelA', 'broadcaster');
      }
    });
    modelB = new ModelB();

    modelA.broadcaster('a-specific-value');
    expect(modelB.receiver()).to.eql('a-specific-value');
  });

  it('modelB can write to writableReceiver() and modelA sees the new data on writableBroadcaster()', function() {
    ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.writableBroadcaster = ko.observable().broadcastAs('writableBroadcaster', true);
      }
    });
    modelA = new ModelA();

    ModelB = ko.model({
      namespace: 'ModelB',
      factory: function() {
        this.writableReceiver = ko.observable().receiveFrom('ModelA', 'writableBroadcaster', true);
      }
    });
    modelB = new ModelB();

    modelB.writableReceiver('a-different-specific-value');
    expect(modelA.writableBroadcaster()).to.eql('a-different-specific-value');
  });

  it('when modelB writes to nonwritableReceiver() and modelA does not see the data on broadcaster()', function() {
    ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.broadcaster = ko.observable().broadcastAs('broadcaster');
      }
    });
    modelA = new ModelA();

    ModelB = ko.model({
      namespace: 'ModelB',
      factory: function() {
        this.nonwritableReceiver = ko.observable().receiveFrom('ModelA', 'broadcaster', true);
      }
    });
    modelB = new ModelB();
    
    modelB.nonwritableReceiver('a-different-specific-value-that-should-not-be-seen');
    expect(modelA.broadcaster()).not.to.eql('a-different-specific-value-that-should-not-be-seen');
  });
});