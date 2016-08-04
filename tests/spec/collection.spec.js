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

        var numPersons = _.random(5, 10);
        var persons = [];
        _.each(_.range(0, numPersons), function() {
          persons.push({
            "firstName": randomString(20),
            "lastName": randomString(20),
            "email": randomString(20)
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
        expect(people().length).toBe(0);

        people.set(persons);

        expect(initializeSpy).toHaveBeenCalledTimes(persons.length);

        expect(people().length).toBe(persons.length);

        _.each(persons, function(personData, personIndex) {
          expect(people()[personIndex].firstName()).toBe(personData.firstName);
          expect(people()[personIndex].lastName()).toBe(personData.lastName);
          expect(people()[personIndex].email()).toBe(personData.email);
        });

        expect(_.partial(people.set, {})).toThrow();
      });
    });
  }
);
