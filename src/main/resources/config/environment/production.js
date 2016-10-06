'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.ip || undefined,

  // Server port
  port: process.env.PORT || 5000,

  // Morgan Log Level
  logLevel: 'combined',

  // Sentry configuration enviroment
  SENTRY_DSN: process.env.SENTRY_DSN = process.env.SENTRY_DSN || '',
  SENTRY_NAME: process.env.SENTRY_NAME = process.env.SENTRY_NAME || '',
  SENTRY_RELEASE: process.env.SENTRY_RELEASE = process.env.SENTRY_RELEASE || '',
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || ''
};
