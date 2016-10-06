/**
 * Sentry and Raven configuration
 */

'use strict';

var config = require('./environment'),
    raven = require('raven'),
    client = null;

client = new raven.Client(config.SENTRY_DSN, {
  logger: config.SENTRY_NAME,
  release: config.SENTRY_RELEASE,
  environment: config.env,
  tags: {},
  extra: {},
  dataCallback: function(data) {
    //console.log('Data from Sentry: ', data);
  }
});

client.patchGlobal();
raven.patchGlobal(client);

module.exports = {rvn: raven, client: client};
