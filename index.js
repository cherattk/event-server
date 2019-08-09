/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const path = require('path');
const express = require('express');
const App = express();

// middleware
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
App.use(cors());
App.use(cookieParser());
App.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const RequestPromiseNative = require('request-promise-native');
const dbName = 'event_db';
const dbDriver = require('nano')({
  url: `http://localhost:5984/${dbName}`
});

const Logging = require('./src/core/logging')(dbDriver);

const EventDispatcher = require('./src/core/event-dispatcher');

const EventMapFile = path.resolve('./src/config/event-map.json');

const hostname = "127.0.0.1";
const port = "3000";

const dispatcher = new EventDispatcher(
  EventMapFile,
  RequestPromiseNative,
  Logging
);

App.use('/admin', express.static('./src/public'));

App.get('/event-map', function(request , response){
  const fs = require('fs');
  fs.readFile(EventMapFile, "utf8" , (error , data) => {
    response.json(JSON.parse(data));
  });
});

// dispatcher endpoint
App.post('/dispatch', dispatcher.dispatchEvent.bind(dispatcher));

App.listen(port, hostname, function (a, b, c) {
  console.log(a, b, c);
  console.log(`Server running at http://${hostname}:${port}/`);
});