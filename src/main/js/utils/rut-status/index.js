'use strict';

/**
 * @name RutStatus
 * @description Check rut status in registro civil.
 * # Rutificador
 *
 * This is a fork of https://github.com/lgaticaq/rut-status.git
 */

var cheerio = require('cheerio'),
    rp = require('request-promise');

module.exports = function(data) {
  return rp({
    url: 'https://portal.sidiv.registrocivil.cl/usuarios-portal/pages/DocumentRequestStatus.xhtml',
    rejectUnauthorized: false,
    resolveWithFullResponse: true
  }).then(function(response) {
    var $ = cheerio.load(response.body);
    return rp({
      method: 'POST',
      url: 'https://portal.sidiv.registrocivil.cl/usuarios-portal/pages/DocumentRequestStatus.xhtml',
      form: {
        'form':'form',
        'form:run': data.rut,
        'form:selectDocType': data.type ? data.type.toUpperCase() : 'CEDULA',
        'form:docNumber': data.serial,
        'form:buttonHidden':'',
        'javax.faces.ViewState': $('input[name="javax.faces.ViewState"]').val()
      },
      rejectUnauthorized: false,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        'Cookie': response.headers['set-cookie'][0],
        'Origin':'https://portal.sidiv.registrocivil.cl',
        'Referer':'https://portal.sidiv.registrocivil.cl/usuarios-portal/pages/DocumentRequestStatus.xhtml'
      },
      transform: cheerio.load
    });
  }).then(function($) {
    var status = $('#tableResult .setWidthOfSecondColumn').text();
    if (status === '') { throw new Error('Not found'); }
    return status;
  });
};
