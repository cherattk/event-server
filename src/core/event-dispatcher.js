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

function __EventDispatcher(mapFilePath, HttpClient, Logging) {

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
      
      if (_eventMap.has(requestBody.event_id)) {
        var _validEvent = _eventMap.get(requestBody.event_id);
        var _liveEvent = {
          event_name: _validEvent.event_name,
          event_id: requestBody.event_id,
          event_message: requestBody.message,
        };
        Logging.infoEvent(_liveEvent);

        var _Listener = this.getListener(requestBody.event_id);
        for (let idx = 0, max = _Listener.length; idx < max; idx++) {

          HttpClient.post({
            url: _Listener[idx].endpoint,
            form: JSON.stringify(requestBody.message)
          })
            .catch((dispatchError) => {
              Logging.errorDispatch({
                event: _liveEvent,
                listener: _Listener[idx],
                error: dispatchError,
              });
            });

        } // end loop

        Response.status(200).end();
      }
      else {
        Logging.errorInvalidEvent({
          request_body : requestBody
        });
        Response.status(400).end();
      }
    }
    else {
      Logging.erroBadRequest({
        request_body : requestBody
      });
      // bad requestBody
      Response.status(400).end();
    }
  };

};


module.exports = {
  loadListenerMap,
  EventDispatcher: function (mapFile, HttpClient, Logging) {
    return new __EventDispatcher(mapFile, HttpClient, Logging);
  }
};
