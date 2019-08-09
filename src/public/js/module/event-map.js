/**
 * @module EventMap
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */


/**
 * Used to manage entities
 */
export default function EventMap(data) {

  const prefix = {
    service: 's-',
    event: 'e-',
    listener: 'r-'
  };

  const _eventMap = {
    service: new Map(),
    event: new Map(),
    listener: new Map()
  };

  ['service', 'event', 'listener'].map(function (type) {
    data[type].map(function (item) {
      _eventMap[type].set(item.id, item);
    });
  });

  this.generateID = function (entityType) {
    return prefix[entityType] + (_eventMap[entityType].size + 1);
  }

  this.setEntity = function (entityData) {
    var entity = Object.assign({}, entityData);
    var _map = _eventMap[entity.type];
    _map.set(entity.id, entity);
    //saveEventMap(eventMapFile, _eventMap);
    return entity;
  }

  this.removeById = function (type, id) {
    var _map = _eventMap[type];
    var result = _map.delete(id);
    if (result) {
      //saveEventMap(eventMapFile, _eventMap);
    }
    return result;
  }

  this.getById = function (type, id) {
    var _map = _eventMap[type];
    return _map.get(id);
  }

  /**
   * 
   * @returns Array<service>
   */
  this.getList = function (type, criteria) {

    var _map = _eventMap[type];
    var result = [];

    if (criteria && criteria.length) {
      _map.forEach(element => {
        let ok = true;
        // criteria[][]  <==> [ [ field , value ] ];
        criteria.forEach((pair) => {
          // pair <==> [field , value]
          ok = ok && (element[pair[0]] === pair[1]);
        });
        if (ok) {
          result.push(element);
        }
      });
    }
    else {
      //service
      _map.forEach(element => {
        result.push(element);
      });
    }
    return result;
  }
}

