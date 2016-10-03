var fw = require('../../bower_components/knockoutjs/dist/knockout');
var _ = require('../lodash');

function prepareDescriptor(descriptor) {
  var methodName = descriptor.methodName.charAt(0).toUpperCase() + descriptor.methodName.slice(1);

  return _.extend({
    resourceLocations: {},
    registered: {},
    fileExtensions: fw.observable('.js'),
    referenceNamespace: (_.isString(descriptor.methodName) ? ('__' + descriptor.methodName + 'Reference') : undefined),
    isEntityCtorDuckTag: '__is' + methodName + 'Ctor',
    isEntityDuckTag: '__is' + methodName,
    isEntityCtor: function isEntityCtor(thing) {
      return _.isFunction(thing) && !!thing[ this.isEntityCtorDuckTag ];
    }.bind(descriptor),
    isEntity: function isEntity(thing) {
      return _.isObject(thing) && !!thing[ this.isEntityDuckTag ];
    }.bind(descriptor)
  }, descriptor);
}

module.exports = {
  prepareDescriptor: prepareDescriptor
};
