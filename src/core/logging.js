/**
 * @module Logging
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


/**
 * Async Logging
 */

const defaultLog = function () {
  return {
    log_id: new Date().getTime(),
    log_time: new Date().toISOString()
  }
}

function Logging(driver) {

  const _Driver = driver;

  /**
   * live event is a valid event with the a message
   */
  this.infoEvent = function (content) {
    let _log = defaultLog();
        _log.log_type = 'event';
        _log.content = content;
    return _Driver.insert(_log);
  }

  this.errorInvalidEvent = function (content) {
    let _log = defaultLog();
        _log.log_type = 'invalid-event';
        _log.content = content;
    return _Driver.insert(_log);
  }

  this.erroBadRequest = function (content) {
    let _log = defaultLog();
        _log.log_type = 'bad-request';
        _log.content = content;
    return _Driver.insert(_log);
  }

  this.errorDispatch = function (content) {
    let _log = defaultLog();
        _log.log_type = 'dispatch-error';
        _log.content = content;
    return _Driver.insert(_log);
  }

  this.fetch = function (criteria) {
    return _Driver.fetch(criteria);
  }
}

module.exports = function(config){
  return new Logging(config);
}