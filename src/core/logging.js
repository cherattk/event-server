/**
 * @module Logging
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */


/**
 * Async Logging
 */

 const logFormat = {

   getErrorFormat : function(content){
     return {
       tag  : 'error',
       id : new Date().getTime(),
       time : new Date().toISOString(),
       error_type : '',
       content : Object.assign({}, content)
      };
    },
    
    getEventFormat : function(content){
      return {
        tag  : 'event',
        id : new Date().getTime(),
        time : new Date().toISOString(),
        content : Object.assign({}, content)
      };
    }
};

const Logging = function (driver) {

  const _Driver = driver;

  return {

    event: (event) => {
      let _log = Object.assign({}, event);
          _log.id = new Date().getTime();
          _log.time = new Date().toISOString();
          _log.tag = 'event';
      return _Driver.insert(_log);
    },

    errorInvalidEvent: (error) => {
      let _log = logFormat.getErrorFormat(error);
          _log.error_type = 'invalid-event';
      return _Driver.insert(_log);
    },

    errorBadQuery: (error) => {
      let _log = logFormat.getErrorFormat(error);
          _log.error_type = 'bad-query';
      return _Driver.insert(_log);
    },
    
    errorDispatching: (error) => {
      let _log = logFormat.getErrorFormat(error);
          _log.error_type = 'error-dispatching';
      return _Driver.insert(_log);
    },

    fetch: (criteria) => {
      return _Driver.find(criteria);
    }
  }
};

module.exports = Logging;