/**
 * Main application routes
 */

'use strict';

var errors = require('./errors');
var path = require('path');

module.exports = function(app) {
  // Insert routes below
  //app.use('/auth', require('./auth').default);
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);
  // All other routes should redirect to the index.html
  app.route('/p/findByRut')
    .get(function(req, resp) {
      resp.sendFile(path.resolve(app.get('appPath') + '/views/findByRut.html'));
    }
  );
  app.route('/p/findByName')
    .get(function(req, resp) {
      resp.sendFile(path.resolve(app.get('appPath') + '/views/findByName.html'));
    }
  );
  app.route('/*')
    .get(function(req, resp) {
      resp.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    }
  );
};
