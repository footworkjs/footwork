'use strict';

describe('namespace', function () {
  it('has the ability to create a namespace', function() {
    var namespace = fw.namespace('testNamespaceCreation');
    expect(namespace).to.be.an('object');
    expect(namespace.publish).to.be.a('function');
    expect(namespace.subscribe).to.be.a('function');
    expect(namespace.channel).to.eql('testNamespaceCreation');
  });

  it('has basic pub/sub capability', function() {
    var namespace = fw.namespace('basicSubscription');
    var subscriptionWorks = false;

    namespace.subscribe('testMessageTopic', function() {
      subscriptionWorks = true;
    });

    expect(subscriptionWorks).to.be(false);
    namespace.publish('testMessageTopic');
    expect(subscriptionWorks).to.be(true);
  });

  it('can unsubscribe from a subscription', function() {
    var namespace = fw.namespace('basicSubscription');
    var subscriptionWorks = false;

    var subscription = namespace.subscribe('testMessageTopic', function() {
      subscriptionWorks = true;
    });

    expect(subscriptionWorks).to.be(false);
    namespace.unsubscribe(subscription);
    namespace.publish('testMessageTopic');
    expect(subscriptionWorks).to.be(false);
  });

  it('has basic pub/sub capability between different objects', function() {
    var namespace1 = fw.namespace('basicSubscriptionDifferentObjects');
    var namespace2 = fw.namespace('basicSubscriptionDifferentObjects');
    var subscriptionWorks = false;

    namespace1.subscribe('testMessageTopic', function(parameter) {
      expect(parameter).to.be('optionalParam');
      subscriptionWorks = true;
    });

    expect(subscriptionWorks).to.be(false);
    namespace2.publish('testMessageTopic', 'optionalParam');
    expect(subscriptionWorks).to.be(true);
  });

  it('can trigger and listen to events', function() {
    var namespace = fw.namespace('eventTest');
    var eventTriggerWorks = false;

    namespace.event.handler('testEvent', function(parameter) {
      expect(parameter).to.be('optionalParam');
      eventTriggerWorks = true;
    });

    expect(eventTriggerWorks).to.be(false);
    namespace.trigger('testEvent', 'optionalParam');
    expect(eventTriggerWorks).to.be(true);
  });

  it('can unregister a handler from an event', function() {
    var namespace = fw.namespace('eventUnregisterTest');
    var eventTriggered = false;

    var eventHandlerCallbackSub = namespace.event.handler('testUnregisterEvent', function(parameter) {
      expect(parameter).to.be('optionalParam');
      eventTriggered = true;
    });

    expect(eventTriggered).to.be(false);
    namespace.event.unregister( eventHandlerCallbackSub );
    namespace.trigger('testUnregisterEvent', 'optionalParam');
    expect(eventTriggered).to.be(false);
  });

  it('can trigger, respond, and listen to requests', function() {
    var namespace = fw.namespace('requestTest');

    namespace.request.handler('testRequest', function(parameter) {
      expect(parameter).to.be('optionalParam');
      return 'all-ok';
    });

    expect(namespace.request('testRequest', 'optionalParam')).to.be('all-ok');
  });

  it('can unsubscribe handler for request', function() {
    var namespace = fw.namespace('requestUnregisterTest');

    var requestHandler = namespace.request.handler('testUnregisteredRequest', function(parameter) {
      expect(parameter).to.be('optionalParam');
      return 'all-ok';
    });

    namespace.request.unregister(requestHandler);

    expect(namespace.request('testRequest', 'optionalParam')).to.be(undefined);
  });

  it('can make requests and listen to multiple responses', function() {
    var namespaces = _.map([1,2,3], function() { return fw.namespace('requestMultipleTest'); });

    _.each(namespaces, function(namespace) {
      namespace.request.handler('testMultipleRequest', function(parameter) {
        expect(parameter).to.be('optionalParam');
        return 'all-ok';
      });
    });

    var namespace = fw.namespace('requestMultipleTest');
    expect( namespace.request('testMultipleRequest', 'optionalParam', true) ).to.eql( ['all-ok', 'all-ok', 'all-ok'] );
  });
});
