'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.ip || undefined,

  // Server port
  port: process.env.PORT || 5000,

  logLevel: 'combined'
};
