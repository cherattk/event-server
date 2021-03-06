/**
 * @module EventMap
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


/**
 * Used to manage (set/delete) entities
 * It converts entities JSON Object to a Map Object to manage entities
 * @params {Object} entitiesMap
 */

/**
 * 
  var _entitySchema = {
    service: { id: "", type: "", name: "", host: "", description: "" },
    event : { id : "" , type : "" , service_id: "" , name : "" , description : ""},
    listener : { id : "" , type : "" , event_id: "" , endpoint : "" , description : ""}
  };

 */


const fs = require('fs');

module.exports = function EventMap() {

  const prefix = { service: 's-', event: 'e-', listener: 'l-' };

  const _eventMap = {
    service: new Map(),
    event: new Map(),
    listener: new Map()
  };

  /**
   * 
   * @param {*} __JSONEntities A JSON Object
   */
  this.buildMap = function (__JSONEntities) {

    ['service', 'event', 'listener'].map(function (type) {
      _eventMap[type].clear();
      __JSONEntities[type].map(function (item) {
        let _item = Object.assign({}, item);
        _eventMap[type].set(_item.id, _item);
      });
    });
  }


  this.toJSON = function () {
    var __eventMapJSON = {
      service: Array.from(_eventMap.service.values()),
      event: Array.from(_eventMap.event.values()),
      listener: Array.from(_eventMap.listener.values())
    }
    return __eventMapJSON;
  }

  this.generateID = function (entityType) {
    return prefix[entityType] + (new Date().getTime());
  }

  this.setEntity = function (entityData) {
    var entity = Object.assign({}, entityData);
    if (typeof entityData.id === 'undefined' || !entityData.id) {
      entity.id = this.generateID(entityData.type);
    }

    if (entityData.type === "service") {
      _eventMap.event.forEach(function (event) {
        if (event.service_id === entityData.id) {
          event.ce_source = entityData.host;
        }
      });
    }
    var _map = _eventMap[entity.type];
    _map.set(entity.id, entity);
    return entity;
  }

  /**
   * Remove one entry of type 'type' from the EventMap And 
   * its linked entities, ex : event <---> listener
   * 
   * @param {string} type The type of the entity
   * @param {string} id The id of the entity
   * 
   * @returns {boolean} the returned value is the value of Map.delete()
   */
  this.removeById = function (type, id) {
    var _map = _eventMap[type];
    var result = _map.delete(id);

    if (type === 'service') {
      _eventMap.event.forEach(function (event) {
        if (event.service_id === id) {
          _eventMap.event.delete(event.id);
        }
      });
    }
    if (type === 'event') {
      _eventMap.listener.forEach(function (listener) {
        if (listener.event_id === id) {
          _eventMap.listener.delete(listener.id);
        }
      });
    }
    return result;
  }

  this.getById = function (type, id) {
    var _map = _eventMap[type];
    return _map.get(id);
  }

  /**
   * 
   * @returns Array<entity>
   */
  this.getList = function (type, criteria) {

    var _map = _eventMap[type];
    var result = [];

    // todo : buggy code , must be changed
    const field = !!criteria && Object.keys(criteria);
    if (field.length > 0) {
      _map.forEach(element => {
        let ok = true;
        field.forEach(function (_field) {
          ok = ok && (element[_field] === criteria[_field]);
        });
        if (ok) {
          // @todo push a copy of the element
          result.push(element);
        }
      });
    }
    else {
      // return all entries
      result = Array.from(_map.values());
    }
    return result;
  }
}

