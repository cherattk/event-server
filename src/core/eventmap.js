/**
 * @module Controller
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const fs = require('fs');
const configFile = "./config/event.map.json";

const entityNameList = ["service", "event", "listener"];

function __saveEventMap(mapList) {

  var __jsonMap = { service: [], event: [], listener: [] };

  entityNameList.map(function (entityType) {
    __jsonMap[entityType] = Array.from(mapList[entityType].values());
  });

  var content = JSON.stringify(__jsonMap);
  fs.writeFileSync(configFile, content, "utf8", function (err) {
    if (err) console.log(err);
  });
}

function __initMap() {

  var __map = {
    service: new Map(),
    event: new Map(),
    listener: new Map()
  };

  var fileContent = fs.readFileSync(configFile, "utf8");

  if (!fileContent) {
    let content = JSON.stringify({ service: [], event: [], listener: [] });
    fs.writeFileSync(configFile, content, "utf8", function (err) {
      if (err) console.log(err);
    });
  }
  else {
    let jsonMap = JSON.parse(fileContent);
    entityNameList.map(function (value) {
      jsonMap[value].map(function (entity) {
        __map[value].set(entity.id, entity);
      });
    });
  }
  return __map;

}

function EventMap(eventFile) {

  const __eventMap = __initMap(eventFile);

  function __getMap(type) {
    return __eventMap[type];
  }

  this.genID = function (entity) {
    var __map = __getMap(entity.type);
    var index = (__map.size + 1).toString();
    if (entity.type === "service") {
      return index;
    }
    else {
      return (entity.parent_id + "-" + index);
    }
  }

  this.length = function (type) {
    var __map = __getMap(type);
    return __map.size;
  }

  this.add = function (entity) {

    var __entity = Object.assign({}, entity);
        __entity.id = this.genID(__entity);

    var __map = __getMap(__entity.type);
        __map.set(__entity.id, __entity);

    // save changes to file
    __saveEventMap(__eventMap);

    return __entity.id;
  }

  this.getById = function (type, entity_id) {
    var __map = __getMap(type);
    var __entity = __map.get(entity_id);
    return Object.assign({}, __entity);
  }

  this.removeById = function (type, entity_id) {

    var __map = __getMap(type);
    var __result = __map.delete(entity_id);
    // save changes to file
    __saveEventMap(__eventMap);
    return __result;
  }

}

module.exports = EventMap;
