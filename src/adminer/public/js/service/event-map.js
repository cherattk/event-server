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
module.exports = function EventMap(entities) {

  const prefix = { service: 's-', event: 'e-', listener: 'l-' };

  const _eventMap = {
    service: new Map(),
    event: new Map(),
    listener: new Map()
  };

  ['service', 'event', 'listener'].map(function (type) {
    entities[type].map(function (item) {
      _eventMap[type].set(item.id, item);
    });
  });

  this.generateID = function (entityType) {
    return prefix[entityType] + (new Date().getTime());
  }

  this.setEntity = function (entityData) {
    var entity = Object.assign({}, entityData);
    if(!entityData.id){
      entity.id = this.generateID(entityData.type);
    }
    var _map = _eventMap[entity.type];
    _map.set(entity.id, entity);
    return entity;
  }

  this.removeById = function (type, id) {
    var _map = _eventMap[type];
    var result = _map.delete(id);

    if (type === 'service') {
      _eventMap.event.forEach(function (event) {
        if (event.service_id === id) {
          event.service_id = '';
        }
      });
    }
    if (type === 'event') {
      _eventMap.listener.forEach(function (listener) {
        if (listener.event_id === id) {
          listener.event_id = '';
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
   * @returns Map<id , entity>
   */
  this.getList = function (type, criteria) {

    var _map = _eventMap[type];
    const field = !!criteria && Object.keys(criteria);

    if (field.length > 0) {
      var result = new Map();
      _map.forEach(element => {
        let ok = true;
        field.forEach(function(_field){
          ok = ok && (element[_field] === criteria[_field]);
        });
        if (ok) {
          result.set(element.id, element);
        }
      });
      return result;
    }
    // return all values
    return _map;
  }
}

