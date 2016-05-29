'use strict';

var sandbox = document.getElementById('sandbox');

describe('collection', function () {
  it('can be instantiated and correctly set() with some data', function() {
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
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });
    var people = PeopleCollection();

    expect(people().length).to.be(0);

    people.set([ person1Data, person2Data ]);

    expect(people().length).to.be(2);
    expect(people()[0].firstName()).to.be(person1Data.firstName);
    expect(people()[0].lastName()).to.be(person1Data.lastName);
    expect(people()[0].email()).to.be(person1Data.email);
    expect(people()[1].firstName()).to.be(person2Data.firstName);
    expect(people()[1].lastName()).to.be(person2Data.lastName);
    expect(people()[1].email()).to.be(person2Data.email);

    var foundError = false;
    try {
      people.set({});
    } catch(error) {
      foundError = true;
    }
    expect(foundError).to.be(true);
  });

  it('can be instantiated and correctly set() with some data and options', function() {
    var persons = [
      {
        "id": 1,
        "firstName": "PersonFirstNameTest1",
        "lastName": "PersonLastNameTest1",
        "email": "PersonEmailTest1"
      }, {
        "id": 2,
        "firstName": "PersonFirstNameTest2",
        "lastName": "PersonLastNameTest2",
        "email": "PersonEmailTest2"
      }, {
        "id": 3,
        "firstName": "PersonFirstNameTest3",
        "lastName": "PersonLastNameTest3",
        "email": "PersonEmailTest3"
      }, {
        "id": 4,
        "firstName": "PersonFirstNameTest4",
        "lastName": "PersonLastNameTest4",
        "email": "PersonEmailTest4"
      }
    ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });
    var people = PeopleCollection();

    expect(people().length).to.be(0);

    people.set(persons);

    expect(people().length).to.be(4);

    people.set([ _.extend({}, persons[0], { firstName: 'NOMERGE' }) ], { merge: false });
    expect(people.get(persons[0].id).firstName()).not.to.be('NOMERGE');

    people.set(persons);
    expect(people().length).to.be(4);
    people.set([ persons[0], persons[1] ], { remove: false });
    expect(people().length).to.be(4);

    people.set([ persons[0] ]);
    expect(people().length).to.be(1);
    people.set([ persons[0], persons[1] ], { add: false });
    expect(people().length).to.be(1);
  });

  it('can be instantiated with some data', function() {
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
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection([person1Data, person2Data]);

    expect(people().length).to.be(2);
    expect(people()[0].firstName()).to.be(person1Data.firstName);
    expect(people()[0].lastName()).to.be(person1Data.lastName);
    expect(people()[0].email()).to.be(person1Data.email);
    expect(people()[1].firstName()).to.be(person2Data.firstName);
    expect(people()[1].lastName()).to.be(person2Data.lastName);
    expect(people()[1].email()).to.be(person2Data.email);
  });

  it('can be instantiated with some data correctly', function() {
    var person1Data = {
      "firstName": "PersonFirstNameTest",
      "lastName": "PersonLastNameTest",
      "email": "PersonEmailTest"
    };
    var person2Data = {
      "firstName": "PersonFirstNameTest",
      "email": "PersonEmailTest"
    };

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
        this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection([person1Data, person2Data]);

    expect(people().length).to.be(2);
    expect(people()[0].firstName()).to.be(person1Data.firstName || null);
    expect(people()[0].lastName()).to.be(person1Data.lastName || null);
    expect(people()[0].email()).to.be(person1Data.email || null);
    expect(people()[1].firstName()).to.be(person2Data.firstName || null);
    expect(people()[1].lastName()).to.be(person2Data.lastName || null);
    expect(people()[1].email()).to.be(person2Data.email || null);
  });

  it('can be instantiated with some data correctly and then add()ed onto correctly', function() {
    var insertTestValue = 'InsertAtTest';
    var insertPosition = 2;

    var persons = [
      {
        "firstName": "PersonFirstNameTest",
        "lastName": "PersonLastNameTest",
        "email": "PersonEmailTest"
      }, {
        "firstName": "PersonFirstNameTest",
        "email": "PersonEmailTest"
      }
    ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
        this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection(persons);

    expect(people().length).to.be(2);
    people.addModel(persons[0]);
    expect(people().length).to.be(3);
    people.addModel(_.extend(persons[0], { firstName: insertTestValue }), { at: insertPosition });
    expect(people()[insertPosition].firstName()).to.be(insertTestValue);
  });

  it('can have data plucked from its entries', function() {
    var persons = [
      {
        "firstName": "PersonFirstNameTest1",
        "lastName": "PersonLastNameTest1",
        "email": "PersonEmailTest1"
      }, {
        "firstName": "PersonFirstNameTest2",
        "lastName": "PersonLastNameTest2",
        "email": "PersonEmailTest2"
      }
    ];

    var people = fw.collection(persons);

    expect(people.pluck('firstName')).to.eql([
      persons[0]['firstName'],
      persons[1]['firstName']
    ]);
  });

  it('can find an individual model that matches a set of attributes', function() {
    var persons = [
      {
        "firstName": "PersonFirstNameTest",
        "lastName": "PersonLastNameTest",
        "email": "PersonEmailTest"
      }, {
        "firstName": "PersonFirstNameTest",
        "email": "PersonEmailTest"
      }
    ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
        this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection(persons);

    expect(people.findWhere(persons[0])).to.be.an('object');
    expect(people.findWhere({ shouldNotFind: true })).to.be(null);
  });

  it('can find an item that matches a set of attributes in a complex set of models', function() {
    var people = fw.collection([
      {
        "firstName": "PersonFirstNameTest",
        "lastName": "PersonLastNameTest",
        "attributes": {
          nested: {
            nested2: {
              value: 'findme!'
            }
          }
        }
      }, {
        "firstName": "PersonFirstNameTest",
        "attributes": {
          nested: {
            nested2: {
              value: 'donotfindme!'
            }
          }
        }
      }
    ]);

    expect(people.where({ attributes: { nested: { nested2: { value: 'findme!' } } } }).length).to.be(1);
  });

  it('can find an individual model that matches a regex attribute', function() {
    var persons = [
      {
        "firstName": "PersonFirstNameTestRegex",
        "lastName": "PersonLastNaFINDMEmeTestRegex",
        "email": "PersonEmailTestRegex"
      }, {
        "firstName": "PersonFirstNameTest",
        "email": "PersonEmailTest"
      }
    ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
        this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection(persons);

    expect(people.findWhere({ lastName: /FINDME/ })).to.be.an('object');
    expect(people.findWhere({ lastName: /NOTFINDME/ })).to.be(null);
  });

  it('can find where a set of models matches some data', function() {
    var persons = [
      {
        "firstName": "PersonFirstNameTest1",
        "lastName": "PersonLastNameTest1",
        "email": "PersonEmailTest1",
        "commonTerm": "common1"
      }, {
        "firstName": "PersonFirstNameTest2",
        "lastName": "PersonLastNameTest2",
        "email": "PersonEmailTest2",
        "commonTerm": "common2"
      }, {
        "firstName": "PersonFirstNameTest3",
        "lastName": "PersonLastNameTest3",
        "email": "PersonEmailTest3",
        "commonTerm": "common1"
      }, {
        "firstName": "PersonFirstNameTest4",
        "lastName": "PersonLastNameTest4",
        "email": "PersonEmailTest4",
        "commonTerm": "common2"
      }
    ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
        this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
        this.commonTerm = fw.observable(person.commonTerm).mapTo('commonTerm');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection(persons);

    expect(people.where({ commonTerm: persons[2].commonTerm }).length).to.be(2);
  });

  it('can create a new model and add it to the collection correctly', function(done) {
    var wasCompleted = 0;
    var responseValue = {
      success: true
    };

    var persons = [
      {
        "firstName": "PersonFirstNameTest1",
        "lastName": "PersonLastNameTest1",
        "email": "PersonEmailTest1"
      }, {
        "firstName": "PersonFirstNameTest2",
        "lastName": "PersonLastNameTest2",
        "email": "PersonEmailTest2"
      }, {
        "firstName": "PersonFirstNameTest3",
        "lastName": "PersonLastNameTest3",
        "email": "PersonEmailTest3"
      }, {
        "firstName": "PersonFirstNameTest4",
        "lastName": "PersonLastNameTest4",
        "email": "PersonEmailTest4"
      }
    ];

    var destUrl = '/peopleCollectionCreate';
    $.mockjax({
      responseTime: 10,
      url: destUrl,
      type: 'POST',
      responseText: responseValue
    });
    $.mockjax({
      responseTime: 10,
      url: destUrl,
      type: 'PUT',
      responseText: responseValue
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      url: destUrl,
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection(persons);

    var createdPersonData = {
      "firstName": "CreatedPersonFirstNameTest",
      "lastName": "CreatedPersonLastNameTest",
      "email": "CreatedPersonEmailTest"
    };
    var noWaitCreatedPersonData = {
      "firstName": "NoWaitCreatedPersonFirstNameTest",
      "lastName": "NoWaitCreatedPersonLastNameTest",
      "email": "NoWaitCreatedPersonEmailTest"
    };

    expect(people.findWhere(noWaitCreatedPersonData)).to.be(null);
    people
      .create(noWaitCreatedPersonData)
      .done(function(response) {
        expect(response).to.eql(responseValue);
        wasCompleted++;
      });
    expect(people.findWhere(noWaitCreatedPersonData)).to.be.an('object');

    people
      .create(createdPersonData, { wait: true })
      .done(function(response) {
        expect(response).to.eql(responseValue);
        wasCompleted++;
      });

    expect(people.findWhere(createdPersonData)).to.be(null);
    setTimeout(function() {
      expect(wasCompleted).to.be(2);
      expect(people.findWhere(createdPersonData)).to.be.an('object');
      done();
    }, 40);
  });

  it('can initialize and manipulate a plain collection including removal of an item', function() {
    var persons = [
      {
        "firstName": "PersonFirstNameTest",
        "lastName": "PersonLastNameTest",
        "email": "PersonEmailTest"
      }, {
        "firstName": "PersonFirstNameTest2",
        "email": "PersonEmailTest"
      }
    ];

    var people = fw.collection(persons);

    expect(people.findWhere(persons[0])).to.be.an('object');
    var removedModels = people.removeModel({ firstName: persons[0].firstName });
    expect(people.findWhere(persons[0])).to.be(null);
    expect(removedModels).to.eql([persons[0]]);
  });

  it('can remove a dataModel correctly', function() {
    var persons = [
      {
        "firstName": "PersonFirstNameTest",
        "lastName": "PersonLastNameTest",
        "email": "PersonEmailTest"
      }, {
        "firstName": "PersonFirstNameTest2",
        "email": "PersonEmailTest"
      }
    ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
        this.somethingNotProvidedFor = fw.observable().mapTo('somethingNotProvidedFor');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });

    var people = PeopleCollection(persons);

    expect(people.findWhere(persons[0])).to.be.an('object');
    people.removeModel({ firstName: persons[0].firstName });
    expect(people.findWhere(persons[0])).to.be(null);
  });

  it('can be serialized to a POJO correctly', function() {
    var person1Data = {
      "id": undefined,
      "firstName": "PersonFirstNameTest",
      "lastName": "PersonLastNameTest",
      "email": "PersonEmailTest"
    };
    var person2Data = {
      "id": undefined,
      "firstName": "PersonFirstNameTest2",
      "lastName": "PersonLastNameTest2",
      "email": "PersonEmailTest2"
    };

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });
    var people = PeopleCollection();

    expect(people().length).to.be(0);

    var peopleData = [ person1Data, person2Data ];
    people.set(peopleData);

    expect(people().length).to.be(2);
    expect(people.getData()).to.eql(peopleData);
  });

  it('can correctly trigger change/add/remove events for dataModels in a set() call as appropriate', function() {
    var peopleData = {
      "person1Data": {
        "id": 1,
        "firstName": "Person1FirstNameTest",
        "lastName": "Person1LastNameTest",
        "email": "Person1EmailTest"
      },
      "person2Data": {
        "id": 2,
        "firstName": "Person2FirstNameTest",
        "lastName": "Person2LastNameTest",
        "email": "Person2EmailTest"
      }
    };

    var Person = fw.dataModel.create({
      namespace: 'PersonEventCheck',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
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
      namespace: 'PeopleEventCheck',
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
            expect(dataModel.__isDataModel).to.be(true)
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

    expect(recordedEvents).to.eql({
      'person1Data _.add': 0,
      'person1Data _.change': 0,
      'person1Data _.remove': 0,
      'person2Data _.add': 0,
      'person2Data _.change': 0,
      'person2Data _.remove': 0
    });
    expect(people().length).to.be(0);

    people.set(_.values(peopleData));
    expect(recordedEvents).to.eql({
      'person1Data _.add': 1,
      'person1Data _.change': 0,
      'person1Data _.remove': 0,
      'person2Data _.add': 1,
      'person2Data _.change': 0,
      'person2Data _.remove': 0
    });
    expect(people().length).to.be(2);

    people.set([ peopleData.person1Data ]);
    expect(recordedEvents).to.eql({
      'person1Data _.add': 1,
      'person1Data _.change': 0,
      'person1Data _.remove': 0,
      'person2Data _.add': 1,
      'person2Data _.change': 0,
      'person2Data _.remove': 1
    });

    _.extend(peopleData.person1Data, { firstName: 'changeTest1' });
    people.set([ peopleData.person1Data, peopleData.person2Data ]);
    expect(recordedEvents).to.eql({
      'person1Data _.add': 1,
      'person1Data _.change': 1,
      'person1Data _.remove': 0,
      'person2Data _.add': 2,
      'person2Data _.change': 0,
      'person2Data _.remove': 1
    });

    peopleData.person1Data = _.omit(peopleData.person1Data, 'id');
    people.set([ peopleData.person1Data, peopleData.person2Data ]);
    expect(recordedEvents).to.eql({
      'person1Data _.add': 2,
      'person1Data _.change': 1,
      'person1Data _.remove': 1,
      'person2Data _.add': 2,
      'person2Data _.change': 0,
      'person2Data _.remove': 1
    });

    expect(_.values(unexpectedEvents).length).to.be(0);
  });

  it('can be instantiated and reset() correctly', function() {
    var peopleData = {
      "person1Data": {
        "id": 1,
        "firstName": "Person1FirstNameTest",
        "lastName": "Person1LastNameTest",
        "email": "Person1EmailTest"
      },
      "person2Data": {
        "id": 2,
        "firstName": "Person2FirstNameTest",
        "lastName": "Person2LastNameTest",
        "email": "Person2EmailTest"
      }
    };

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'People',
      dataModel: Person
    });
    var people = PeopleCollection();

    var resetTriggered = false;
    people.$namespace.subscribe('_.reset', function(resetData) {
      expect(resetData.newModels.length).to.be(2);
      expect(resetData.oldModels.length).to.be(2);
      resetTriggered = true;
    });

    expect(resetTriggered).to.be(false);

    expect(people().length).to.be(0);
    people.set(_.values(peopleData));
    expect(people().length).to.be(2);

    people.reset(_.values(peopleData));
    expect(resetTriggered).to.be(true);
    expect(people().length).to.be(2);

    expect(people()[0].firstName()).to.be(peopleData.person1Data.firstName);
    expect(people()[0].lastName()).to.be(peopleData.person1Data.lastName);
    expect(people()[0].email()).to.be(peopleData.person1Data.email);
    expect(people()[1].firstName()).to.be(peopleData.person2Data.firstName);
    expect(people()[1].lastName()).to.be(peopleData.person2Data.lastName);
    expect(people()[1].email()).to.be(peopleData.person2Data.email);
  });

  it('can correctly fetch() and set data from the server', function(done) {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var peopleData = [ personData, personData, personData, personData, personData ];

    $.mockjax({
      responseTime: 10,
      url: "/peopleCollectionGET",
      type: 'GET',
      responseText: peopleData
    });
    $.mockjax({
      responseTime: 10,
      url: "/peopleCollectionGETAjaxOptionsOverride",
      type: 'GET',
      responseText: peopleData
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleFetch',
      url: '/peopleCollectionGET',
    });
    var people = PeopleCollection();
    var PeopleCollectionAjaxOptions = fw.collection.create({
      namespace: 'PeopleFetch',
      url: '/invalid',
      ajaxOptions: function() {
        return {
          url: '/peopleCollectionGETAjaxOptionsOverride'
        };
      }
    });
    var peopleAjaxOptions = PeopleCollectionAjaxOptions();

    var changeEventCalled = false;
    fw.namespace('PeopleFetch').subscribe('_.change', function(changeData) {
      expect(changeData).to.be.an('object');
      expect(changeData.touched.length).to.be(peopleData.length);
      expect(changeData.serverResponse).to.eql(peopleData);
      expect(changeData.options).to.eql({ parse: true });
      changeEventCalled = true;
    });

    var fetchResult = people.fetch();
    expect(fetchResult).to.be.an('object');
    expect((fetchResult.done || fetchResult.then)).to.be.a('function');

    peopleAjaxOptions.fetch();

    expect(changeEventCalled).to.be(false);
    setTimeout(function() {
      expect(changeEventCalled).to.be(true);
      expect(people().length).to.be(peopleData.length);
      expect(people()[0].firstName).to.be(personData.firstName);

      expect(peopleAjaxOptions().length).to.be(peopleData.length);
      expect(peopleAjaxOptions()[0].firstName).to.be(personData.firstName);

      done();
    }, 40);
  });

  it('can correctly fetch(), parse and set data from the server', function(done) {
    var peopleData = [
      {
        "firstName": "PeopleFirstNameTest1",
        "lastName": "PeopleLastNameTest1",
        "email": "PeopleEmailTest1@email.com"
      }, {
        "firstName": "PeopleFirstNameTest2",
        "lastName": "PeopleLastNameTest2",
        "email": "PeopleEmailTest2@email.com"
      }, {
        "firstName": "PeopleFirstNameTest3",
        "lastName": "PeopleLastNameTest2",
        "email": "PeopleEmailTest3@email.com"
      }
    ];

    $.mockjax({
      responseTime: 10,
      url: "/peopleCollectionGETParse",
      type: 'GET',
      responseText: peopleData
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleFetchAndParse',
      url: '/peopleCollectionGETParse',
      parse: function(people) {
        return _.map(people, function(person) {
          person.flag = true;
          return person;
        });
      }
    });

    var people = PeopleCollection();

    var fetchResult = people.fetch();
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    expect(people().length).to.be(0);
    setTimeout(function() {
      expect(people().length).to.be(peopleData.length);
      expect(people()[0].flag).to.be(true);
      done();
    }, 40);
  });

  it('can correctly fetch() and reset data from the server', function(done) {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    $.mockjax({
      responseTime: 10,
      url: "/peopleCollectionReset",
      type: 'GET',
      responseText: peopleData
    });

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleFetchReset',
      url: '/peopleCollectionReset',
      dataModel: Person
    });
    var people = PeopleCollection();

    var resetTriggered = false;
    people.$namespace.subscribe('_.reset', function(resetData) {
      expect(resetData).to.be.an('object');
      expect(resetData.oldModels).to.be.an('array');
      expect(resetData.newModels).to.be.an('array');
      resetTriggered = true;
    });

    var fetchResult = people.fetch({ reset: true });
    expect(fetchResult).to.be.an('object');
    expect(fetchResult.done).to.be.a('function');

    expect(resetTriggered).to.be(false);
    setTimeout(function() {
      expect(resetTriggered).to.be(true);
      expect(people().length).to.be(peopleData.length);
      expect(people()[0].firstName()).to.be(personData.firstName);
      done();
    }, 40);
  });

  it('can .push() correctly', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection();

    var addTriggered = false;
    people.$namespace.subscribe('_.add', function(dataModels) {
      _.each(dataModels, function(dataModel) {
        expect(dataModel.__isDataModel).to.be(true)
      });
      addTriggered = true;
    });

    expect(addTriggered).to.be(false);
    people.push({});
    expect(addTriggered).to.be(true);
    expect(people()[0].__isDataModel).to.be(true);
  });

  it('can .unshift() correctly', function() {
    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleUnshiftEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection();

    var addTriggered = false;
    people.$namespace.subscribe('_.add', function(dataModels) {
      _.each(dataModels, function(dataModel) {
        expect(dataModel.__isDataModel).to.be(true)
      });
      addTriggered = true;
    });

    expect(addTriggered).to.be(false);
    people.unshift({});
    expect(addTriggered).to.be(true);
    expect(people()[0].__isDataModel).to.be(true);
  });

  it('.remove() correctly triggers _.remove event', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleRemoveEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection(peopleData);

    var removeTriggered = false;
    people.$namespace.subscribe('_.remove', function(dataModels) {
      removeTriggered = true;
    });

    expect(removeTriggered).to.be(false);
    people.remove(people()[0]);
    expect(removeTriggered).to.be(true);
  });

  it('.removeAll() correctly triggers _.remove event', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleRemoveAllEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection(peopleData);

    var removeTriggered = false;
    people.$namespace.subscribe('_.remove', function(dataModels) {
      removeTriggered = true;
    });

    expect(removeTriggered).to.be(false);
    var peopleRemoved = people.removeAll([ people()[0], people()[2] ]);
    expect(removeTriggered).to.be(true);
    expect(peopleRemoved.length).to.be(2);
  });

  it('.pop() correctly triggers _.remove event', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeoplePopRemoveEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection(peopleData);

    var removeTriggered = false;
    people.$namespace.subscribe('_.remove', function(dataModels) {
      removeTriggered = true;
    });

    expect(removeTriggered).to.be(false);
    var peopleRemoved = people.pop();
    expect(removeTriggered).to.be(true);
    expect(peopleRemoved).to.be.an('object');
  });

  it('.shift() correctly triggers _.remove event', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleShiftRemoveEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection(peopleData);

    var removeTriggered = false;
    people.$namespace.subscribe('_.remove', function(dataModels) {
      removeTriggered = true;
    });

    expect(removeTriggered).to.be(false);
    var peopleRemoved = people.shift();
    expect(removeTriggered).to.be(true);
    expect(peopleRemoved).to.be.an('object');
  });

  it('.splice() correctly triggers _.remove event', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleSpliceRemoveEventCheck',
      dataModel: Person
    });
    var people = PeopleCollection(peopleData);

    var removeTriggered = false;
    people.$namespace.subscribe('_.remove', function(dataModels) {
      removeTriggered = true;
    });

    expect(removeTriggered).to.be(false);
    var peopleRemoved = people.splice(1, 2);
    expect(removeTriggered).to.be(true);
    expect(peopleRemoved.length).to.be(2);
  });

  it('disposes dataModels correctly when removed', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleDisposeDataModelsCheck',
      dataModel: Person
    });
    var people = PeopleCollection(peopleData);

    expect(people()[0]._isDisposed).to.be(undefined);
    var personRemoved = people.remove(people()[0]);
    expect(personRemoved[0]._isDisposed).to.be(true);
    expect(people().length).to.be(peopleData.length - 1);
  });

  it('can be configured to not dispose of dataModels when removed', function() {
    var personData = {
      "firstName": "PeopleFirstNameTest",
      "lastName": null,
      "email": null
    };

    var idCount = 100;
    function makePersonData() {
      return _.extend({}, personData, {
        id: idCount++
      });
    }
    var peopleData = [ makePersonData(), makePersonData(), makePersonData(), makePersonData(), makePersonData() ];

    var Person = fw.dataModel.create({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection.create({
      namespace: 'PeopleDoNotDisposeDataModelsCheck',
      dataModel: Person,
      disposeOnRemove: false
    });
    var people = PeopleCollection(peopleData);

    expect(people()[0]._isDisposed).to.be(undefined);
    var personRemoved = people.remove(people()[0]);
    expect(personRemoved[0]._isDisposed).not.to.be(true);
    expect(people().length).to.be(peopleData.length - 1);
  });
});
