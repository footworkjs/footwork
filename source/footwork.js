/* istanbul ignore next */
var fw = require('../bower_components/knockoutjs/dist/knockout');

require('./misc/init');

fw.namespace = require('./namespace/namespace');

require('./broadcastable-receivable');
require('./entities/entities');
require('./resource/resource');
require('./component/component');
require('./collection/collection');

require('./binding/applyBindings');
require('./binding/start');

fw.sync = require('./misc/ajax').sync;
fw.embed = require('./misc/embed-exports');

module.exports = fw;
