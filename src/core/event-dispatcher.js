/**
 * @module EventDispatcher
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */


/**
 * 
 * @param {string} filePath
 * @returns {Map<id , event>}
 */
function loadListenerMap(filePath) {
  // Map <event_id , eventObject>
  const EventListenerMap = {
    event: new Map(),
    listener: new Map()
  };
  try {
    const jsonContent = require(filePath);
    jsonContent.event.map(function (event) {
      // Set event map Map<id , eventObject>
      EventListenerMap.event.set(event.id, event);
      // Set event map Map<id , listenerArray>
      var listenerArray = jsonContent.listener.filter(function (listener) {
        return event.id === listener.event_id;
      });
      EventListenerMap.listener.set(event.id, listenerArray);
    });
  } catch (error) {
    // console.error(error);
  }

  return EventListenerMap;
}

function __EventDispatcher(mapFilePath, HttpClient, Logging) {

  const _eventMap = loadListenerMap(mapFilePath);

  this.getListener = function (event_id) {
    var event = _eventMap.event.size > 0 /* if not empty map */
      && _eventMap.event.has(event_id);
    if (event) {
      return _eventMap.listener.get(event_id);
    }
    return [];
  };

  /**
   * check if query has a valid field : {event_id , message}
   * @param
   */
  this.validRequest = function (query) {
    const valid = (typeof query.event_id !== "undefined" && query.event_id)
      &&
      (typeof query.message !== "undefined" && !!query.message);

    return valid;
  };

  this.dispatchEvent = function (event_id, eventMessage) {

    var _eventObject = _eventMap.event.get(event_id);
    // - LOG THE SUCCESSFULLY-PUBLISHED EVENT
    Logging.infoEvent({
      event: _eventObject,
      event_message: eventMessage
    });

    var dispatchBody = {
      event_name : _eventObject.event_name,
      event_message : eventMessage
    }

    var listListener = this.getListener(event_id);
    for (let idx = 0, max = listListener.length; idx < max; idx++) {
      HttpClient.post({
        url: 'http://' + listListener[idx].endpoint,
        form: {event : dispatchBody},
        // form: dispatchBody,
        timeout: 1500
      }).catch(function (dispatchError) {
        Logging.errorDispatch({
          event: _eventObject,
          listener: listListener[idx],
          error: dispatchError.message, // error message from node.js
        });
      });
    } // end loop
  }

  this.dispatchRequestController = function (Request, Response) {

    var requestBody = Object.assign({}, Request.body);
    var event_id = requestBody.event_id;
    var eventMessage = requestBody.message;

    if (!this.validRequest(requestBody)) {
      // - LOG BAD REQUEST
      Logging.erroBadRequest(requestBody);
      Response.status(400).end();
      return;
    }
    // - CHECK IF IS A VALID EVENT
    if (!_eventMap.event.has(event_id)) {
      Logging.errorInvalidEvent(requestBody);
      Response.status(400).end();
      return;
    }
    
    this.dispatchEvent(event_id , eventMessage);

    Response.status(200).end();
  }

};


module.exports = {
  loadListenerMap,
  EventDispatcher: function (mapFile, HttpClient, Logging) {
    return new __EventDispatcher(mapFile, HttpClient, Logging);
  }
};
