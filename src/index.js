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

/******************* CONTROLLER *******************************/
const Authenticate = require("./core/authentication")();

const appConfig = require('../config/app.config');
const Adminer = require('./core/adminer')(
  appConfig.EventMapFile , 
  appConfig.Logging
);
const RequestPromise = require('request-promise-native');
const EventDispatcher = require('./core/event-dispatcher').EventDispatcher;
const Dispatcher = EventDispatcher(
  appConfig.EventMapFile,
  RequestPromise,
  appConfig.Logging
);

/**************** ADMINER ************************************/
Server.use('/', express.static('./src/adminer/public'));

Server.post('/auth_token', function(Request , Response) {

  var user_token = Request.body.auth_token;

  if(Authenticate.validateAuthToken(user_token)){
    Authenticate.setAuthToken(function(token_hash){
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

  if(Authenticate.validatePassword(user_password)){
      Authenticate.setAuthToken(function(token_hash){
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
  if(Authenticate.validateAuthToken(user_token)){
    Authenticate.removeAuthToken(function(){
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


/***************** DISPATCHER ************************************/
Server.post('/dispatch', Dispatcher.dispatchRequestController.bind(Dispatcher));


/* RUN SERVER */
Server.listen(appConfig.port, appConfig.hostname, function () {
  console.log(`EventDispatcher running at http://${appConfig.hostname}:${appConfig.port}/`);
});