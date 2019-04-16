const fs = require('fs');

const entityNameList = ["service", "event", "listener"];

module.exports = {

  loadEventMap : function(mapFilePath) {

    var fileContent = fs.readFileSync(mapFilePath, "utf8");

    if (!fileContent) {
      let content = JSON.stringify({ service: [], event: [], listener: [] });
      fs.writeFileSync(mapFilePath, content, "utf8", function (err) {
        if (err) console.log(err);
      });
    }
    else {

      let jsonArray = JSON.parse(fileContent);
      entityNameList.map(function (entityType) {
        jsonArray[entityType].map(function (entity) {
          __eventMap[entityType].set(entity.id, entity);
        });
      });
    }
    return __eventMap;
  },

  saveEventMap : function(mapFilePath , mapList) {

    var __jsonMap = { service: [] , event: [] , listener: [] };

    entityNameList.map(function (entityType) {
      __jsonMap[entityType] = Array.from(mapList[entityType].values());
    });

    var content = JSON.stringify(__jsonMap);
    fs.writeFileSync(mapFilePath, content, "utf8", function (err) {
      if (err) console.log(err);
    });
  },

  loadEventMapForDispatcher : function (eventFilePath) {

    const fileContent = fs.readFileSync(eventFilePath, "utf8");

    if (!fileContent) {
      throw new Error('event map is empty');
    }
    else {
      let jsonObject = JSON.parse(fileContent);
      // -------------------------------------------------
      jsonObject.service.map(function(serviceEntity){
        __eventMap.service.set(serviceEntity.id , 
          {
            entity : serviceEntity,
            event : new Map()
          });
      });

      // -------------------------------------------------
      jsonObject.event.map(function(eventEntity){
        // set 'service' map with event list
        let service = __eventMap.service.get(eventEntity.service_id);
            service.event.set(eventEntity.id , eventEntity);
        // define 'event' map
        __eventMap.event.set(eventEntity.id , 
                                {
                                  entity : eventEntity,
                                  listener : new Map()
                                }
                              );
        
      });
      
      // -------------------------------------------------
      jsonObject.listener.map(function(listener){
        // set 'event' map with listener list
        let event = __eventMap.event.get(listener.event_id);
            event.listener.set(listener.id , listener);
      });
    }
    return __eventMap;
  }
}