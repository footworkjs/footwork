var fw = require('knockout/build/output/knockout-latest');

fw.footworkVersion = 'FOOTWORK_VERSION';

fw.namespace = require('./namespace/namespace');
fw.embed = require('./misc/embed-exports');
fw.sync = require('./misc/ajax').sync;

fw.utils.guid = require('./misc/util').guid;
fw.utils.getPrivateData = require('./misc/util').getPrivateData;

require('./broadcastable-receivable/broadcastable');
require('./broadcastable-receivable/receivable');

require('./entities/entities');
require('./component/component');
require('./collection/collection');

require('./binding/lifecycle-binding');
require('./binding/applyBindings');
require('./binding/start');

module.exports = fw;
