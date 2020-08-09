const fs = require('fs');

/**
 * @module DispatcherMapLoader
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */

/**
 * Load EventMap for Dispatcher
 * 
 * note : do note use with Adminer
 * 
 * @param {string} filePath
 * @returns {Map<id , event>}
 */
function DispatcherMapLoader(filePath) {
  // Map <event_id , eventObject>
  const EventListenerMap = {
    event: new Map(),
    listener: new Map()
  };

  var jsonContent;
  try {
    jsonContent = require(filePath);
  } catch (error) {

    console.error(error);
    console.log(' ============================ ');
    console.log(' initialize a new eventmap    ');
    console.log(' ============================ ');
    jsonContent = {
      service: [],
      event: [],
      listener: []
    }
    var _jsonContentToSave = JSON.stringify(jsonContent);
    fs.writeFile(filePath, _jsonContentToSave, 'utf8', function (error) {
      if (error) {
        console.error(error);
      }
    });
  }

  jsonContent.event.map(function (event) {
    // Set event map Map<id , eventObject>
    EventListenerMap.event.set(event.id, event);
    // Set event map Map<id , listenerArray>
    var listenerArray = jsonContent.listener.filter(function (listener) {
      return event.id === listener.event_id;
    });
    EventListenerMap.listener.set(event.id, listenerArray);
  });

  return EventListenerMap;
}

function EventMapLoader(params) {

}


module.exports = {
  DispatcherMapLoader
}
