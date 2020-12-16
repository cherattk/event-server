const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const path = require('path');
const fs = require('fs');

const AuthDataFile = path.resolve('./config/auth.json');

module.exports = function () {

  return new (function AuthService() {

    this.isValidServiceToken = function (service_token) {

      // check token in database
      return !!service_token;
    }

  });
  
}