/**
 * @module EventDispatcher
 * @copyright Copyright (c) 2019 cheratt karim
 * @license MIT Licence
 */

 const fs = require('fs');

 function eventListener(file){
  const fileContent = fs.readFileSync(file, "utf8");
    
    const eventList = new Map();
    try {
      const jsonContent = JSON.parse(fileContent);
      jsonContent.event.map(function (event) {
        event.listener = jsonContent.listener.filter(function (listener) {
          return (listener.event_id === event.id);
        });
        eventList.set(event.id, event);
      });
    } catch (error) {
      // console.error(error);
    }

    return eventList;
 }

module.exports = function EventDispatcher(mapFile, HttpClient, Logging) {

  const _eventMap = eventListener(mapFile);

  // implemented to test eventListener() return value
  this.loadEventListener = function (map_file) {
    return eventListener(map_file);
  }

  this.getListener = function (event_id) {
    var event = _eventMap.size > 0 /* if not empty map */ && _eventMap.get(event_id);
    if (event) {
      return event.listener;
    }
    return [];
  };

  /**
   * check if query has a valid event_id value
   * @param
   */
  this.validPublishQuery = function (pubQuery) {
    const valid = (typeof pubQuery.event_id !== "undefined" && pubQuery.event_id)
      &&
      (typeof pubQuery.message !== "undefined" && pubQuery.message)
      &&
      _eventMap.has(pubQuery.event_id);
      
    return valid;
  };

  this.dispatchEvent = function (Request, Response) {

    var pubQuery = Object.assign({}, Request.body);

    Logging.query({ query : pubQuery });

    if (this.validPublishQuery(pubQuery)) {

      Logging.event({ event : pubQuery.event_id });

      const requestOption = { json : true };
      
      var listener = this.getListener(pubQuery.event_id);
      for (let idx = 0, max = listener.length; idx < max; idx++) {

        requestOption.url = listener[idx].domain + listener[idx].path;
        requestOption.form = JSON.stringify(pubQuery.message);

        HttpClient.post(requestOption).catch((dispatchError) => {          
            Logging.error({ error : dispatchError });
          });
      }

      Response.status(200).end();
    }
    else {
      // bad query
      Response.status(400).end();
    }
  };

};
