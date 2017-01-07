define(['footwork', 'lodash', 'fetch-mock'],
  function(fw, _, fetchMock) {
    describe('collection', function() {
      beforeEach(prepareTestEnv);
      afterEach(cleanTestEnv);

      it('can have data plucked from its entries', function() {
        var persons = [];
        _.each(_.range(1, 8), function() {
          persons.push({
            firstName: _.uniqueId('random'),
            lastName: _.uniqueId('random'),
            email: _.uniqueId('random')
          });
        });

        var people = fw.collection(persons);
        expect(people()).lengthToBe(persons.length);

        expect(people.pluck('firstName', this)).toEqual(_.reduce(persons, function(values, person) {
          values.push(person['firstName']);
          return values;
        }, []));
      });

      it('can find an individual model that matches a set of attributes', function() {
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

        var people = fw.collection(persons);

        expect(people()).lengthToBe(persons.length);

        expect(people.findWhere(persons[0])).toBeAn('object');
        expect(people.findWhere({ shouldNotFind: true })).toBe(null);
      });

      it('can find an item that matches a set of attributes in a complex set of models', function() {
        var valueToFind = _.uniqueId('random');
        var persons = [
          {
            firstName: 'PersonFirstNameTest',
            lastName: 'PersonLastNameTest',
            attributes: {
              nested: {
                nested2: {
                  value: valueToFind
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
        expect(people.where({ attributes: { nested: { nested2: { value: valueToFind } } } })).lengthToBe(1);
      });

      it('can get an individual model that matches an id', function() {
        var persons = [
          {
            firstName: _.uniqueId('random'),
            email: _.uniqueId('random'),
            id: 199
          }, {
            firstName: _.uniqueId('random'),
            email: _.uniqueId('random'),
            id: 200
          }, {
            firstName: _.uniqueId('random'),
            email: _.uniqueId('random'),
            id: 201
          }, {
            firstName: _.uniqueId('random'),
            email: _.uniqueId('random'),
            id: 202
          }
        ];

        var people = fw.collection(persons);

        expect(people()).lengthToBe(persons.length);
        expect(people.findWhere({ id: persons[2].id })).toEqual(persons[2]);
      });

      it('can find an individual model that matches a regex attribute', function() {
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

        var people = fw.collection(persons);

        expect(people()).lengthToBe(persons.length);

        expect(people.findWhere({ lastName: /FINDME/ })).toBeAn('object');
        expect(people.findWhere({ lastName: /NOTFINDME/ })).toBe(null);
      });

      it('can find where a set of models matches some data', function() {
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

        var people = fw.collection(persons);

        expect(people()).lengthToBe(persons.length);
        expect(people.where({ commonTerm: persons[2].commonTerm })).lengthToBe(2);
      });

      it('can be serialized into JSON correctly', function() {
        var persons = [];
        _.each(_.range(1, 8), function() {
          persons.push({
            firstName: _.uniqueId('random'),
            lastName: _.uniqueId('random'),
            email: _.uniqueId('random')
          });
        });

        var people = fw.collection(persons);

        expect(JSON.stringify(people)).toEqual(JSON.stringify(persons));
      });

      it('can correctly fetch() and set data from the server', function(done) {
        var namespaceName = generateNamespaceName();
        var getMockUrl = generateUrl();
        var getOverrideMockUrl = generateUrl();
        var fetchOptionsSpy;
        var getCallbackUrl = generateUrl();
        var peopleUrlCallbackSpy = jasmine.createSpy('peopleUrlCallbackSpy', function() {
          return getCallbackUrl;
        }).and.callThrough;
        var persons = [];
        _.each(_.range(1, 8), function(id) {
          persons.push({
            firstName: _.uniqueId('random'),
            lastName: _.uniqueId('random'),
            email: _.uniqueId('random')
          });
        });

        var people = fw.collection({
          url: getMockUrl
        });
        var peopleFromCallbackUrl = fw.collection({
          url: peopleUrlCallbackSpy
        });
        var peopleAjaxOptions = fw.collection({
          url: getOverrideMockUrl,
          fetchOptions: fetchOptionsSpy = jasmine.createSpy('fetchOptionsSpy', function() {
            return {
              method: 'post'
            };
          }).and.callThrough()
        });

        fetchMock.restore().get(getMockUrl, persons);
        expect(people.fetch()).toBeA('promise');
        expect(people.requestInProgress()).toBe(true);

        fetchMock.restore().get(getCallbackUrl, persons);
        peopleFromCallbackUrl.fetch();

        fetchMock.restore().post(getOverrideMockUrl, persons);
        peopleAjaxOptions.fetch();

        setTimeout(function() {
          expect(people.requestInProgress()).toBe(false);

          expect(people()).lengthToBe(persons.length);
          expect(people()[0].firstName).toBe(persons[0].firstName);

          expect(peopleFromCallbackUrl()).lengthToBe(persons.length);
          expect(peopleFromCallbackUrl()[0].firstName).toBe(persons[0].firstName);

          expect(peopleAjaxOptions()).lengthToBe(persons.length);
          expect(peopleAjaxOptions()[0].firstName).toBe(persons[0].firstName);

          done();
        }, 100);
      });

      it('can correctly fetch(), parse and set data from the server', function(done) {
        var mockUrl = generateUrl();
        var parseSpy;
        var persons = [];
        _.each(_.range(1, 8), function(id) {
          persons.push({
            firstName: _.uniqueId('random'),
            lastName: _.uniqueId('random'),
            email: _.uniqueId('random')
          });
        });

        var people = fw.collection({
          url: mockUrl,
          parse: parseSpy = jasmine.createSpy('parseSpy', function(people) {
            return _.map(people, function(person) {
              person.flag = true;
              return person;
            });
          }).and.callThrough()
        });

        fetchMock.restore().get(mockUrl, persons);
        expect(people.fetch()).toBeA('promise');
        expect(people()).lengthToBe(0);
        expect(parseSpy).not.toHaveBeenCalled();

        setTimeout(function() {
          expect(parseSpy).toHaveBeenCalled();
          expect(people()).lengthToBe(persons.length);
          expect(_.sample(people()).flag).toBe(true);

          done();
        }, 100);
      });
    });
  }
);
