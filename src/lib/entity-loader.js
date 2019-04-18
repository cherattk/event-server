const fs = require('fs');

const entityNameList = ["service", "event", "listener"];

module.exports = {

  // this methid is used by admin tools
  loadEntityStore : function(storeFilePath) {

    var __entityStore = {
      /**
       * Service Map : 
       * Map<service-id , {entity : serviceData  , event : Map<event-id , eventData> }>
       */
      service : new Map(),

      /**
       * Event Map :
       * Map<event-id , {entity : eventData , listener : Map<listener-id , listenerData> }>
       */
      event : new Map()
    };

    const fileContent = fs.readFileSync(storeFilePath, "utf8");
    var __storeContent  = JSON.parse(fileContent);
        __storeContent.map(function (serviceEntity) {
        
      });

    return __entityStore;
  },

  /** 
   * this methid is used by event-dispatcher
   * 
   * @returns EventStore 
   * Map<event-id , {
   *  type :"event", 
   *  id : string , 
   *  service_id : string , 
   *  name : string , 
   *  desc : string , 
   *  listener : Array<{}>}
   *  >
   * 
   * */
  loadEventStore : function(storeFilePath){

    const __eventStore = new Map();

    const fileContent = fs.readFileSync(storeFilePath, "utf8");
    var __serviceArray  = JSON.parse(fileContent);
        __serviceArray.map(function (serviceEntity) {
          serviceEntity.event.map(function(eventEntity) {
            __eventStore.set(
              eventEntity.id , 
              eventEntity
            );            
          })
        });

    return __eventStore;
  },


  saveEntityStore : function(storeFilePath , storeList) {

    var __jsonStore = { service: [] , event: [] , listener: [] };

    entityNameList.map(function (entityType) {
      __jsonStore[entityType] = Array.from(storeList[entityType].values());
    });

    var content = JSON.stringify(__jsonStore);
    fs.writeFileSync(storeFilePath, content, "utf8", function (err) {
      if (err) console.log(err);
    });
  }
}