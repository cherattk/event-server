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

const _Logger = require('../../shared/logger');

const _eventMapFilePath = path.resolve('./config/eventmap.json');


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