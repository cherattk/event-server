/**
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const express = require('express');
const Server = express();

const cors = require('cors');
Server.use(cors());

const cookieParser = require('cookie-parser');
Server.use(cookieParser());

// const bodyParser = require('body-parser');
const bodyParser = require('body-parser');
Server.use(bodyParser.urlencoded({ extended: true }));



/******************************************************************
 * Adminer *
*******************************************************************/
Server.use('/', express.static('./src/adminer/public'));
const AuthUser = require("./adminer/server/auth-user")();
const Adminer = require('./adminer/server/adminer')();

// ===========================================================

/**
 * Admin Authentication
 */
Server.post('/user_token', function (Request, Response) {

  var user_token = Request.body.user_token;

  if (AuthUser.isValidUserToken(user_token)) {
    Response.status(200).json({
      user_token: AuthUser.setAuthToken()
    });
  }
  else {
    Response.status(400).json({
      message: 'bad authentication data'
    });
  }
});

Server.post('/login', function (Request, Response) {

  var user_password = Request.body.password;

  if (AuthUser.validatePassword(user_password)) {
    Response.status(200).json({
      user_token: AuthUser.setAuthToken()
    });
  }
  else {
    Response.status(400).json({
      message: 'bad authentication data'
    });
  }

});

Server.post('/logout', function (Request, Response) {

  var user_token = Request.body.user_token;
  if (AuthUser.isValidUserToken(user_token)) {
    AuthUser.removeAuthToken();
    Response.status(200).json({
      message: 'successfully logged out'
    });
  }
  else {
    Response.status(400).json({
      message: 'bad authentication data'
    });
  }

});


/**
 * Setting EventMap
 */
Server.get('/event-map', Adminer.getEventMap.bind(Adminer));

Server.post('/eventmap/entity', Adminer.setEntity.bind(Adminer));
Server.delete('/eventmap/entity', Adminer.removeEntity.bind(Adminer));


/**
 * Activity
 */
Server.get('/activity', Adminer.getActivity.bind(Adminer));

/******************************************************************
 * DISPATCHER *
*******************************************************************/

const Dispatcher = require('./dispatcher/dispatcher');

Server.post('/dispatch', function (Request, Response) {
  const AuthService = require("./dispatcher/auth-service")();
  var service_token = Request.header("Authorization").substr("Bearer".length).trim();
  console.log(service_token);
  if (AuthService.isValidServiceToken(service_token)) {
    Dispatcher.dispatch(Request, Response);
  }
  else {
    Response.status(401).end();
  }
});


/* RUN SERVER */
const hostname = "localhost";
const port = "8080";

Server.listen(port, hostname, function () {
  console.log(`
  ========================================================================
  Scope running at http://${hostname}:${port}/
  ========================================================================
  `);

});