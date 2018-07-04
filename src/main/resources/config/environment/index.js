/**
 * All configurations will extend these options
 */
'use strict';

var path = require('path');
var _ = require('lodash');

/*
function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}
*/

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var all = {
  env: env,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 5000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: ''
  },

  // Morgan Log Level
  logLevel: '',

  // Sentry configuration enviroment
  SENTRY_DSN: '',
  SENTRY_NAME: '',
  SENTRY_RELEASE: '',
  SENTRY_ENVIRONMENT: ''
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${env}.js`) || {});
