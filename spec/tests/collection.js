'use strict';

var sandbox = document.getElementById('sandbox');

describe('collection', function () {
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
