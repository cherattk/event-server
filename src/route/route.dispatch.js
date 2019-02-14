/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const express = require('express'),
  Router = express.Router();

const Controller = require('../core/controller.js'),
  ctrl = new Controller();

// Route : /dispatch
Router.post('/', function (Request, Response) {

  var params = Object.assign({}, Request.body);
  var ok = ctrl.validRequestParam(params , [
    "event" , "message"
  ]);

  if (!ok) {
    Response.status(401).end();
    return;
  }

  var response = ctrl.dispatchEvent(
                  params.event_id,
                  params.message
                );

  // success
  Response.status(200).send({ response: response });

});

module.exports = Router;

