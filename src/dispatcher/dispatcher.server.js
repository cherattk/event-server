/**
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

const express = require('express');
const Server = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
Server.use(cors());
Server.use(cookieParser());
Server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/************************************************************
 * Configuration *
**************************************************************/

const path = require('path');

const _Logger = require('../../src/shared/logger');

const eventMapFilePath = path.resolve('./config/eventmap.json');
const MapLoader = require('../../src/dispatcher/maploader');
const _eventMap = MapLoader.ListenerMapLoader(eventMapFilePath);

const _HttpClient = require('axios');

/************************************************************
 * CONTROLLER *
**************************************************************/

const AuthService = require("../shared/auth-service")();

const Dispatcher = require('./dispatcher')(
  _eventMap,
  _Logger,
  _HttpClient
);

// ===========================================================
Server.use('/', function(Request , Response , Next) {

  // todo log request activity
  // var service_token = Request.header("Authorization").substr("Bearer".length).trim();
  // console.log(service_token);
  // if(AuthService.validateServiceToken(service_token)){
  //   Next();    
  // }
  // else{
  //   Response.status(401).end();
  // }

});

// ==========================================================
Server.post('/dispatch', function (Request , Response) {
  Dispatcher.dispatch(Request , Response);
});


/* RUN SERVER */
const hostname =  "127.0.0.1";
const port = "3030";

Server.listen(port, hostname, function () {
  console.log(`
  ========================================================================
  Event-Dispatcher running at http://${hostname}:${port}/
  ========================================================================
  `);

});