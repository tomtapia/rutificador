/**
 * Express configuration
 */

'use strict';

var express = require('express'),
    config = require('./environment'),
    path = require('path'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan');


module.exports = function(app) {
  var env = app.get('env');

  app.use(morgan(config.logLevel));

  if(env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
  }

  app.set('appPath', path.join(config.root, 'webapp'));
  app.set('bowerPath', path.join(config.root, '../../bower_components/'));
  app.use(express.static(app.get('appPath')));
  app.use(express.static(app.get('bowerPath')));

  app.set('views', config.root + '/webapp/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  if(env === 'development' || env === 'test') {
    app.use(errorHandler()); // Error handler - has to be last
  }
}
