var fw = require('knockout/build/output/knockout-latest');
var _ = require('lodash');

var entityDescriptors = require('../../entity-descriptors');
var prepareDescriptor = require('../../entity-tools').prepareDescriptor;

var util = require('../../../misc/util');
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

var descriptor;
entityDescriptors.push(descriptor = prepareDescriptor({
  tagName: entityName.toLowerCase(),
  entityName: entityName,
  resource: fw[entityName],
  isEntityDuckTag: isEntityDuckTag,
  isEntity: function (thing) {
    return _.isObject(thing) && !!thing[isEntityDuckTag];
  },
  defaultConfig: {}
}));

fw['is' + capitalizeFirstLetter(entityName)] = descriptor.isEntity;

var routerDefaults = require('../router-defaults');
fw.components.register(routerDefaults.noComponentSelected, {
  template: '<div class="no-component-selected"></div>',
  synchronus: true
});
fw.components.register(routerDefaults.nullComponent, {
  template: '<div class="null-component"></div>',
  synchronus: true
});
fw.components.register(routerDefaults.defaultLoadingComponent, {
  template: '<div class="sk-wave ' + routerDefaults.defaultLoadingComponent + ' fade-in">\
              <div class="sk-rect sk-rect1"></div>\
              <div class="sk-rect sk-rect2"></div>\
              <div class="sk-rect sk-rect3"></div>\
              <div class="sk-rect sk-rect4"></div>\
              <div class="sk-rect sk-rect5"></div>\
            </div>',
  synchronus: true
});

