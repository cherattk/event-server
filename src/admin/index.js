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

const EventManager = require('../admin/event-manager')();
App.route('/entity')
  .all(EventManager.checkQueryEntity.bind(EventManager))
  .get(EventManager.getEntity.bind(EventManager))
  .post(EventManager.registerEntity.bind(EventManager))
  .delete(EventManager.removeEntity.bind(EventManager));

// 2 -  run the server
const hostname = 'localhost';
const port = 4000;

App.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

