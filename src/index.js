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

Server.get('/adminer/event-map', Adminer.getEventMap.bind(Adminer));

Server.post('/adminer/event-map', Adminer.saveEventMap.bind(Adminer));

Server.get('/adminer/activity', Adminer.getActivity.bind(Adminer));


/***************** DISPATCHER ************************************/
Server.post('/dispatch', Dispatcher.dispatchRequestController.bind(Dispatcher));


/* RUN SERVER */
const HOSTNAME = "127.0.0.1";
const PORT = "3000";
Server.listen(PORT, HOSTNAME, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});