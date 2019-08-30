//////////////////////////////////////////////////////////////////////
// Admin Server
//////////////////////////////////////////////////////////////////////
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

const appConfig = require('../../config/app.config');

const Adminer = require('../core/adminer')(
  appConfig.EventMapFile , 
  appConfig.Logging
);

////////////////////////////////////////////////////////////////////////

Server.use('/', express.static('./src/adminer/public'));

////////////////////////////////////////////////////////////////////////

Server.get('/event-map', Adminer.getEventMap.bind(Adminer));

Server.post('/event-map', Adminer.saveEventMap.bind(Adminer));

////////////////////////////////////////////////////////////////////////

Server.get('/activity', Adminer.getActivity.bind(Adminer));

////////////////////////////////////////////////////////////////////////
const HOSTNAME = "127.0.0.1";
const PORT = "4000";
Server.listen(PORT, HOSTNAME, function () {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});