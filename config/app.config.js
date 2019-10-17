const path = require('path');

const db_address = `http://localhost:5984/event_db`;

const loggingDriver = require('../src/driver/couchdb')(db_address);

const Logging = require('../src/core/logging')(loggingDriver);

// PROD
// const EventMapFile = path.resolve('./config/data-eventmap.json');

// DEV
const EventMapFile = path.resolve('./dev/dev-data-eventmap.json');

module.exports = { Logging ,  EventMapFile };