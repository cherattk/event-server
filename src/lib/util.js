/**
 * @module Util
 * @copyright Copyright (c) 2018-2019 cheratt karim
 * @license MIT Licence
 */

const fs = require('fs');

const Util = {

  /**
   * Convert input string to lowercase and remove whitespaces and slashes
   * 
   * @param {string} value to clean 
   */
  clean: function (input) {
    if (!this.isString(input)) {
      var errorMsg = `
      Util.clean() : input argument must be of type string 
      ${typeof input} type given `;
      throw new TypeError(errorMsg);
    }
    return input.trim().toLowerCase().replace(/\s+/g, "-");
  },

  /**
   * 
   * @param {string} input
   */
  isString: function (input) {
    return (typeof input === 'string' && input !== '');
  },

  /**
   * Generate Uniq ID
   * 
   * @return {string} unique ID
   */

  generateID: function () {
    return (new Date()).getMilliseconds().toString();
  }
}

module.exports = Util;