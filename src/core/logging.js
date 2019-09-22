/**
 * @module Logging
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


/**
 * Async Logging
 */

const logFormat = function (_type) {
  return {
    type: _type,
    id: new Date().getTime(),
    time: new Date().toISOString()
  }
}

function Logging(driver) {

  const _Driver = driver;

  /**
   * live event is a valid event with the a message
   */
  this.infoEvent = function (_liveEvent) {
    let _log = logFormat('event');
        _log.event_content = _liveEvent;
    return _Driver.insert(_log);
  }

  this.errorInvalidEvent = function (content) {
    let _log = logFormat('error');
        _log.error_type = 'invalid-event';
        _log.error_content = content;
    return _Driver.insert(_log);
  }

  this.erroBadRequest = function (content) {
    let _log = logFormat('error');
        _log.error_type = 'bad-request';
        _log.error_content = content;
    return _Driver.insert(_log);
  }

  this.errorDispatch = function (content) {
    let _log = logFormat('error');
        _log.error_type = 'dispatch-error';
        _log.error_content = content;
    return _Driver.insert(_log);
  }

  this.fetch = function (criteria) {
    return _Driver.fetch(criteria);
  }
}

module.exports = function(config){
  return new Logging(config);
}