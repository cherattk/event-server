/**
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/' , express.static(__dirname + '/frontend'));

// const EventManager = require('./service/event-manager')();
// app.route('/entity')
//   .all(EventManager.checkQueryType.bind(EventManager))
//   .get(EventManager.getEntity.bind(EventManager))
//   .post(EventManager.registerEntity.bind(EventManager))
//   .delete(EventManager.removeEntity.bind(EventManager));

// 2 -  run the server
const hostname = 'localhost';
const port = 4000;

app.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

