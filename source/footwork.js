var fw = require('../bower_components/knockoutjs/dist/knockout');

require('./util');
require('./init');
require('./entity-mixins');
require('./binding/start');

fw.namespace = require('./namespace');
require('./broadcastable-receivable');

module.exports = fw;

