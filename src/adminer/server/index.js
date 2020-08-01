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

const config = require('../../../config/app.config');

const Authenticate = require("../../core/authentication")();

const Adminer = require('../../core/adminer')(
  config.eventMapFilePath ,
  config.Logger
);


// ==========================================================
Server.use('/', express.static('./src/adminer/public'));

// ===========================================================
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


/* RUN SERVER */
Server.listen(config.adminer.port, config.adminer.hostname, function () {
  console.log(`
  ========================================================================
  Eventset/Adminer running at http://${config.adminer.hostname}:${config.adminer.port}/
  ========================================================================
  `
  );
});