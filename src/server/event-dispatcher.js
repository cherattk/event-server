/**
 * @module EventDispatcher
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const HttpRequest = require('request-promise-native');

function EventDispatcher(EntityLoader , Persistence){

  const __eventStore = EntityLoader.loadEventStore();

  const __Persistence = Persistence;

  this.getListener = function(event_id){
    var event =  __eventStore.get(event_id);
    // return Array.from(event.listener.values());
    return event.listener;
  }

  this.notifyListener = function (eventMessage, listener) {

    const postData = JSON.stringify(eventMessage);
    const options = {
      method: 'POST',
      uri: listener.url,
      form: postData,
      json: true // body to JSON
    };

    const requestPromise = HttpRequest(options);
    return requestPromise;
  }

  this.checkEmitterQuery = function checkEmitterQuery(query) {
    var check =  (typeof query.event_id !== "undefined" && query.event_id) 
                  &&
                 (typeof query.message !== "undefined" && query.message);
    return check;
  }

  this.dispatchEvent = function (Request, Response) {

    var query = Object.assign({}, Request.body);
    
    if (this.checkEmitterQuery(query)) {
        // saving event first
        __Persistence.saveEvent(query);

        var __listener = this.getListener(query.event_id);
        for (let idx = 0 , max = __listener.length ; idx < max; idx++) {
          this.notifyListener(query.message, __listener[idx])
              .catch(function(error){
                __Persistence.saveError(error);
              });
        }
        Response.status(200).end();
    }
    else{
        Response.status(400).end();
    }
  }
}

module.exports = function(EntityLoader , Persistence){
  return new EventDispatcher(EntityLoader , Persistence);
};