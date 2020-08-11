/**
 * @module Dispatcher
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */


const queryString = require('querystring');

const LogFormat = require('./dispatcher-log');

function Dispatcher(eventMap, Activity, HttpClient) {

  const _eventMap = eventMap;

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
    var _cpEvent = Object.assign({ message: eventMessage }, _eventObject);

    // save event data
    Activity.Insert(LogFormat.EventInfo(_cpEvent)).catch(function(err) {
      console.log('===== insert event info error =====');
      console.log(err);
      console.log('=====================================');
    });;

    var dispatchBody = {
      event_id: event_id,
      event_name: _cpEvent.event_name,
      event_message: _cpEvent.message
    };

    var listListener = this.getListener(event_id);

    // var _data = queryString.stringify({ event : dispatchBody });
    var _data = queryString.stringify(dispatchBody);

    for (let idx = 0, max = listListener.length; idx < max; idx++) {
      var _endpointURL = listListener[idx].endpoint;
      HttpClient(
        {
          method: 'POST',
          url: _endpointURL,
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          data: _data
        }
      ).catch(function (dispatchError) {
        // - LOG THE DISPATCHING ERROR
        Activity.Insert(LogFormat.ErrorDispatch({
          event: _cpEvent,
          listener: listListener[idx],
          error: dispatchError.message, // error message from node.js
        }));
      });


    } // end loop
  }

  this.dispatch = function (Request, Response) {

    var requestBody = Object.assign({}, Request.body);
    var event_id = requestBody.event_id;
    var eventMessage = requestBody.message;

    if (!this.validRequest(requestBody)) {
      // - LOG BAD REQUEST
      Activity.Insert(LogFormat.ErrorBadRequest(requestBody));
      Response.status(400).end();
      return;
    }
    // - CHECK IF IS A VALID EVENT
    if (!_eventMap.event.has(event_id)) {
      Activity.Insert(LogFormat.ErrorInvalidEvent(requestBody));
      Response.status(400).end();
      return;
    }

    this.dispatchEvent(event_id, eventMessage);

    Response.status(200).end();
  }

};


module.exports = function (eventMap, Activity, HttpClient) {
  return new Dispatcher(eventMap, Activity, HttpClient);
}
