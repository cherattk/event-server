/**
 * @module Activity
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


 /**
  * Log Dispatcher Event
  * 
  * @param {function} driverFactory return a ddrivre instance
  */

module.exports = function EventLog(driverFactory) {

  /**
   * driver.insertData() , 
   * driver.fecthData() 
   * MUST return promise object
   */
  const __driver = driverFactory();

  return {
    Insert : function Insert(__logData) {
      return __driver.insertData(__logData);
    },
  
    Fetch : function Fetch(__crtieria) {
      return __driver.fetchData(__crtieria);
    }
  }

}
