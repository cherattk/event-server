const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const path = require('path');
const fs = require('fs');

const AuthDataFile = path.resolve('./config/data-auth.json');

function Authenticate() {

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

  this.validateAuthToken = function (user_token) {
    return (AUTH_DATA.auth_token && (AUTH_DATA.auth_token === user_token));
  };

  this.validatePassword = function (user_pass) {
    return (AUTH_DATA.password === user_pass);
  };

  /**
   * generate a new token hash for each call
   */
  this.setAuthToken = function (callback) {
    AUTH_DATA.auth_token = (new Date()).getTime().toString(16);
    this.saveAuthData(function (error) {
      if (error) {
        console.error(error);
      }
      callback(AUTH_DATA.auth_token);
    });
  };

  this.removeAuthToken = function (callback) {
    AUTH_DATA.auth_token = "";
    this.saveAuthData(function(error){
      if (error) {
        console.error(error);
      }
      callback();
    });
  };

  this.saveAuthData = function (callback) {
    var data = JSON.stringify(AUTH_DATA);
    fs.writeFile(AuthDataFile, data, 'utf8', function (error) {
      callback(error);
    });
  };
}

module.exports = function () {
  return new Authenticate();
}