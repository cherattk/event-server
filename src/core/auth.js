/**
 * @module Util
 * @copyright Copyright (c) 2018-2019 cheratt karim
 * @license MIT Licence
 */

const fs = require('fs');
const crypto = require('crypto');

const __sessionToken = new Set();

// for dev only
let testToken = crypto.createHash('md5').update("user-value.pass-value").digest("hex");
__sessionToken.add(testToken);

function Auth() {

  this.isAuthenticated = function (Request, Response, next) {

    var ok = false;

    if (Request.path !== "/login") {
      if (typeof Request.cookies.auth_token !== "undefined") {
        ok = this.checkAuthCookie(Request.cookies.auth_token);
        if (ok) {
          next();
        }
      } else {
        Response.status(401).end("you need to be authenticated");
      }
    } else {
      next();
    }
  }

  this.checkCredential = function (param) {

    var validParam = typeof param.user !== "undefined" &&
      typeof param.pass !== "undefined";

    if (validParam && this.credentialExist(param.user, param.pass)) {

      let data = (param.user + "." + param.pass);
      let token = crypto.createHash('md5').update(data).digest("hex");
      console.log(token);
      __sessionToken.add(token);
      return token;
    }

  }

  this.credentialExist = function (user, pass) {
    return (user === "user-value" &&
      pass === "pass-value");
  }

  this.checkAuthCookie = function (token) {

    return (__sessionToken.has(token));

  }

}

module.exports = new Auth();