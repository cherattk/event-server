const path = require('path');

const Logger = require('../src/core/logger');

const eventMapFilePath = path.resolve('./config/eventmap.json');
const MapLoader = require('../src/core/maploader');
const _eventMap = MapLoader.ListenerMapLoader(eventMapFilePath);

module.exports = {
  Logger: Logger(),
  HttpClient : require('axios'),
  eventMap : _eventMap,
  eventMapFilePath : eventMapFilePath,
  adminer : {
    hostname: "127.0.0.1", port: "8080"
  },
  dispatcher : {
    hostname: "127.0.0.1", port: "3030"
  }
};