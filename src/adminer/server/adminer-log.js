/**
 * @module AdminerLog
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

/**
 * Async AdminerLog
 */


const defaultDriver = {
  insert: function (data) {
    var p = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          let dataString = JSON.stringify(data);
          resolve(dataString);
        } catch (error) {
          reject( error, data );
        }
      } , 0);
    });
    return p;
  }
}

const __defaultLog = function () {
  let time = new Date().getTime();
  return {
    log_id: time,
    log_time: time,
    log_domain : 'adminer'
  }
}

function AdminerLog(driver) {

  const __driver = driver || defaultDriver;

  this.insert = function (_logObj) {
    __driver.insert(_logObj).then(function(resultAsString){
      console.log(resultAsString);
    });
  }

  /**
   * Log Valid event
   */
  this.eventInfo = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'info';
    _log.content = content;
    this.insert(_log);
  }

  this.errorApp = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'application-error';
    _log.content = content;
    this.insert(_log);
  }

  this.errorInvalidEvent = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'invalid-event';
    _log.content = content;
    this.insert(_log);
  }

  this.errorBadRequest = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'bad-request';
    _log.content = content;
    this.insert(_log);
  }

  this.errorDispatch = function (content) {
    let _log = __defaultLog();
    _log.log_type = 'error';
    _log.error_type = 'dispatch-error';
    _log.content = content;
    this.insert(_log);
  }
}

module.exports = function (config) {
  return new AdminerLog(config);
}