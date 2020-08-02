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

const bodyParser = require('body-parser');
Server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/************************************************************
 * Configuration *
**************************************************************/

const path = require('path');

const _Logger = require('../shared/logger')();

const eventMapFilePath = path.resolve('./config/eventmap.json');
const MapLoader = require('./maploader');
const _eventMap = MapLoader.ListenerMapLoader(eventMapFilePath);

const _HttpClient = require('axios');

/************************************************************
 * CONTROLLER *
**************************************************************/
const Dispatcher = require('./dispatcher')(
  _eventMap,
  _Logger,
  _HttpClient
);

// ===========================================================
// const AuthService = require("../shared/auth-service")();
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

Server.get('/', function (Request, Response) {

  Response.status(200).end('Hi');
});

// ==========================================================
Server.post('/dispatch', function (Request , Response) {
  Dispatcher.dispatch(Request , Response);
  console.log('test');
});


/* RUN SERVER */
const hostname = "localhost";
const port = "5000";

Server.listen(port, hostname, function () {
  console.log(`
  ========================================================================
  Event-Dispatcher running at http://${hostname}:${port}/
  ========================================================================
  `);

});