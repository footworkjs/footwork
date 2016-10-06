var fw = require('../bower_components/knockoutjs/dist/knockout');

require('./misc/init');
require('./binding/start');
require('./binding/applyBindings');

fw.sync = require('./misc/sync');
fw.embed = require('./misc/embed-exports');

fw.namespace = require('./namespace/namespace');
require('./broadcastable-receivable');
require('./entities/entities');
require('./resource/resource');
require('./component/component');

module.exports = fw;
