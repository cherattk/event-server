/**
 * @module Dispatcher
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */


function Dispatcher(eventMap , Logger , HttpClient) {

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
    var _cpEvent = Object.assign({message : eventMessage } , _eventObject);
    Logger.eventInfo(_cpEvent);

    var dispatchBody = {
      event_name: _cpEvent.event_name,
      event_message: _cpEvent.message
    }

    var listListener = this.getListener(event_id);
    for (let idx = 0, max = listListener.length; idx < max; idx++) {
      HttpClient.post({
        url: 'http://' + listListener[idx].endpoint,
        form: { event : dispatchBody },
        // form: dispatchBody,
        timeout: 1500
      }).catch(function (dispatchError) {
        // - LOG THE DISPATCHING ERROR
        Logger.errorDispatch({
          event: _cpEvent,
          listener: listListener[idx],
          error: dispatchError.message, // error message from node.js
        });
      });
    } // end loop
  }

  this.dispatch = function (Request, Response) {

    var requestBody = Object.assign({}, Request.body);
    var event_id = requestBody.event_id;
    var eventMessage = requestBody.message;

    if (!this.validRequest(requestBody)) {
      // - LOG BAD REQUEST
      Logger.errorBadRequest(requestBody);
      Response.status(400).end();
      return;
    }
    // - CHECK IF IS A VALID EVENT
    if (!_eventMap.event.has(event_id)) {
      Logger.errorInvalidEvent(requestBody);
      Response.status(400).end();
      return;
    }

    this.dispatchEvent(event_id, eventMessage);

    Response.status(200).end();
  }

};


module.exports = function(eventMap , Logger , HttpClient){
  return new Dispatcher(eventMap , Logger , HttpClient);
}
