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


/***************************************************************
 * DEPENDENCIES *
****************************************************************/

const path = require('path');

const _HttpClient = require('axios');

const _Logger = require('./shared/logger')();
const eventMapFilePath = path.resolve('./config/eventmap.json');
const MapLoader = require('./shared/maploader');
const _eventMap = MapLoader.ListenerMapLoader(eventMapFilePath);


/****************************************************************
 * ADMINER *
*****************************************************************/
const Adminer = require('./adminer/server/adminer')(
  _eventMapFilePath ,
  _Logger
);

Server.use('/', express.static('./adminer/public'));

Server.post('/auth_token', function(Request , Response) {

  var user_token = Request.body.auth_token;

  if(AuthUser.validateAuthToken(user_token)){
    AuthUser.setAuthToken(function(token_hash){
      Response.status(200).json({
        auth_token : token_hash
      });
    });    
  }
  else{
    Response.status(400).end();
  }

});

Server.post('/login', function(Request , Response) {
  
  var user_password = Request.body.password;

  if(AuthUser.validatePassword(user_password)){
      AuthUser.setAuthToken(function(token_hash){
        Response.status(200).json({
          auth_token : token_hash
        });      
    });
  }
  else{
    Response.status(400).end();
  }

});


Server.post('/logout', function(Request , Response) {
  
  var user_token = Request.body.auth_token;
  if(AuthUser.validateAuthToken(user_token)){
    AuthUser.removeAuthToken(function(){
      Response.status(200).json({
        success : true
      });
    });    
  }
  else{
    Response.status(400).end();
  }

});

Server.get('/event-map', Adminer.getEventMap.bind(Adminer));

Server.post('/event-map', Adminer.saveEventMap.bind(Adminer));

Server.get('/activity', Adminer.getActivity.bind(Adminer));


/******************************************************************
 * DISPATCHER *
*******************************************************************/
const Dispatcher = require('./dispatcher/dispatcher')(
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
const port = "8080";

Server.listen(port, hostname, function () {
  console.log(`
  ========================================================================
  Scope running at http://${hostname}:${port}/
  ========================================================================
  `);

});