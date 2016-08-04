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
            "firstName": randomString(),
            "lastName": randomString(),
            "email": randomString()
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
          namespace: 'People',
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

      xit('can be instantiated and correctly set() with some data and options', function() {
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
          initialize: expectCallOrder(_.range(0, persons.length), initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
            person = person || {};
            this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
            this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
            this.email = fw.observable(person.email || null).mapTo('email');
          }).and.callThrough())
        });

        var PeopleCollection = fw.collection.create({
          namespace: 'People',
          dataModel: Person
        });

        var people = PeopleCollection();

        expect(initializeSpy).not.toHaveBeenCalled();
        expect(people().length).toBe(0);

        people.set(persons);

        expect(people()).lengthToBe(4);
        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);

        expect(people().length).toBe(persons.length);

        var personsList = people();
        _.each(persons, function(personData, personIndex) {
          expect(personsList[personIndex].firstName()).toBe(personData.firstName);
          expect(personsList[personIndex].lastName()).toBe(personData.lastName);
          expect(personsList[personIndex].email()).toBe(personData.email);
        });

        expect(_.partial(people.set, {})).toThrow();
      });
    });
  }
);
