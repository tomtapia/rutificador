/**
 * Socket.io configuration
 */
'use strict';

const rutjs = require('rutjs'),
      rutInfo = require('../../js/utils/rut-info'),
      rutStatus = require('../../js/utils/rut-status'),
      uuid = require('uuid'),
      logger = require('./log4node')({name:'app:socket'});

module.exports = function(socketio) {
  var nspRut = socketio.of('/rutificador');

  nspRut.on('error', function(err) {
    logger.error(err);
  });

  nspRut.on('connection', function(socket) {
    socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;
    socket.connectedAt = new Date();

    socket.log = function(message, data, logType) {
      logType = typeof logType !== 'undefined' ? logType : 'log';
      logger.debug(`${socket.nsp.name} [${socket.address}] - ${message}`, '\n' + JSON.stringify(data, null, 2));
    };

    socket.emitError = function(message, data) {
      socket.log(message, data, 'error');
      socket.to(socket.id).emit('throw error', {code: 500, message: message, data: data});
    };

    socket.on('error', function(err, next) {
      socket.log('CatchError B:', err, 'error');
      next();
    });

    socket.on('join', function(data) {
      socket.log("New Request is joined.", data);
      if(data) {
        socket.join(data);
      } else {
        data = uuid.v4();
        socket.join(data);
        socket.emit('new roomId', data);
      }
      socket.log("Request joined to " + data, data);
    });

    socket.on('rut info', function(data) {
      socket.log("Rut Info Requested.", data);
      if (data && data.rut) {
        try {
          rutInfo.getFullName(data.rut)
            .then(function(resp) {
              var splitName = resp.split(' '),
                  name = {
                    name: (((splitName[2] === undefined) ? '' : splitName[2]) + ' ' + ((splitName[3] === undefined) ? '' : splitName[3])).trim(),
                    pname: ((splitName[0] === undefined) ? '' : splitName[0]),
                    mname: ((splitName[1] === undefined) ? '' : splitName[1])
              };
              socket.emit('rut info resp', {rut:data.rut, name:name});
              socket.log("Rut Info Emited.", resp);
            }).catch(function(err) {
              socket.emitError('Rut Info Response With Error', err.message);
            });
          } catch (err) {
            rvmClient.captureException(err);
          }
      } else {
        socket.emitError('Data is not valid', data);
      }
    });

    socket.on('rut status', function(data) {
      socket.log("Rut Status Requested.", data);
      if (data && data.rut) {
        try {
          rutStatus({rut: data.rut,type: 'CEDULA',serial: ''})
            .then(function(resp) {
              socket.emit('rut status resp', {rut:data.rut, status:resp});
              socket.log("Rut Status Emited.", resp);
            })
            .catch(function(err) {
              socket.emitError('Rut Status Response With Error', err.message);
            });
        } catch (err) {
          rvmClient.captureException(err);
        }
      } else {
        socket.emitError('Data is not valid', data);
      }
    });
  });
}
