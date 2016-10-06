define(['footwork', 'lodash', 'jquery', 'tools', 'fetch-mock'],
  function(fw, _, $, tools, fetchMock) {
    describe('namespace', function() {
      beforeEach(tools.prepareTestEnv);
      afterEach(tools.cleanTestEnv);

      it('has the ability to create a namespace', function() {
        var namespace = fw.namespace('testNamespaceCreation');
        expect(namespace).toBeAn('object');
        expect(namespace.publish).toBeA('function');
        expect(namespace.subscribe).toBeA('function');
        expect(namespace.channel).toBe('testNamespaceCreation');
      });

      it('can create a namespace which we can then use to .getName()', function() {
        var namespaceName = tools.generateNamespaceName();
        var namespace = fw.namespace(namespaceName);
        expect(namespace.getName()).toBe(namespaceName);
      });

      it('has basic pub/sub capability', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var testValue = tools.randomString();
        var subscriptionCallbackSpy;

        namespace.subscribe('testMessageTopic', tools.expectCallOrder(0, subscriptionCallbackSpy = jasmine.createSpy('subscriptionCallbackSpy', function(value) {
          expect(value).toBe(testValue);
        })));

        expect(subscriptionCallbackSpy).not.toHaveBeenCalled();
        namespace.publish('testMessageTopic', testValue);
        expect(subscriptionCallbackSpy).toHaveBeenCalled();
      });

      it('can unsubscribe from a subscription', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var subscriptionCallbackSpy = jasmine.createSpy('subscriptionCallbackSpy');

        var subscription = namespace.subscribe('testMessageTopic', tools.expectCallOrder(0, subscriptionCallbackSpy));

        expect(subscriptionCallbackSpy).not.toHaveBeenCalled();

        namespace.publish('testMessageTopic');
        expect(subscriptionCallbackSpy).toHaveBeenCalledTimes(1);

        namespace.unsubscribe(subscription);
        namespace.publish('testMessageTopic');
        expect(subscriptionCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('has basic pub/sub capability between different instances on the same namespace', function() {
        var namespaceName = tools.generateNamespaceName();
        var namespace1 = fw.namespace(namespaceName);
        var namespace2 = fw.namespace(namespaceName);
        var subscriptionCallbackSpy;
        var testValue = tools.randomString();

        namespace1.subscribe('testMessageTopic', tools.expectCallOrder(0, subscriptionCallbackSpy = jasmine.createSpy('', function(parameter) {
          expect(parameter).toBe(testValue);
        }).and.callThrough()));

        expect(subscriptionCallbackSpy).not.toHaveBeenCalled();

        namespace2.publish('testMessageTopic', testValue);

        expect(subscriptionCallbackSpy).toHaveBeenCalled();
      });

      it('can trigger and listen to events', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;

        namespace.event.handler('testEvent', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('', function(parameter) {
          expect(parameter).toBe('optionalParam');
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();
        namespace.trigger('testEvent', 'optionalParam');
        expect(handlerCallbackSpy).toHaveBeenCalled();
      });

      it('can unregister a handler from an event', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;

        var eventHandlerCallbackSub = namespace.event.handler('testUnregisterEvent', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function(parameter) {
          expect(parameter).toBe('optionalParam');
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();

        namespace.trigger('testUnregisterEvent', 'optionalParam');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);

        namespace.event.unregister(eventHandlerCallbackSub);
        namespace.trigger('testUnregisterEvent', 'optionalParam');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('can trigger, respond, and listen to requests', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;

        namespace.request.handler('testRequest', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function(parameter) {
          expect(parameter).toBe('optionalParam');
          return 'all-ok';
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();
        expect(namespace.request('testRequest', 'optionalParam')).toBe('all-ok');
        expect(handlerCallbackSpy).toHaveBeenCalled();
      });

      it('can unregister handler for request', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;
        var responseValue = 'all-ok';

        var requestHandler = namespace.request.handler('testUnregisteredRequest', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function(parameter) {
          expect(parameter).toBe('optionalParam');
          return responseValue;
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();
        expect(namespace.request('testUnregisteredRequest', 'optionalParam')).toBe(responseValue);
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);

        namespace.request.unregister(requestHandler);

        expect(namespace.request('testUnregisteredRequest', 'optionalParam')).toBe(undefined);
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('can make requests and listen to multiple responses', function() {
        var namespaceName = tools.generateNamespaceName();
        var namespaces = _.map([1,2,3], function() {
          return fw.namespace(namespaceName);
        });

        var handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function(parameter) {
          expect(parameter).toBe('optionalParam');
          return 'all-ok';
        }).and.callThrough();

        _.each(namespaces, function(namespace, indexNumber) {
          namespace.request.handler('testMultipleRequest', tools.expectCallOrder(indexNumber, handlerCallbackSpy));
        });

        var namespace = fw.namespace(namespaceName);
        expect(namespace.request('testMultipleRequest', 'optionalParam', true)).toEqual(['all-ok', 'all-ok', 'all-ok']);
      });

      it('can trigger and listen to commands', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;

        namespace.command.handler('testCommand', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function(parameter) {
          expect(parameter).toBe('optionalParam');
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();
        namespace.command('testCommand', 'optionalParam');
        expect(handlerCallbackSpy).toHaveBeenCalled();
      });

      it('can unregister handler for commands', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;

        var requestHandler = namespace.command.handler('testUnregisteredCommand', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function(parameter) {
          expect(parameter).toBe('optionalParam');
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();
        namespace.command('testUnregisteredCommand', 'optionalParam');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);

        namespace.command.unregister(requestHandler);

        namespace.command('testUnregisteredCommand', 'optionalParam');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('can unregister subscription handlers when namespace is disposed', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy');

        namespace.subscribe('testDispose', tools.expectCallOrder(0, handlerCallbackSpy));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();

        namespace.publish('testDispose');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
        namespace.dispose();

        namespace.publish('testDispose');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('can unregister event handlers when namespace is disposed', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy');

        namespace.event.handler('testDispose', tools.expectCallOrder(0, handlerCallbackSpy));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();

        namespace.trigger('testDispose');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
        namespace.dispose();

        namespace.trigger('testDispose');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('can unregister command handlers when namespace is disposed', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy');

        namespace.command.handler('testDispose', tools.expectCallOrder(0, handlerCallbackSpy));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();

        namespace.command('testDispose');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
        namespace.dispose();

        namespace.command('testDispose');
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });

      it('can unregister request handlers when namespace is disposed', function() {
        var namespace = fw.namespace(tools.generateNamespaceName());
        var handlerCallbackSpy;
        var testValue = tools.randomString();

        namespace.request.handler('testDispose', tools.expectCallOrder(0, handlerCallbackSpy = jasmine.createSpy('handlerCallbackSpy', function() {
          return testValue;
        }).and.callThrough()));

        expect(handlerCallbackSpy).not.toHaveBeenCalled();

        expect(namespace.request('testDispose')).toBe(testValue);
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
        namespace.dispose();

        expect(namespace.request('testDispose')).not.toBe(testValue);
        expect(handlerCallbackSpy).toHaveBeenCalledTimes(1);
      });
    });
  }
);
