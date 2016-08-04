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

        var person1Data = {
          "firstName": "PersonFirstNameTest",
          "lastName": "PersonLastNameTest",
          "email": "PersonEmailTest"
        };

        var person2Data = {
          "firstName": "PersonFirstNameTest",
          "lastName": "PersonLastNameTest",
          "email": "PersonEmailTest"
        };

        var Person = fw.dataModel.create({
          initialize: expectCallOrder([0, 1], initializeSpy = jasmine.createSpy('initializeSpy', function(person) {
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

        people.set([ person1Data, person2Data ]);

        expect(initializeSpy).toHaveBeenCalled();

        expect(people().length).toBe(2);
        expect(people()[0].firstName()).toBe(person1Data.firstName);
        expect(people()[0].lastName()).toBe(person1Data.lastName);
        expect(people()[0].email()).toBe(person1Data.email);
        expect(people()[1].firstName()).toBe(person2Data.firstName);
        expect(people()[1].lastName()).toBe(person2Data.lastName);
        expect(people()[1].email()).toBe(person2Data.email);

        expect(_.partial(people.set, {})).toThrow();
      });
    });
  }
);
