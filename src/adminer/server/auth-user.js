const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const path = require('path');
const fs = require('fs');

const AuthDataFile = path.resolve('./src/config/auth.json');

function AuthUser() {

  var AUTH_DATA = { password: 'admin', auth_token: '' };

  fs.readFile(AuthDataFile, { encoding: 'utf8' }, function (error, data) {
    if (error) {
      console.error(error);
    }
    else {
      if (data) {
        AUTH_DATA = JSON.parse(data);
      }
    }
  });

  this.validateServiceToken = function (service_token) {
    return !!service_token;
  };

  this.validateAuthToken = function (user_token) {
    // return (AUTH_DATA.auth_token && (AUTH_DATA.auth_token === user_token));
    return true;
  };

  this.validatePassword = function (user_pass) {
    //return (AUTH_DATA.password === user_pass);
    return true;
  };

  /**
   * generate a new token hash for each call
   */
  this.setAuthToken = function () {

    // generate a new token
    AUTH_DATA.auth_token = (new Date()).getTime().toString(16);
    return AUTH_DATA.auth_token;
  };

  this.removeAuthToken = function () {
    AUTH_DATA.auth_token = (new Date()).getTime().toString(16);
  };

  this.saveAuthData = function (__data , callback) {
    var data = JSON.stringify(__data);
    fs.writeFile(AuthDataFile, data, 'utf8', callback);
  };
}

module.exports = function () {
  return new AuthUser();
}