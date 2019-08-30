const path = require('path');

const couchDBDriver = require('nano');
const dbName = 'event_db';
const loggingDriver = couchDBDriver(`http://localhost:5984/${dbName}`);
const Logging = require('../src/core/logging')(loggingDriver);

const EventMapFile = path.resolve('./dev/dev-data-event-map.json');

module.exports = {
  Logging , 
  EventMapFile
};