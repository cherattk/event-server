const path = require('path');

const Logging = require('../src/core/logging');

const loggingDriver = require('../src/driver/couchdb')('http://localhost:5984/event_db');

// PROD
const EventMapFile = path.resolve('./config/data-eventmap.json');

module.exports = {
  Logging: Logging(loggingDriver),
  EventMapFile,
  HOSTNAME: "127.0.0.1", PORT: "8080"
};