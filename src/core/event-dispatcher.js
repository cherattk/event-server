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
    event : new Map(),
    listener : new Map()
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

  this.dispatchEvent = function (Request, Response) {

    var requestBody = Object.assign({}, Request.body);

    if (this.validRequest(requestBody)) {

      if (_eventMap.event.has(requestBody.event_id)) {
        var currentEvent = _eventMap.event.get(requestBody.event_id);
        Logging.infoEvent({
          event: currentEvent,
          event_message: requestBody.message
        });

        var _Listener = this.getListener(requestBody.event_id);
        for (let idx = 0, max = _Listener.length; idx < max; idx++) {

          HttpClient.post({
            url: _Listener[idx].endpoint,
            form: JSON.stringify(requestBody.message)
          })
          .catch((dispatchError) => {
            Logging.errorDispatch({
              event: currentEvent,
              listener: _Listener[idx],
              error: dispatchError,
            });
          });

        } // end loop

        Response.status(200).end();
      }
      else {
        Logging.errorInvalidEvent(requestBody);
        Response.status(400).end();
      }
    }
    else {
      Logging.erroBadRequest(requestBody);
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
