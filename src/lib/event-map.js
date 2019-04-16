/**
 * @module EventMap
 * @copyright Copyright (c) 2018 cheratt karim
 * @license MIT Licence
 */

const Util = require('./util');

const ID_SEPARATOR = '::';

function EventMap(MapLoader) {

  const __MapLoader = MapLoader;
  const __eventMap = __MapLoader.loadEventMap();

  function __getMap(type) {
    return __eventMap[type];
  }

  this.length = function (type) {
    var __map = __getMap(type);
    return __map.size;
  }

  this.generateID = function (entity) {
    
    if (entity.type === "service") {
      let id = Util.clean(entity.name);
      return id;
    }
    else if(entity.type === "event"){
      let token = Util.clean(entity.name);
      return (entity.service_id + ID_SEPARATOR + token);
    }
    else if(entity.type === "listener"){
      let token = Util.clean(entity.url);
      return (entity.event_id + ID_SEPARATOR + token);
    }
  }

  this.add = function (entity) {
    var __entity = {};
    var __map = __getMap(entity.type);
    if(typeof entity.id !== "undefined" && __map.has(entity.id)){
      __entity = __map.get(entity.id);
      // this will update the target entity with the new values
      // in the Map()
      Object.assign(__entity , entity);
    }
    else{
      __entity = Object.assign({}, entity);
      __entity.id = this.generateID(__entity);
      __map.set(__entity.id, __entity);
    }

    // save changes to file
    __MapLoader.saveEventMap(__eventMap);
    return __entity.id;
  }

  this.removeById = function (type, id) {
    var __map = __getMap(type);
    var __result = __map.delete(id);
    // save changes
    __MapLoader.saveEventMap(__eventMap);
    return __result;
  }

  /**
   * @returns Object returns entity object
   */
  this.getById = function (type, id) {
    var __map = __getMap(type);
    var __entity = __map.get(id);
    if(__entity){
      var __entityObject = Object.assign({} , __entity);
      return __entityObject;
    }
    return false;
  }

  /**
   * 
   * @returns <Object> retuns array of entity object
   */
  this.getList = function getList(entityType , parent_id){

    var __map = __getMap(entityType);
    var result = [];
    var regx = new RegExp("^" + parent_id + ID_SEPARATOR);
    __map.forEach(element => {
      if(regx.test(element.id)){
        result.push(element);
      }
    });
    return result;
  }

}

module.exports = EventMap;
