/**
 * Log4Node configuration
 */
'use strict';

var envConfig = require('./environment'),
    debug = require('debug');

function LoggerPrinter(type, client) {
  this.type = type;
  this.client = client;
  this.print = function(message) {
    if(message instanceof Error) {
      this._printError(message);
    } else if (message instanceof String || typeof message === "string") {
      this._printString(message);
    }
  };
  this._printError = function(err) {
    if(this.type === "prod") {
      console.error("Sending error to raven:", err);
      this.client.error(err);
    } else {
      this.client(err);
    }
  };
  this._printString = function(message) {
    if(this.type === "prod") {
      console.log("Sending message to raven:", message);
      this.client.log(message);
    } else {
      this.client(message);
    }
  };
}

function Logger(config) {
  this._loggerName = config.name;
  if(envConfig.env === 'development' || envConfig.env === 'test') {
    this._printer = new LoggerPrinter("dev", debug(this._loggerName));
  } else {
    //raven.client.setTagsContext({ loggerName: this._loggerName });
    //this._printer = new LoggerPrinter("prod", raven.client);
    this._printer = new LoggerPrinter("prod", console);
  }
  this.error = function(message) {
    this._printMessage("Error", message);
  };
  this.info = function(message) {
    this._printMessage("Info", message);
  };
  this.debug = function(message) {
    this._printMessage("Debug", message);
  };
  this._printMessage = function(type, horror) {
    this._printer.print(horror);
  };
}

module.exports = function(config) {
  return new Logger(config);
};
