var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

require('./outlet-loader');
require('./outlet-binding');

var entityName = 'outlet';

var descriptor = {
  entityName: entityName,
  resource: fw[entityName] = {},
  isEntityDuckTag: getSymbol('is' + capitalizeFirstLetter(entityName)),
  isEntity: function (thing) {
    return _.isObject(thing) && thing[descriptor.isEntityDuckTag];
  },
  referenceNamespace: getSymbol(entityName)
};

require('../resource-tools')(descriptor, ['get']);
require('../entity-descriptors').push(descriptor);

fw.components.register(require('../router/router-config').noComponentSelected, {
  template: ' ',
  synchronus: true
});

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

