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
 * CONTROLLER *
**************************************************************/

const config = require('../../config/app.config');

const Authenticate = require("../core/authentication")();

const Dispatcher = require('./dispatcher')(
  config.eventMap,
  config.Logger,
  config.HttpClient
);

// ===========================================================
Server.use('/', function(Request , Response , Next) {

  // todo log request activity
  // var service_token = Request.header("Authorization").substr("Bearer".length).trim();
  // console.log(service_token);
  // if(Authenticate.validateServiceToken(service_token)){
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
Server.listen(config.dispatcher.port, config.dispatcher.hostname, function () {
  console.log(`
  ========================================================================
  Eventset/Dispatcher running at http://${config.dispatcher.hostname}:${config.dispatcher.port}/
  ========================================================================
  `);

});