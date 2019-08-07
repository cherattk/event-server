/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const Express = require('express')();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// middleware
Express.use(cors());
Express.use(cookieParser());
Express.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const RequestPromiseNative = require('request-promise-native');

const dbName = 'event_db';
const dbDriver = require('nano')({
  url : `http://localhost:5984/${dbName}`
});

const Logging = require('../core/logging')(dbDriver);

const EventDispatcher = require('../core/event-dispatcher');

module.exports = function EventServer(config) {

  const {event_map_file , hostname , port} = config;

  const dispatcher = new EventDispatcher(
    event_map_file , 
    RequestPromiseNative , 
    Logging
  );

  // dispatcher endpoint
  Express.post('/', dispatcher.dispatchEvent.bind(dispatcher));
  
  const Server = Express.listen(port, hostname, function () {
    // console.log(`Server running at http://${hostname}:${port}/`);
    console.log(`Server running at http://${hostname}:${port}/`);
  });

  return Server;
}
