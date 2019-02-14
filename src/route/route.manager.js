/**
 * @license MIT Licence
 * @copyright Copyright (c) 2018 cheratt karim
 */

const express = require('express'),
  Router = express.Router();

const Controller = require('../core/controller.js'),
  ctrl = new Controller();


Router.post('/entity', ctrl.registerEntity);

Router.delete('/entity', ctrl.removeEntity);

Router.get('/entity', ctrl.getEntity);

module.exports = Router;

