/* istanbul ignore next */
var fw = require('../bower_components/knockoutjs/dist/knockout');

fw.footworkVersion = 'FOOTWORK_VERSION';

fw.namespace = require('./namespace/namespace');
fw.sync = require('./misc/ajax').sync;
fw.embed = require('./misc/embed-exports');
fw.utils.guid = require('./misc/util').guid;

require('./broadcastable-receivable/broadcastable');
require('./broadcastable-receivable/receivable');
require('./entities/entities');
require('./resource/resource');
require('./component/component');
require('./collection/collection');

require('./binding/applyBindings');
require('./binding/start');

module.exports = fw;
