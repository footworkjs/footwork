var fw = require('knockout/build/output/knockout-latest');
var _ = require('footwork-lodash');

var util = require('../../misc/util');
var capitalizeFirstLetter = util.capitalizeFirstLetter;
var getSymbol = util.getSymbol;

require('./outlet-loader');
require('./outlet-binding');

var entityName = 'outlet';
var isEntityDuckTag = getSymbol('is' + capitalizeFirstLetter(entityName));

fw[entityName] = {
  boot: require('./outlet-bootstrap'),
  registerView: function (viewName, templateHTML) {
    fw.components.register(viewName, { template: templateHTML });
  },
  registerViewLocation: function (viewName, viewLocation) {
    fw.components.registerLocation(viewName, { template: viewLocation });
  }
};

var descriptor = {
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: isEntityDuckTag,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[isEntityDuckTag];
  },
  referenceNamespace: getSymbol(entityName)
};

require('../resource-tools')(descriptor);
require('../entity-descriptors').push(descriptor);

var routerDefaults = require('../router/router-defaults');
fw.components.register(routerDefaults.noComponentSelected, {
  template: ' ',
  synchronus: true
});

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

