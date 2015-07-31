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

    people.$namespace.subscribe('_.*', function(models, envelope) {
      var dataModels = [].concat(models);
      var collectionEvent = envelope.topic;
      _.each(dataModels, function(dataModel) {
        _.each(peopleData, function(person, varName) {
          var expectedEventKey = varName + ' ' + collectionEvent;
          var fieldNames = _.keys(person);
          if(_.isEqual(person, _.pick(dataModel.$toJS(), fieldNames))) {
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

    peopleData.person1Data = _.omit(peopleData.person1Data, 'id');
    people.$set([ peopleData.person1Data, peopleData.person2Data ]);
    expect(recordedEvents).to.eql({
      'person1Data _.add': 2,
      'person1Data _.change': 1,
      'person1Data _.remove': 0,
      'person2Data _.add': 2,
      'person2Data _.change': 0,
      'person2Data _.remove': 1
    });

    expect(_.values(unexpectedEvents).length).to.be(0);
  });

  it('can be instantiated and $reset() correctly', function() {
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

    var resetTriggered = false;
    people.$namespace.subscribe('_.reset', function(dataModels) {
      expect(dataModels.length).to.eql(2);
      resetTriggered = true;
    });

    expect(resetTriggered).to.be(false);

    expect(people().length).to.be(0);
    people.$set(_.values(peopleData));
    expect(people().length).to.be(2);

    people.$reset(_.values(peopleData));
    expect(resetTriggered).to.be(true);
    expect(people().length).to.be(2);

    expect(people()[0].firstName()).to.be(peopleData.person1Data.firstName);
    expect(people()[0].lastName()).to.be(peopleData.person1Data.lastName);
    expect(people()[0].email()).to.be(peopleData.person1Data.email);
    expect(people()[1].firstName()).to.be(peopleData.person2Data.firstName);
    expect(people()[1].lastName()).to.be(peopleData.person2Data.lastName);
    expect(people()[1].email()).to.be(peopleData.person2Data.email);
  });

  it('can correctly $fetch() and $set data from the server', function(done) {
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

  it('can correctly $fetch() and $reset data from the server', function(done) {
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
      namespace: 'PeopleFetchReset',
      url: '/peopleCollectionReset',
      dataModel: Person
    });
    var people = new PeopleCollection();

    var resetTriggered = false;
    people.$namespace.subscribe('_.reset', function(dataModels) {
      resetTriggered = true;
    });

    expect(resetTriggered).to.be(false);

    people.$fetch({ reset: true });
    setTimeout(function() {
      expect(resetTriggered).to.be(true);
      expect(people().length).to.be(peopleData.length);
      expect(people()[0].firstName()).to.be(personData.firstName);
      done();
    }, 40);
  });

  it('.push() correctly triggers _.add event', function() {
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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection();

    var addTriggered = false;
    people.$namespace.subscribe('_.add', function(dataModels) {
      addTriggered = true;
    });

    expect(addTriggered).to.be(false);
    people.push(new Person());
    expect(addTriggered).to.be(true);
  });

  it('.unshift() correctly triggers _.add event', function() {
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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection();

    var addTriggered = false;
    people.$namespace.subscribe('_.add', function(dataModels) {
      addTriggered = true;
    });

    expect(addTriggered).to.be(false);
    people.unshift(new Person());
    expect(addTriggered).to.be(true);
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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection(peopleData);

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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection(peopleData);

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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection(peopleData);

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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection(peopleData);

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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection(peopleData);

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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person
    });
    var people = new PeopleCollection(peopleData);

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
      namespace: 'PeoplePushEventCheck',
      dataModel: Person,
      disposeOnRemove: false
    });
    var people = new PeopleCollection(peopleData);

    expect(people()[0]._isDisposed).to.be(undefined);
    var personRemoved = people.remove(people()[0]);
    expect(personRemoved[0]._isDisposed).not.to.be(true);
    expect(people().length).to.be(peopleData.length - 1);
  });
});
