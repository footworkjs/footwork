'use strict';

var sandbox = document.getElementById('sandbox');

describe('collection', function () {
  it('can be instantiated and correctly $set() with some data', function() {
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

    var Person = fw.dataModel({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection({
      namespace: 'People',
      dataModel: Person
    });
    var people = new PeopleCollection();

    expect(people().length).to.be(0);

    people.$set([ person1Data, person2Data ]);

    expect(people().length).to.be(2);
    expect(people()[0].firstName()).to.be(person1Data.firstName);
    expect(people()[0].lastName()).to.be(person1Data.lastName);
    expect(people()[0].email()).to.be(person1Data.email);
    expect(people()[1].firstName()).to.be(person2Data.firstName);
    expect(people()[1].lastName()).to.be(person2Data.lastName);
    expect(people()[1].email()).to.be(person2Data.email);
  });

  it('can correctly trigger change/add/remove events for dataModels in a $set() call as appropriate', function() {
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

    var Person = fw.dataModel({
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

    var PeopleCollection = fw.collection({
      namespace: 'PeopleEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection();
    people.$namespace.subscribe('_.*', function(dataModel, envelope) {
      var collectionEvent = envelope.topic;
      _.each(peopleData, function(person, varName) {
        var expectedEventKey = varName + ' ' + collectionEvent;
        if(_.isEqual(person, dataModel.$toJS())) {
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

    expect(people().length).to.be(0);

    people.$set(_.values(peopleData));
    expect(recordedEvents).to.eql({
      'person1Data _.add': 1,
      'person1Data _.change': 0,
      'person1Data _.remove': 0,
      'person2Data _.add': 1,
      'person2Data _.change': 0,
      'person2Data _.remove': 0
    });

    expect(people().length).to.be(2);
    people.$set([ peopleData.person1Data ]);
    expect(recordedEvents).to.eql({
      'person1Data _.add': 1,
      'person1Data _.change': 0,
      'person1Data _.remove': 0,
      'person2Data _.add': 1,
      'person2Data _.change': 0,
      'person2Data _.remove': 1
    });

    _.extend(peopleData.person1Data, { firstName: 'changeTest1' });
    people.$set([ peopleData.person1Data, peopleData.person2Data ]);
    expect(recordedEvents).to.eql({
      'person1Data _.add': 1,
      'person1Data _.change': 1,
      'person1Data _.remove': 0,
      'person2Data _.add': 2,
      'person2Data _.change': 0,
      'person2Data _.remove': 1
    });
    expect(_.values(unexpectedEvents).length).to.be(0);
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
      "firstName": "PersonFirstNameTest",
      "lastName": "PersonLastNameTest",
      "email": "PersonEmailTest"
    };

    var Person = fw.dataModel({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection({
      namespace: 'People',
      dataModel: Person
    });
    var people = new PeopleCollection();

    expect(people().length).to.be(0);

    var peopleData = [ person1Data, person2Data ];
    people.$set(peopleData);

    expect(people().length).to.be(2);
    expect(people.$toJS()).to.eql(peopleData);
  });

  it('can be serialized to a JSON string correctly', function() {
    var person1Data = {
      "id": undefined,
      "firstName": "PersonFirstNameTest",
      "lastName": "PersonLastNameTest",
      "email": "PersonEmailTest"
    };
    var person2Data = {
      "id": undefined,
      "firstName": "PersonFirstNameTest",
      "lastName": "PersonLastNameTest",
      "email": "PersonEmailTest"
    };

    var Person = fw.dataModel({
      namespace: 'Person',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection({
      namespace: 'People',
      dataModel: Person
    });
    var people = new PeopleCollection();

    expect(people().length).to.be(0);

    var peopleData = [ person1Data, person2Data ];
    people.$set(peopleData);

    expect(people().length).to.be(2);
    expect(people.$toJSON()).to.eql(JSON.stringify(peopleData));
  });

  it('can correctly $fetch() data from the server and instantiate dataModels as appropriate', function(done) {
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
      url: "/peopleCollectionGET",
      type: 'GET',
      responseText: peopleData
    });

    var Person = fw.dataModel({
      namespace: 'Person',
      url: '/personGETWithCustomId',
      initialize: function(person) {
        person = person || {};
        this.firstName = fw.observable(person.firstName || null).mapTo('firstName');
        this.lastName = fw.observable(person.lastName || null).mapTo('lastName');
        this.email = fw.observable(person.email || null).mapTo('email');
      }
    });

    var PeopleCollection = fw.collection({
      namespace: 'People',
      url: '/peopleCollectionGET',
      dataModel: Person
    });
    var people = new PeopleCollection();

    people.$fetch();
    setTimeout(function() {
      expect(people().length).to.be(peopleData.length);
      expect(people()[0].firstName()).to.be(personData.firstName);
      done();
    }, 40);
  });
});
