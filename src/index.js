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


/***************************************************************
 * DEPENDENCIES *
****************************************************************/

const path = require('path');
const _eventMapFilePath = path.resolve('./src/config/eventmap.json');

const _HttpClient = require('axios');

const Activity = require('./lib/activity');
const MapLoader = require('./lib/maploader');
const _eventMap = MapLoader.DispatcherMapLoader(_eventMapFilePath);


/******************************************************************
 * Adminer *
*******************************************************************/

const AuthUser = require("./adminer/server/auth-user")();

const couchdbDriver = require('./lib/driver/couchdb');

const __couchConfig = "http://localhost:5984/event_db";
const __AdminerActivity = new Activity(new couchdbDriver(__couchConfig));

const Adminer = require('./adminer/server/adminer')(
  _eventMapFilePath,
  __AdminerActivity
);


// ==========================================================
Server.use('/', express.static('./src/adminer/public'));

// ===========================================================

/**
 * USer Authentication
 */
Server.post('/auth_token', function (Request, Response) {

  var user_token = Request.body.auth_token;

  if (AuthUser.validateAuthToken(user_token)) {
    Response.status(200).json({
      auth_token: AuthUser.setAuthToken()
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
      auth_token: AuthUser.setAuthToken()
    });
  }
  else {
    Response.status(400).json({
      message: 'bad authentication data'
    });
  }

});

Server.post('/logout', function (Request, Response) {

  var user_token = Request.body.auth_token;
  if (AuthUser.validateAuthToken(user_token)) {
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
 * EventMap Adminer
 */
Server.get('/event-map', Adminer.getEventMap.bind(Adminer));

Server.post('/eventmap/entity', Adminer.setEntity.bind(Adminer));
Server.delete('/eventmap/entity', Adminer.removeEntity.bind(Adminer));


/**
 * Activity reader
 */
Server.get('/activity', Adminer.getActivity.bind(Adminer));


/******************************************************************
 * DISPATCHER *
*******************************************************************/

const __DispatcherActivity = new Activity(new couchdbDriver(__couchConfig));
const Dispatcher = require('./dispatcher/dispatcher')(
  _eventMap,
  __DispatcherActivity,
  _HttpClient
);

// ===========================================================
// const AuthService = require("../lib/auth-service")();
// Server.use('/', function(Request , Response , Next) {
//   // todo log request activity
//   var service_token = Request.header("Authorization").substr("Bearer".length).trim();
//   console.log(service_token);
//   if(AuthService.validateServiceToken(service_token)){
//     Next();    
//   }
//   else{
//     Response.status(401).end();
//   }
// });

// ==========================================================
Server.post('/dispatch', function (Request, Response) {
  Dispatcher.dispatch(Request, Response);
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