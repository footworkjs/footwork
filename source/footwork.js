var fw = require('knockout/build/output/knockout-latest');

fw.version = {
  knockout: fw.version,
  footwork: 'FOOTWORK_VERSION'
};

require('./namespace/namespace');
require('./broadcastable-receivable/broadcastable');
require('./broadcastable-receivable/receivable');

require('./entities/entities');
require('./component/component');
require('./collection/collection');

require('./binding/lifecycle-binding');
require('./binding/applyBindings');
require('./binding/start');

module.exports = fw;
