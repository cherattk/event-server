/**
 * @module MapLoader
 * 
 */

const fs = require('fs');

module.exports = function MapLoader(MapFile) {

  /**
   * this method is used by eventserver for dispatching
   * @see EventDispatcher class
   */
  this.loadEventList = function () {

    const fileContent = fs.readFileSync(MapFile, "utf8");
    const jsonContent = JSON.parse(fileContent);

    const eventList = new Map();
    jsonContent.event.map(function (event) {
      event.listener = jsonContent.listener.filter(function (listener) {
        return (listener.event_id === event.id);
      });

      eventList.set(event.id, event);
    });

    return eventList;
  }

  this.loadEventMap = function () {

    const fileContent = fs.readFileSync(MapFile, "utf8").trim();

    if (fileContent) {
      const _eventMap = {
        service: new Map(),
        event: new Map(),
        listener: new Map()
      };

      jsonContent = JSON.parse(fileContent);

      ['service', 'event', 'listener'].map(function (type) {
        jsonContent[type].map(function (item) {
          _eventMap[type].set(item.id, item);
        });
      });

      return _eventMap;
    }
  }

  this.saveEventMap = function (_map) {

    var jsonMap = { service: [], event: [], listener: [] };

    ['service', 'event', 'listener'].map(function (entityType) {
      jsonMap[entityType] = Array.from(_map[entityType].values());
    });

    var content = JSON.stringify(jsonMap);
    fs.writeFileSync(MapFile, content, "utf8", function (err) {
      if (err) console.log(err);
    });
  }

}