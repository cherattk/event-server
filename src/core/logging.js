/**
 * @module Persistence
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

module.exports = function(DBDriver) {

  const _dbDriver = DBDriver;

  return {
    
    query : (data) => {
      return _dbDriver.insert(data);
    },
    
    event : (data) => {
      return _dbDriver.insert(data);
    },
    
    error : (error) => {
      return _dbDriver.insert(error);
    },

    fetch : (criteria) => {
      return _dbDriver.get(criteria);
    }
  }
};