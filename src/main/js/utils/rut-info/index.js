'use strict';

/**
 * @name InfoRut
 * @description Get full name from a valid RUT.
 * # Rutificador
 *
 * This is a fork of https://github.com/lgaticaq/info-rut.git
 */

var cheerio = require('cheerio'),
    rp = require('request-promise'),
    Rut = require('rutjs'),
    debug = require('debug')('app:rutStatus');

var getFullName = function(data) {
  var _rut = new Rut(data);
  var rut = _rut.isValid ? _rut.getNiceRut(false) : '1';

  var options = {
    url: `http://datos.24x7.cl/rut/${rut}/`,
    transform: cheerio.load
  };
  return rp(options).then(function($) {
    var fullName = $('h1:contains(Nombre)').next().text();
    if (fullName === '') throw new Error('Not found full name');
    return fullName.split(', Buscas')[0];
  });
};

var getRut = function(name) {
  var options = {
    url: 'http://datos.24x7.cl/',
    transform: cheerio.load
  };
  var rpap = rp.defaults({jar: true});
  return rpap(options)
    .then(function($) { $('input[name=csrfmiddlewaretoken]').val() })
    .then(function(csrf) {
      var options = {
        method: 'POST',
        url: 'http://datos.24x7.cl/get_generic_ajax/',
        form: {
          entrada: name,
          csrfmiddlewaretoken: csrf
        },
        json: true
      };
      return rpap(options);
    }).then(function(data) {
      var results = [];
      if (data.status === 'success') {
        results = data.value.map(function(x) {
          var rut = new Rut(x.rut.toString(), true);
          return {
            url: `http://datos.24x7.cl/rut/${rut.getNiceRut(false)}/`,
            fullName: x.name,
            rut: rut.getNiceRut(false)
          };
        });
      }
      return results;
    });
};

module.exports = {
  getFullName: getFullName,
  getRut: getRut
};
