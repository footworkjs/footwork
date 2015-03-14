'use strict';

describe('broadcast-receive', function () {
  it('has the ability to create model with an observable that broadcasts', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcaster');
      }
    });
    var modelA = new ModelA();

    expect(ModelA).to.be.a('function');
    expect(modelA.broadcaster).to.be.a('function');
  });

  it('has the ability to create model with an observable that listens', function() {
    var ModelB = fw.viewModel({
      namespace: 'ModelB',
      initialize: function() {
        this.receiver = fw.observable().receiveFrom('ModelA', 'broadcaster');
      }
    });
    var modelB = new ModelB();

    expect(ModelB).to.be.a('function');
    expect(modelB.receiver).to.be.a('function');
  });

  it('has the ability to create model with an observable that broadcasts', function() {
    var ModelA = fw.viewModel({
      namespace: 'ModelA',
      initialize: function() {
        this.broadcaster = fw.observable().broadcastAs('broadcaster');
      }
    });
    var modelA = new ModelA();

    expect(ModelA).to.be.a('function');
    expect(modelA.broadcaster).to.be.a('function');
  });

  it('modelB receiver() can receive data from the modelA broadcaster()', function() {
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

    modelA.broadcaster('a-specific-value');
    expect(modelB.receiver()).to.eql('a-specific-value');
  });

  it('modelB can write to writableReceiver() and modelA sees the new data on writableBroadcaster()', function() {
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

    modelB.writableReceiver('a-different-specific-value');
    expect(modelA.writableBroadcaster()).to.eql('a-different-specific-value');
  });

  it('when modelB tries to write to nonwritableReceiver() modelA does not see the data on nonwritableBroadcaster()', function() {
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

    modelB.nonwritableReceiver('specific-value-that-should-not-be-seen');
    expect(modelA.nonwritableBroadcaster()).not.to.eql('specific-value-that-should-not-be-seen');
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

    modelA.broadcaster('value-that-should-be-visible-from-ModelB');
    expect(modelB.receiver()).to.eql('value-that-should-be-visible-from-ModelB');
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

    modelA.broadcaster('value-that-should-be-visible-from-ModelB-callback');
    expect(valueInsideCallback).to.eql('value-that-should-be-visible-from-ModelB-callback');
  });
});
