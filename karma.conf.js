var baseConfig = require('./tests/karma.conf.js');

baseConfig.singleRun = false;

module.exports = function(config) {
  config.set(baseConfig);
}
