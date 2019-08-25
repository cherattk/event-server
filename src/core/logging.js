/**
 * @module Logging
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */


/**
 * Async Logging
 */

const logFormat = {

  getErrorFormat: function () {
    return {
      type: 'error',
      id: new Date().getTime(),
      time: new Date().toISOString(),
      error_type = ''
    }
  },

  getEventFormat: function (liveEvent) {
    return {
      type: 'event',
      id: new Date().getTime(),
      time: new Date().toISOString(),
      content: Object.assign({}, liveEvent)
    };
  }
};

module.exports = function Logging(driver) {

  const _Driver = driver;

  /**
   * live event is a valid event with the a message
   */
  this.infoEvent = function (_liveEvent) {
    let _log = logFormat.getEventFormat(_liveEvent);
    return _Driver.insert(_log);
  }

  this.errorInvalidEvent = function (requestBody) {
    let _log = logFormat.getErrorFormat(requestBody);
        _log.error_type = 'invalid-event';
        _log.body = requestBody;
    return _Driver.insert(_log);
  }

  this.erroBadRequest = function (requestBody) {
    let _log = logFormat.getErrorFormat(requestBody);
        _log.error_type = 'bad-request';
        _log.body = requestBody;
    return _Driver.insert(_log);
  }

  this.errorDispatch = function (requestBody) {
    let _log = logFormat.getErrorFormat(requestBody);
        _log.error_type = 'dispatch-error';
        _log.body = requestBody;
    return _Driver.insert(_log);
  }

  this.fetch = function (criteria) {
    return _Driver.find(criteria);
  }

}