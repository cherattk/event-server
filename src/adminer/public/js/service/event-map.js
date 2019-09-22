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
 * Entity Schema
 * 
 * event : { "id" , type , "service_id"  , "name", "description" }
 * listener : { "id" , "event_id"  , "endpoint", "description" }
 */

module.exports = function EventMap(entities) {

  const prefix = { service: 's-', event: 'e-', listener: 'l-' };

  var _entitySchema = {
    service: { id: "", type: "", name: "", host: "", description: "" },
    event : { id : "" , type : "" , service_id: "" , name : "" , description : ""},
    listener : { id : "" , type : "" , event_id: "" , endpoint : "" , description : ""}
  };

  const _eventMap = {
    service: new Map(),
    event: new Map(),
    listener: new Map()
  };

  ['service', 'event', 'listener'].map(function (type) {
    entities[type].map(function (item) {
      let _item = Object.assign(_entitySchema[type] , item);
      _eventMap[type].set(_item.id, _item);
    });
  });

  this.generateID = function (entityType) {
    return prefix[entityType] + (new Date().getTime());
  }

  this.setEntity = function (entityData) {
    var entity = Object.assign({}, entityData);
    if (typeof entityData.id === 'undefined' || !entityData.id) {
      entity.id = this.generateID(entityData.type);
    }
    var _map = _eventMap[entity.type];

    if (entityData.type === 'event') {
      let _serviceEntity = _eventMap.service.get(entityData.service_id);
      entity.service_name = _serviceEntity.name;
      entity.service_host = _serviceEntity.host;
    }
    _map.set(entity.id, entity);
    return entity;
  }

  /**
   * Remove one entry of type 'type' from the Map And 
   * set it's 'reference_id' into the children entities to empty value
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
          _eventMap.event.delete(event.service_id);
        }
      });
    }
    if (type === 'event') {
      _eventMap.listener.forEach(function (listener) {
        if (listener.event_id === id) {
          _eventMap.listener.delete(listener.event_id);
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
    const field = !!criteria && Object.keys(criteria);

    var result = [];
    if (field.length > 0) {
      _map.forEach(element => {
        let ok = true;
        field.forEach(function (_field) {
          ok = ok && (element[_field] === criteria[_field]);
        });
        if (ok) {
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

