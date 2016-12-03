var fw = require('knockout/build/output/knockout-latest');
var util = require('./misc/util');

fw.animationClass = {
  animateIn: 'animateIn'
};
fw.footworkVersion = 'FOOTWORK_VERSION';
fw[util.getSymbol('footwork')] = { /* internal data registration point */ };

fw.namespace = require('./namespace/namespace');
fw.isNamespace = function(thing) {
  return thing instanceof fw.namespace;
};

fw.sync = require('./misc/ajax').sync;
fw.utils.getPrivateData = util.getPrivateData;

require('./broadcastable-receivable/broadcastable');
require('./broadcastable-receivable/receivable');

require('./entities/entities');
require('./component/component');
require('./collection/collection');

require('./binding/lifecycle-binding');
require('./binding/applyBindings');
require('./binding/start');

module.exports = fw;
