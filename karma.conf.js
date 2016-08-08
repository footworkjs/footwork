var smokeConfig = require('./tests/smoke-conf.js');
smokeConfig.singleRun = false;

module.exports = function(config) {
  config.set(smokeConfig);
}
