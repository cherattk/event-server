/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const App = require('express')();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// middleware
App.use(cors());
App.use(cookieParser());
App.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

App.get('/test', function (Request, Response) {
});

const EventDispatcher = require('./server/event-dispatcher')();
App.post('/', EventDispatcher.dispatchEvent.bind(EventDispatcher));

// 2 -  run the server
const hostname = 'localhost';
const port = 3000;

App.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

