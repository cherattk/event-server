/**
 * @module Activity
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

/**
 * Async Activity
 */

module.exports = function Activity(driver) {

  const __driver = driver;

  this.Insert = function (__logData) {
    return __driver.insertData(__logData);
  }

  this.Fetch = function (__crtieria) {
    return __driver.fetchData(__crtieria);
  }

}
