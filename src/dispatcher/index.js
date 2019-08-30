//////////////////////////////////////////////////////////////////////
// Dispatcher Server
///////////////////////////////////////////////////////////////////////
/**
 * @copyright Copyright (c) 2018 cheratt karim
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

//////////////////////////////////////////////////////////////////////

const appConfig = require('../../config/app.config');
const RequestPromise = require('request-promise-native');

const EventDispatcher = require('../core/event-dispatcher').EventDispatcher;
const Dispatcher= EventDispatcher(
  appConfig.EventMapFile,
  RequestPromise,
  appConfig.Logging
);
//////////////////////////////////////////////////////////////////////

Server.post('/dispatch', Dispatcher.dispatchEvent.bind(Dispatcher));


//////////////////////////////////////////////////////////////////////
const HOSTNAME = "127.0.0.1";
const PORT = "3000";
Server.listen(PORT, HOSTNAME, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});