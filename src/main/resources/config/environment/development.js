'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // Morgan Log Level
  logLevel: 'dev',

  // Sentry configuration enviroment
  SENTRY_DSN: process.env.SENTRY_DSN = process.env.SENTRY_DSN || '',
  SENTRY_NAME: process.env.SENTRY_NAME = process.env.SENTRY_NAME || '',
  SENTRY_RELEASE: process.env.SENTRY_RELEASE = process.env.SENTRY_RELEASE || '',
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || ''
};
