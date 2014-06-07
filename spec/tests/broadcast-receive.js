'use strict';

describe('Communication', function () {
  var ModelA, ModelB, modelA, modelB;
  
  before(function() {
    ModelA = ko.model({
      namespace: 'ModelA',
      factory: function() {
        this.broadcaster = ko.observable().broadcastAs('broadcaster');
        this.writableBroadcaster = ko.observable().broadcastAs('writableBroadcaster', true);
      }
    });

    ModelB = ko.model({
      namespace: 'ModelB',
      factory: function() {
        this.receiver = ko.observable().receiveFrom('ModelA', 'broadcaster');
        this.writableReceiver = ko.observable().receiveFrom('ModelA', 'writableBroadcaster', true);
        this.nonwritableReceiver = ko.observable().receiveFrom('ModelA', 'broadcaster', true);
      }
    });
    
    modelA = new ModelA();
    modelB = new ModelB();
  });

  it('has ability to create model with an observable that broadcasts', function() {
    expect(ModelA).to.be.a('function');
    expect(modelA.broadcaster).to.be.a('function');
  });

  it('that observable has the correct namespace', function() {
    expect(modelA.namespaceName).to.eql('ModelA');
  });

  it('has ability to create model with an observable that listens', function() {
    expect(ModelB).to.be.a('function');
    expect(modelB.receiver).to.be.a('function');
  });

  it('that observable has the correct namespace', function() {
    expect(modelB.namespaceName).to.eql('ModelB');
  });

  it('modelB receiver() can receive data from the modelA broadcaster()', function() {
    modelA.broadcaster('a-specific-value');
    expect(modelB.receiver()).to.eql('a-specific-value');
  });

  it('modelB can write to writableReceiver() and modelA sees the new data on writableBroadcaster()', function() {
    modelB.writableReceiver('a-different-specific-value');
    expect(modelA.writableBroadcaster()).to.eql('a-different-specific-value');
  });

  it('when modelB writes to nonwritableReceiver() and modelA does not see the data on broadcaster()', function() {
    modelB.nonwritableReceiver('a-different-specific-value-that-should-not-be-seen');
    expect(modelA.broadcaster()).not.to.eql('a-different-specific-value-that-should-not-be-seen');
  });
});