const fs = require('fs');

/**
 * @module DispatcherEventMap
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */

/**
 * Load EventMap for Dispatcher
 * 
 * note : do note use with Adminer
 * 
 * @param {string} eventMapFilePath
 * @returns {Map<id , event>}
 */
module.exports = {

  DispatcherEventMap : function DispatcherEventMap(eventMapFilePath) {
    // Map <event_id , eventObject>
    const EventListenerMap = {
      event: new Map(),
      listener: new Map()
    };

    /**
     * deprecated, use another method to load EventMap File
     */
    var jsonContent = require(eventMapFilePath);
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
}
