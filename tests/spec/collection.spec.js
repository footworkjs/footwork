define(['footwork', 'lodash', 'jquery'],
  function(fw, _, $) {
    describe('collection', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('can be instantiated and correctly set() with some data', function() {
        var initializeSpy;

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function() {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection();

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(people()).lengthToBe(0);

        people.set(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        var personsList = people();
        _.each(persons, function(personData, personIndex) {
          expect(personsList[personIndex].firstName()).toBe(personData.firstName);
          expect(personsList[personIndex].lastName()).toBe(personData.lastName);
          expect(personsList[personIndex].email()).toBe(personData.email);
        });

        expect(_.partial(people.set, {})).toThrow();
      });

      it('can be instantiated and correctly set() with some data and options', function() {
        var initializeSpy;

        var persons = [
          {
            id: 1,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          }, {
            id: 2,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          }, {
            id: 3,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          }, {
            id: 4,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          }
        ];

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length + 3), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection();

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(people()).lengthToBe(0);

        people.set(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        var personsList = people();
        _.each(persons, function(personData, personIndex) {
          expect(personsList[personIndex].firstName()).toBe(personData.firstName);
          expect(personsList[personIndex].lastName()).toBe(personData.lastName);
          expect(personsList[personIndex].email()).toBe(personData.email);
        });

        people.set([ _.extend({}, persons[0], { firstName: 'NOMERGE' }) ], { merge: false });
        expect(people.get(persons[0].id).firstName()).not.toBe('NOMERGE');

        people.set(persons);
        expect(people()).lengthToBe(4);

        people.set([ persons[0], persons[1] ], { remove: false });
        expect(people()).lengthToBe(4);

        people.set([ persons[0] ]);
        expect(people()).lengthToBe(1);

        people.set([ persons[0], persons[1] ], { add: false });
        expect(people()).lengthToBe(1);
      });

      it('can be instantiated with some data', function() {
        var initializeSpy;

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function() {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var people = PeopleCollection(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        var personsList = people();
        _.each(persons, function(personData, personIndex) {
          expect(personsList[personIndex].firstName()).toBe(personData.firstName);
          expect(personsList[personIndex].lastName()).toBe(personData.lastName);
          expect(personsList[personIndex].email()).toBe(personData.email);
        });
      });

      it('can be instantiated with some data and then add()ed onto correctly', function() {
        var initializeSpy;
        var insertTestValue = 'InsertAtTest';
        var insertPosition = 2;

        var persons = [
          {
            firstName: 'PersonFirstNameTest',
            lastName: 'PersonLastNameTest',
            email: 'PersonEmailTest'
          }, {
            firstName: 'PersonFirstNameTest',
            email: 'PersonEmailTest'
          }
        ];

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length + 2), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
            this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var people = PeopleCollection(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        people.addModel(persons[0]);
        expect(people()).lengthToBe(3);

        people.addModel(_.extend(persons[0], { firstName: insertTestValue }), { at: insertPosition });
        expect(people()[insertPosition].firstName()).toBe(insertTestValue);
      });

      it('can have data plucked from its entries', function() {
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function() {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var people = fw.collection(persons);
        expect(people()).lengthToBe(persons.length);

        expect(people.pluck('firstName')).toEqual(_.reduce(persons, function(values, person) {
          values.push(person['firstName']);
          return values;
        }, []));
      });

      it('can find an individual model that matches a set of attributes', function() {
        var initializeSpy;
        var persons = [
          {
            firstName: 'PersonFirstNameTest',
            lastName: 'PersonLastNameTest',
            email: 'PersonEmailTest'
          }, {
            firstName: 'PersonFirstNameTest',
            email: 'PersonEmailTest'
          }
        ];

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length + 2), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
            this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var people = PeopleCollection(persons);

        expect(people()).lengthToBe(persons.length);
        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);

        expect(people.findWhere(persons[0])).toBeAn('object');
        expect(people.findWhere({ shouldNotFind: true })).toBe(null);
      });

      it('can find an item that matches a set of attributes in a complex set of models', function() {
        var persons = [
          {
            firstName: 'PersonFirstNameTest',
            lastName: 'PersonLastNameTest',
            attributes: {
              nested: {
                nested2: {
                  value: 'findme!'
                }
              }
            }
          }, {
            firstName: 'PersonFirstNameTest',
            attributes: {
              nested: {
                nested2: {
                  value: 'donotfindme!'
                }
              }
            }
          }
        ];

        var people = fw.collection(persons);

        expect(people()).lengthToBe(persons.length);
        expect(people.where({ attributes: { nested: { nested2: { value: 'findme!' } } } })).lengthToBe(1);
      });

      it('can find an individual model that matches a regex attribute', function() {
        var initializeSpy;
        var persons = [
          {
            firstName: 'PersonFirstNameTestRegex',
            lastName: 'PersonLastNaFINDMEmeTestRegex',
            email: 'PersonEmailTestRegex'
          }, {
            firstName: 'PersonFirstNameTest',
            email: 'PersonEmailTest'
          }
        ];

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
            this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var people = PeopleCollection(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        expect(people.findWhere({ lastName: /FINDME/ })).toBeAn('object');
        expect(people.findWhere({ lastName: /NOTFINDME/ })).toBe(null);
      });

      it('can find where a set of models matches some data', function() {
        var initializeSpy;
        var persons = [
          {
            firstName: 'PersonFirstNameTest1',
            lastName: 'PersonLastNameTest1',
            email: 'PersonEmailTest1',
            commonTerm: 'common1'
          }, {
            firstName: 'PersonFirstNameTest2',
            lastName: 'PersonLastNameTest2',
            email: 'PersonEmailTest2',
            commonTerm: 'common2'
          }, {
            firstName: 'PersonFirstNameTest3',
            lastName: 'PersonLastNameTest3',
            email: 'PersonEmailTest3',
            commonTerm: 'common1'
          }, {
            firstName: 'PersonFirstNameTest4',
            lastName: 'PersonLastNameTest4',
            email: 'PersonEmailTest4',
            commonTerm: 'common2'
          }
        ];

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
            this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
            this.commonTerm = fw.observable(person.commonTerm).mapTo('commonTerm');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var people = PeopleCollection(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        expect(people.where({ commonTerm: persons[2].commonTerm })).lengthToBe(2);
      });

      it('can create a new model and add it to the collection correctly', function(done) {
        var initializeSpy;
        var ajaxDoneSpy;

        var responseValue = {
          success: true,
          randomValueToFind: randomString()
        };

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function() {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var destUrl = generateUrl();
        $.mockjax({
          responseTime: 5,
          url: destUrl,
          type: 'POST',
          responseText: responseValue
        });
        $.mockjax({
          responseTime: 5,
          url: destUrl,
          type: 'PUT',
          responseText: responseValue
        });

        var Person = fw.dataModel.create({
          url: destUrl,
          initialize: expectCallOrder(_.range(0, persons.length + 2), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        expect(initializeSpy).not.toHaveBeenCalled();

        var people = PeopleCollection(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);

        var createdPersonData = {
          firstName: randomString(),
          lastName: randomString(),
          email: randomString()
        };
        var noWaitCreatedPersonData = {
          firstName: randomString(),
          lastName: randomString(),
          email: randomString()
        };

        expect(people.findWhere(noWaitCreatedPersonData)).toBe(null);

        ajaxDoneSpy = jasmine.createSpy('ajaxDoneSpy', function(response) {
          expect(response).toEqual(responseValue);
        }).and.callThrough();

        people
          .create(noWaitCreatedPersonData)
          .done(ajaxDoneSpy);

        expect(people.findWhere(noWaitCreatedPersonData)).toBeAn('object');

        people
          .create(createdPersonData, { wait: true })
          .done(ajaxDoneSpy);

        expect(people.findWhere(createdPersonData)).toBe(null);

        setTimeout(function() {
          expect(ajaxDoneSpy).toHaveBeenCalledTimes(2);
          expect(people.findWhere(createdPersonData)).toBeAn('object');
          done();
        }, 10);
      });

      it('can initialize and manipulate a plain collection including removal of an item', function() {
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function() {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var people = fw.collection(persons);
        var randomPerson = _.sample(persons);

        expect(people()).lengthToBe(persons.length);
        expect(people.findWhere(randomPerson)).toEqual(randomPerson);

        var removedModels = people.removeModel({ firstName: randomPerson.firstName });

        expect(people.findWhere(randomPerson)).toBe(null);
        expect(removedModels).toEqual([randomPerson]);
      });

      it('can have a dataModel based collection be serialized to a POJO correctly', function() {
        var initializeSpy;
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function() {
          persons.push({
            id: undefined,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection();

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(people()).lengthToBe(0);

        people.set(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);
        expect(people()).lengthToBe(persons.length);
        expect(people.getData()).toEqual(persons);
      });

      it('can correctly trigger change/add/remove events for dataModels in a set() call as appropriate', function() {
        var initializeSpy;
        var peopleData = {
          person1Data: {
            id: 1,
            firstName: 'Person1FirstNameTest',
            lastName: 'Person1LastNameTest',
            email: 'Person1EmailTest'
          },
          person2Data: {
            id: 2,
            firstName: 'Person2FirstNameTest',
            lastName: 'Person2LastNameTest',
            email: 'Person2EmailTest'
          }
        };

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, _.values(peopleData).length + 2), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var unexpectedEvents = {};
        var recordedEvents = {
          'person1Data _.add': 0,
          'person1Data _.change': 0,
          'person1Data _.remove': 0,
          'person2Data _.add': 0,
          'person2Data _.change': 0,
          'person2Data _.remove': 0
        };

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });
        var people = PeopleCollection();

        people.$namespace.subscribe('_.*', function(models, envelope) {
          var dataModels = [].concat(models);
          var collectionEvent = envelope.topic;
          _.each(dataModels, function(dataModel) {
            _.each(peopleData, function(person, varName) {
              var expectedEventKey = varName + ' ' + collectionEvent;
              var fieldNames = _.keys(person);

              if(collectionEvent === '_.add') {
                expect(dataModel.__isDataModel).toBe(true)
              }

              if(_.isEqual(person, _.pick(dataModel.get(), fieldNames))) {
                if(!_.isUndefined(recordedEvents[expectedEventKey])) {
                  recordedEvents[expectedEventKey]++;
                } else {
                  if(_.isUndefined(unexpectedEvents[expectedEventKey])) {
                    unexpectedEvents[expectedEventKey] = 0;
                  }
                  unexpectedEvents[expectedEventKey]++;
                }
              }
            });
          });
        });

        expect(recordedEvents).toEqual({
          'person1Data _.add': 0,
          'person1Data _.change': 0,
          'person1Data _.remove': 0,
          'person2Data _.add': 0,
          'person2Data _.change': 0,
          'person2Data _.remove': 0
        });
        expect(people()).lengthToBe(0);

        people.set(_.values(peopleData));
        expect(recordedEvents).toEqual({
          'person1Data _.add': 1,
          'person1Data _.change': 0,
          'person1Data _.remove': 0,
          'person2Data _.add': 1,
          'person2Data _.change': 0,
          'person2Data _.remove': 0
        });
        expect(people()).lengthToBe(2);

        people.set([ peopleData.person1Data ]);
        expect(recordedEvents).toEqual({
          'person1Data _.add': 1,
          'person1Data _.change': 0,
          'person1Data _.remove': 0,
          'person2Data _.add': 1,
          'person2Data _.change': 0,
          'person2Data _.remove': 1
        });

        _.extend(peopleData.person1Data, { firstName: 'changeTest1' });
        people.set([ peopleData.person1Data, peopleData.person2Data ]);
        expect(recordedEvents).toEqual({
          'person1Data _.add': 1,
          'person1Data _.change': 1,
          'person1Data _.remove': 0,
          'person2Data _.add': 2,
          'person2Data _.change': 0,
          'person2Data _.remove': 1
        });

        peopleData.person1Data = _.omit(peopleData.person1Data, 'id');
        people.set([ peopleData.person1Data, peopleData.person2Data ]);
        expect(recordedEvents).toEqual({
          'person1Data _.add': 2,
          'person1Data _.change': 1,
          'person1Data _.remove': 1,
          'person2Data _.add': 2,
          'person2Data _.change': 0,
          'person2Data _.remove': 1
        });

        expect(_.values(unexpectedEvents)).lengthToBe(0);
      });

      it('can be instantiated and reset() correctly', function() {
        var initializeSpy;
        var resetSpy;
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });
        var randomPerson = _.sample(persons);

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length * 2), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });
        var people = PeopleCollection();

        var resetTriggered = false;
        people.$namespace.subscribe('_.reset', resetSpy = jasmine.createSpy('resetSpy', function(resetData) {
          expect(resetData.newModels).lengthToBe(persons.length);
          expect(resetData.oldModels).lengthToBe(persons.length);
        }).and.callThrough());

        expect(resetSpy).not.toHaveBeenCalled();
        expect(people()).lengthToBe(0);

        people.set(persons);

        expect(people()).lengthToBe(persons.length);

        people.reset(persons);

        expect(resetSpy).toHaveBeenCalled();
        expect(people()).lengthToBe(persons.length);
      });

      it('can correctly fetch() and set data from the server', function(done) {
        var namespaceName = generateNamespaceName();
        var getMockUrl = generateUrl();
        var getOverrideMockUrl = generateUrl();
        var ajaxOptionsSpy;
        var changeEventSpy;
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        $.mockjax({
          responseTime: 5,
          url: getMockUrl,
          type: 'GET',
          responseText: persons
        });

        $.mockjax({
          responseTime: 5,
          url: getOverrideMockUrl,
          type: 'GET',
          responseText: persons
        });

        var PeopleCollection = fw.collection.create({
          namespace: namespaceName,
          url: getMockUrl,
        });
        var people = PeopleCollection();
        var PeopleCollectionAjaxOptions = fw.collection.create({
          namespace: namespaceName,
          url: '/invalid',
          ajaxOptions: expectCallOrder(0, ajaxOptionsSpy = jasmine.createSpy('ajaxOptionsSpy', function() {
            return {
              url: getOverrideMockUrl
            };
          }).and.callThrough())
        });
        var peopleAjaxOptions = PeopleCollectionAjaxOptions();

        var changeEventCalled = false;
        fw.namespace(namespaceName).subscribe('_.change', expectCallOrder([1, 2], changeEventSpy = jasmine.createSpy('changeEventSpy', function(changeData) {
          expect(changeData).toBeAn('object');
          expect(changeData.touched).lengthToBe(persons.length);
          expect(changeData.serverResponse).toEqual(persons);
          expect(changeData.options).toEqual({ parse: true });
        })));

        var fetchResult = people.fetch();
        expect(fetchResult).toBeAn('object');
        expect((fetchResult.done || fetchResult.then)).toBeA('function');

        peopleAjaxOptions.fetch();

        expect(changeEventSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          expect(changeEventSpy).toHaveBeenCalled();
          expect(people()).lengthToBe(persons.length);
          expect(people()[0].firstName).toBe(persons[0].firstName);

          expect(peopleAjaxOptions()).lengthToBe(persons.length);
          expect(peopleAjaxOptions()[0].firstName).toBe(persons[0].firstName);

          done();
        }, 40);
      });

      it('can correctly fetch(), parse and set data from the server', function(done) {
        var mockUrl = generateUrl();
        var parseSpy;
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        $.mockjax({
          responseTime: 5,
          url: mockUrl,
          type: 'GET',
          responseText: persons
        });

        var PeopleCollection = fw.collection.create({
          url: mockUrl,
          parse: expectCallOrder(0, parseSpy = jasmine.createSpy('parseSpy', function(people) {
            return _.map(people, function(person) {
              person.flag = true;
              return person;
            });
          }).and.callThrough())
        });

        var people = PeopleCollection();

        expect(people.fetch()).toBeA('promise');
        expect(people()).lengthToBe(0);
        expect(parseSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          expect(parseSpy).toHaveBeenCalled();
          expect(people()).lengthToBe(persons.length);
          expect(_.sample(people()).flag).toBe(true);

          done();
        }, 40);
      });

      it('can correctly fetch() and reset data from the server', function(done) {
        var mockUrl = generateUrl();
        var initializeSpy;
        var resetSpy;
        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        $.mockjax({
          responseTime: 5,
          url: mockUrl,
          type: 'GET',
          responseText: persons
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          url: mockUrl,
          dataModel: Person
        });

        var people = PeopleCollection();

        people.$namespace.subscribe('_.reset', expectCallOrder(persons.length, resetSpy = jasmine.createSpy('resetSpy', function(resetData) {
          expect(resetData).toBeAn('object');
          expect(resetData.oldModels).toBeAn('array');
          expect(resetData.newModels).toBeAn('array');
        })));

        expect(people.fetch({ reset: true })).toBeA('promise');
        expect(initializeSpy).not.toHaveBeenCalled();
        expect(resetSpy).not.toHaveBeenCalled();
        expect(people()).lengthToBe(0);

        setTimeout(function() {
          expect(initializeSpy).toHaveBeenCalled();
          expect(resetSpy).toHaveBeenCalled();
          expect(people()).lengthToBe(persons.length);
          expect(people()[0].firstName()).toBe(persons[0].firstName);

          done();
        }, 40);
      });

      it('can .push() correctly', function() {
        var initializeSpy;
        var addSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });
        var people = PeopleCollection();

        var addTriggered = false;
        people.$namespace.subscribe('_.add', expectCallOrder(1, addSpy = jasmine.createSpy('addSpy', function(dataModels) {
          _.each(dataModels, function(dataModel) {
            expect(dataModel.__isDataModel).toBe(true)
          });
        })));

        expect(addSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        people.push({});

        expect(addSpy).toHaveBeenCalled();
        expect(initializeSpy).toHaveBeenCalled();
        expect(people()[0].__isDataModel).toBe(true);
      });

      it('can .unshift() correctly', function() {
        var initializeSpy;
        var addSpy;

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(0, initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });
        var people = PeopleCollection();

        var addTriggered = false;
        people.$namespace.subscribe('_.add', expectCallOrder(1, addSpy = jasmine.createSpy('addSpy', function(dataModels) {
          _.each(dataModels, function(dataModel) {
            expect(dataModel.__isDataModel).toBe(true)
          });
        }).and.callThrough()));

        expect(addSpy).not.toHaveBeenCalled();
        expect(initializeSpy).not.toHaveBeenCalled();

        people.unshift({});

        expect(addSpy).toHaveBeenCalled();
        expect(initializeSpy).toHaveBeenCalled();
        expect(people()[0].__isDataModel).toBe(true);
      });

      it('.remove() correctly triggers _.remove event', function() {
        var initializeSpy;
        var removeSpy = jasmine.createSpy('removeSpy');

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection(persons);
        people.$namespace.subscribe('_.remove', expectCallOrder(persons.length, removeSpy));

        expect(removeSpy).not.toHaveBeenCalled();

        people.remove(people()[0]);

        expect(removeSpy).toHaveBeenCalled();
      });

      it('.removeAll() correctly triggers _.remove event', function() {
        var initializeSpy;
        var removeSpy = jasmine.createSpy('removeSpy');

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection(persons);
        people.$namespace.subscribe('_.remove', expectCallOrder(persons.length, removeSpy));

        expect(removeSpy).not.toHaveBeenCalled();

        people.removeAll(people()[0]);

        expect(removeSpy).toHaveBeenCalled();
      });

      it('.pop() correctly triggers _.remove event', function() {
        var initializeSpy;
        var removeSpy = jasmine.createSpy('removeSpy');

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection(persons);
        people.$namespace.subscribe('_.remove', expectCallOrder(persons.length, removeSpy));

        expect(removeSpy).not.toHaveBeenCalled();

        expect(people.pop().get()).toEqual(persons[persons.length - 1]);

        expect(removeSpy).toHaveBeenCalled();
      });

      it('.shift() correctly triggers _.remove event', function() {
        var initializeSpy;
        var removeSpy = jasmine.createSpy('removeSpy');

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection(persons);
        people.$namespace.subscribe('_.remove', expectCallOrder(persons.length, removeSpy));

        expect(removeSpy).not.toHaveBeenCalled();

        expect(people.shift().get()).toEqual(persons[0]);

        expect(removeSpy).toHaveBeenCalled();
      });

      it('.splice() correctly triggers _.remove event', function() {
        var initializeSpy;
        var removeSpy = jasmine.createSpy('removeSpy');

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });

        var people = PeopleCollection(persons);
        people.$namespace.subscribe('_.remove', expectCallOrder(persons.length, removeSpy));

        expect(removeSpy).not.toHaveBeenCalled();

        var peoples = people.splice(1, 2);
        expect([
          peoples[0].get(),
          peoples[1].get()
        ]).toEqual([
          persons[1],
          persons[2]
        ]);

        expect(removeSpy).toHaveBeenCalled();
      });

      it('disposes dataModels correctly when removed', function() {
        var initializeSpy;

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person
        });
        var people = PeopleCollection(persons);

        expect(people()).lengthToBe(persons.length);
        expect(people()[0]._isDisposed).toBe(undefined);

        var personRemoved = people.remove(people()[0])[0];

        expect(personRemoved._isDisposed).toBe(true);
        expect(personRemoved.get()).toEqual(persons[0]);
        expect(people()).lengthToBe(persons.length - 1);
      });

      it('can be configured to not dispose of dataModels when removed', function() {
        var initializeSpy;

        var persons = [];
        _.each(_.range(0, _.random(5, 10)), function(id) {
          persons.push({
            id: id,
            firstName: randomString(),
            lastName: randomString(),
            email: randomString()
          });
        });

        var Person = fw.dataModel.create({
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          dataModel: Person,
          disposeOnRemove: false
        });
        var people = PeopleCollection(persons);

        expect(people()).lengthToBe(persons.length);
        expect(people()[0]._isDisposed).toBe(undefined);

        var personRemoved = people.remove(people()[0])[0];

        expect(personRemoved._isDisposed).not.toBe(true);
        expect(personRemoved.get()).toEqual(persons[0]);
        expect(people()).lengthToBe(persons.length - 1);
      });
    });
  }
);
