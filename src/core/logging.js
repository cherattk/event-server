/**
 * @module Logging
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


/**
 * Async Logging
 */

const logFormat = function (_type , content) {
  return {
    type: _type,
    id: new Date().getTime(),
    time: new Date().toISOString(),
    content : Object.assign({} , content)
  }
}

function _Logging(driver) {

  const _Driver = driver;

  /**
   * live event is a valid event with the a message
   */
  this.infoEvent = function (_liveEvent) {
    let _log = logFormat('event' ,_liveEvent);
    return _Driver.insert(_log);
  }

  this.errorInvalidEvent = function (content) {
    let _log = logFormat('error' , content);
        _log.error_type = 'invalid-event';
    return _Driver.insert(_log);
  }

  this.erroBadRequest = function (content) {
    let _log = logFormat('error' , content);
        _log.error_type = 'bad-request';
    return _Driver.insert(_log);
  }

  this.errorDispatch = function (content) {
    let _log = logFormat('error' , content);
        _log.error_type = 'dispatch-error';
    return _Driver.insert(_log);
  }

  this.fetch = function (criteria) {
    return _Driver.find(criteria);
  }
}

module.exports = function(config){
  return new _Logging(config);
}