/**
 * Socket.io configuration
 */
'use strict';

const rutjs = require('rutjs'),
      rutInfo = require('info-rut'),
      rutStatus = require('rut-status'),
      uuid = require('uuid');

module.exports = function(socketio) {
  var nspRut = socketio.of('/rutificador');

  nspRut.on('error', function(err) {
    console.log('CatchError A:', err);
  });

  nspRut.on('connection', function(socket) {
    socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;
    socket.connectedAt = new Date();

    socket.log = function(message, data, logType) {
      logType = typeof logType !== 'undefined' ? logType : 'log';
      console[logType](`SocketIO ${socket.nsp.name} [${socket.address}] - ${message}`, JSON.stringify(data, null, 2));
    };

    socket.emitError = function(message, data) {
      socket.log(message, data, 'error');
      socket.to(socket.id).emit('throw error', {code: 500, message: message, data: data});
    };

    socket.on('error', function(err, next) {
      console.log('CatchError B:', err);
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
      console.log("Socket ID:", socket.id);
      socket.log("Rut Info Requested.", data);
      if (data && data.rut) {
        rutInfo.getFullName(data.rut)
          .then(function(resp) {
            var splitName = resp.split(' '),
                name = {
                  name: splitName[2] + ' ' + splitName[3],
                  pname: splitName[0],
                  mname: splitName[1]
            };
            socket.emit('rut info resp', {rut:data.rut, name:name});
            socket.log("Rut Info Emited.", resp);
          }).catch(function(err) {
            //socket.emitError('Response Error', err);
            socket.emit('throw error', {code: 500, message: 'Response Error', data: err});
          });
      } else {
        socket.emitError('Data is not valid', data);
      }
    });
  });
}
