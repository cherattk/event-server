/**
 * @module DispatcherLog
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

/**
 * Log For Dispatcher
 */


function DispatcherLog() {

  const __defaultLog = function () {
    let time = new Date().getTime();
    return {
      log_id: time,
      log_time:time,
      log_emitter : 'dispatcher'
    }
  }

  /**
   * Log Valid event
   */
  this.EventInfo = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'event';
    _log.content = content;
    return _log;
  }

  this.ErrorApp = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'application-error';
    _log.content = content;
    return _log;
  }

  this.ErrorInvalidEvent = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'invalid-event';
    _log.content = content;
    return _log;
  }

  this.ErrorBadRequest = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'bad-request';
    _log.content = content;
    return _log;
  }

  this.ErrorDispatch = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'dispatch-error';
    _log.content = content;
    return _log;
  }
}

module.exports = new DispatcherLog();