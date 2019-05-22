/**
 * @module EventMap
 * @copyright Copyright (c) 2019-present cheratt karim
 * @license MIT Licence
 */

module.exports = function EventMap() {

  const _eventMapFile = eventMapFile;

  const prefix = {
    service  : 's-',
    event    : 'e-',
    listener : 'r-'
  };

  var _eventMap = {
    service: new Map(),
    event: new Map(),
    listener: new Map()
  }

  /**
   * Used to manage entity
   */
  this.loadEventMap = function () {
    const fileContent = fs.readFileSync(_eventMapFile, "utf8").trim();
    if (fileContent) {
      jsonContent = JSON.parse(fileContent);

      ['service', 'event', 'listener'].map(function (type) {
        jsonContent[type].map(function (item) {
          _eventMap[type].set(item.id, item);
        });
      });
    }
  }


  /**
   * Used to manage entity
   */
  this.saveMap = function () {

    var jsonMap = { service: [], event: [], listener: [] };

    ['service', 'event', 'listener'].map(function (entityType) {
      jsonMap[entityType] = Array.from(_eventMap[entityType].values());
    });

    var content = JSON.stringify(jsonMap);
    fs.writeFileSync(eventMapFile, content, "utf8", function (err) {
      if (err) console.log(err);
    });
  }

  this.generateID = function (entityType) {
    return prefix[entityType] + (_eventMap[entityType].size + 1);
  }

  this.set = function (entityData) {

    var entity = Object.assign({}, entityData);

    var service;
    if (entity.type !== 'service') {
      // both event and listener have 'service_id' field
      var service = this.getById('service', entity.service_id);
      if (!service) {
        let msg = `\n service with id "${entity.service_id}" not found \n`;
        throw new Error(msg);
      }
    }

    if (entity.type === 'listener') {
      var event = this.getById('event', entity.event_id);
      if (!event) {
        throw new Error(`\n Error : Event with id "${entity.event_id}" not found \n`);
      }
      if (event.service_id === entity.service_id) {
        let msg = `\n Error : listener and the event cannot belong to the same service \n`;
        msg += `\n event identified by id "${event.id}"`;
        msg += ` is triggered by the service "${event.service_id}"`;
        throw new Error(msg);
      }

      // set domain field of listener to service's domain
      entity.domain = service.domain;
    }

    // generate id only for the new entity
    if (typeof entity.id === 'undefined') {
      entity.id = this.generateID(entity.type);
    }
    var _map = _eventMap[entity.type];
    _map.set(entity.id, entity);
    this.saveMap(_eventMap);
    return entity;
  }

  this.removeById = function (type, id) {
    var _map = _eventMap[type];
    var result = _map.delete(id);
    if (result) {
      this.saveMap();
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

    if (criteria && typeof criteria.length !== 'undefined' && criteria.length) {
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
