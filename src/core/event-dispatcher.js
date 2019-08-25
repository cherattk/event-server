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
  const EventListenerMap = new Map();
  try {
    const jsonContent = require(filePath);
    jsonContent.event.map(function (event) {
      // 1- set Array of listeners into event object
      event.listener = jsonContent.listener.filter(function (listener) {
        return (listener.event_id === event.id);
      });
      // 2- set event object inot the Map<id , eventObject>
      EventListenerMap.set(event.id, event);
    });
  } catch (error) {
    // console.error(error);
  }

  return EventListenerMap;
}

function EventDispatcher(mapFilePath, HttpClient, Logging) {

  const _eventMap = loadListenerMap(mapFilePath);

  this.getListener = function (event_id) {
    var event = _eventMap.size > 0 /* if not empty map */ && _eventMap.get(event_id);
    if (event) {
      return event.listener;
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

  this.dispatchEvent = function (Request, Response) {

    var requestBody = Object.assign({}, Request.body);
    
    if (this.validRequest(requestBody)) {

      var _validEvent = _eventMap.get(requestBody.event_id);
      var _liveEvent = Object.assign({} , _validEvent , requestBody.message);

      if(_validEvent){
        Logging.infoEvent(_liveEvent);
      }
      else {
        Logging.errorInvalidEvent(requestBody);
      }

      const requestOption = { json: true };

      var _Listener = this.getListener(requestBody.event_id);
      for (let idx = 0, max = _Listener.length; idx < max; idx++) {

        requestOption.url = _Listener[idx].endpoint;
        requestOption.form = JSON.stringify(requestBody.message);

        HttpClient.post(requestOption).catch((dispatchError) => {
          Logging.errorDispatch({
            event : _liveEvent,
            listener : _Listener[idx],
            error: dispatchError,
          });
        });
      }

      Response.status(200).end();
    }
    else {
      Logging.erroBadRequest(requestBody);
      // bad requestBody
      Response.status(400).end();
    }
  };

};


module.exports = { loadListenerMap, EventDispatcher };
