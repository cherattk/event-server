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
// Server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
Server.use(bodyParser.json()); // support encoded bodies

/************************************************************
 * CONTROLLER *
**************************************************************/

const path = require('path');

const AuthUser = require("../../shared/auth-user")();

const _Logger = require('../../shared/logger');

const _eventMapFilePath = path.resolve('./config/eventmap.json');

const Adminer = require('./adminer')(
  _eventMapFilePath ,
  _Logger
);


// ==========================================================
Server.use('/', express.static('./src/adminer/public'));

// ===========================================================
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


/* RUN SERVER */
const hostname = "127.0.0.1";
const port =  "8080";
Server.listen(port, hostname, function () {
  console.log(`
  ========================================================================
  Eventset/Adminer running at http://${hostname}:${port}/
  ========================================================================
  `
  );
});