const fs = require('fs');
const HttpRequest = require('request-promise-native');

function EventDispatcher(MapLoader , Persistence){

  const __eventMap = MapLoader.loadEventMap();

  const __Persistence = Persistence;

  this.getListener = function(event_id){
    var event =  __eventMap.event.get(event_id);
    return Array.from(event.listener.values());
  }

  this.notifyListener = function (eventMessage, listener) {

    const postData = JSON.stringify(eventMessage);
    var options = {
      method: 'POST',
      uri: listener.url,
      form: postData,
      json: true // body to JSON
    };
    var requestPromise = HttpRequest(options);
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

module.exports = function(MapLoader , Persistence){
  return new EventDispatcher(MapLoader , Persistence);
};