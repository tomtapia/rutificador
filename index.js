'use strict';

var config = require('./src/main/resources/config/environment');

if(config.env === 'development' || config.env === 'test') {
  var env = require('node-env-file');
  env(__dirname + '/.env');
}

// Export the application
exports = module.exports = require('./src/main/js/app');
