/**
 * @module Logging
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


/**
 * Async Logging
 */

const defaultLog = function () {
  let time = new Date().getTime();
  return {
    log_id: time,
    log_time: time
  }
}

function Logging(driver) {

  const __driver = driver;

  /**
   */

  __insert = function(log){
    if(__driver){
      return __driver.insert(log);
    }
  }

  __fetch = function(criteria){
    if(__driver){
      return __driver.fetch(criteria);
    }
  }

  ////////////////////////////////////////////////////////////////////

  /**
   * live event is a valid event with the a message
   */
  this.infoEvent = function (content) {
    let _log = defaultLog();
        _log.log_type = 'event';
        _log.content = content;
    return __insert(_log);
  }

  this.generalError = function (content) {
    let _log = defaultLog();
        _log.log_type = 'error';
        _log.error_type = 'generel-error';
        _log.content = content;
    return __insert(_log);
  }

  this.errorInvalidEvent = function (content) {
    let _log = defaultLog();
        _log.log_type = 'error';
        _log.error_type = 'invalid-event';
        _log.content = content;
    return __insert(_log);
  }

  this.erroBadRequest = function (content) {
    let _log = defaultLog();
        _log.log_type = 'error';
        _log.error_type = 'bad-request';
        _log.content = content;
    return __insert(_log);
  }

  this.errorDispatch = function (content) {
    let _log = defaultLog();
        _log.log_type = 'error';
        _log.error_type = 'dispatch-error';
        _log.content = content;
    return __insert(_log);
  }

  this.fetch = function (criteria) {
    return __fetch(criteria);
  }
}

module.exports = function(config){
  return new Logging(config);
}