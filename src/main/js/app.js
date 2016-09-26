/**
 * Main application file
 */

'use strict';

var express = require('express'),
    config = require('../resources/config/environment'),
    http = require('http');

// Setup server
var app = express(),
    server = http.createServer(app),
    socketio = require('socket.io')(server);

require('../resources/config/socketio')(socketio);
require('../resources/config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  app.rutificador = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}
setImmediate(startServer);

// Expose app
exports = module.exports = app;
