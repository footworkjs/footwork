define(['footwork', 'lodash', 'jquery'],
  function(fw, _, $) {
    describe('collection', function() {
      var testContainer;

      beforeEach(function() {
        resetCallbackOrder();
        jasmine.addMatchers(customMatchers);
        fixture.setBase('tests/assets/fixtures');
      });
      afterEach(function() {
        fixture.cleanup(testContainer);
      });

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
        expect(people().length).toBe(4);

        people.set([ persons[0], persons[1] ], { remove: false });
        expect(people().length).toBe(4);

        people.set([ persons[0] ]);
        expect(people().length).toBe(1);

        people.set([ persons[0], persons[1] ], { add: false });
        expect(people().length).toBe(1);
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
        expect(people.where({ attributes: { nested: { nested2: { value: 'findme!' } } } }).length).toBe(1);
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

        expect(people.where({ commonTerm: persons[2].commonTerm }).length).toBe(2);
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
    });
  }
);
