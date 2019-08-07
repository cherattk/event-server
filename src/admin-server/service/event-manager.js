/**
 * @module EventManager
 * @copyright Copyright (c) 2018-2019 cheratt karim
 * @license MIT Licence
 */

module.exports = function EventManager(_eventMap) {

  const _entityType = ['service', 'event', 'listener'];

  const _requiredField = {
    put: {
      service: ['type', 'id'],
      event: ['type', 'name', 'service_id'],
      listener: ['type', 'name', 'service_id', 'event_id', 'url']
    },
    post: {
      service: ['type', 'id'],
      event: ['type', 'id'],
      listener: ['type', 'id']
    },
    get: {
      service: ['type', 'id'],
      event: ['type', 'id'],
      listener: ['type', 'id']
    },
    delete: {
      service: ['type', 'id'],
      event: ['type', 'id'],
      listener: ['type', 'id']
    }
  }

  this.errorMessage = '';

  this.validField = function (requiredField, targetField) {
    var result = true;
    requiredField.map(function (prop) {
      result = result && (typeof targetField[prop] !== "undefined");
    });
    return result;
  }

  this.validQuery = function (method, query) {
    if (_entityType.indexOf(query.type) < 0) {
      return false;
    }
    var field = _requiredField[method][query.type];
    // check if query contains required fields
    var result = this.validField(field, query);
    return result;
  }

  this.checkCondition = function (entityData) {
    const _type = entityData.type;
    if(_type === 'listener'){
      // both listener and event have 'service_id' field
      var event = _eventMap.getById('event', entityData.service_id);
      // listener and the event CAN NOT belong to the same service
      if (event.service_id === entityData.service_id) {
        this.errorMessage = 'listener and event cannot belong to the same service';
        return false;
      }
    }
    return true;
  }

  this.updateEntity = function(entityData){
    var entityData = Object.assign({}, Request.body);
    if (!this.validQuery('post', entityData)) {
      Response.status(400).end();
      return;
    }

    if(typeof entityData.id !== 'undefined'){
      let entity = _eventMap.getById(_type, entityData.id);
      if(!entity){
        Response.status(400).end(`enntity id ${entityData.id} does not exists`);
      }
    }
  }

  this.registerEntity = function (Request, Response) {

    var entityData = Object.assign({}, Request.body);
    if (!this.validQuery('put', entityData)) {
      Response.status(400).end();
      return;
    }

    if (this.checkCondition(entityData)) {
      entityData.id = _eventMap.generateID(entityData.type);
      _eventMap.setEntity(entityData);
      Response.status(201).json({ entity_id: entityData.id });
    }
    else {
      Response.status(400).end(this.errorMessage);
    }
  }

  this.removeEntity = function (Request, Response) {

    var query = Object.assign({}, Request.body);

    if (!this.validQuery('delete', query)) {
      Response.status(400).end();
      return;
    }

    var result = _eventMap.removeById(query.type, query.id);
    var statusCode = result ? 200 : 404;
    Response.status(statusCode).json({
      status: result
    });
  }

  this.getEntity = function (Request, Response) {

    var query = Object.assign({}, Request.query);

    if (this.validQuery('get', query)) {
      var result;
      if (query.id) {
        result = _eventMap.getById(query.type, query.id);
      }
      else {
        result = _eventMap.getList(query.type);
      }
      var statusCode = result ? 200 : 404;
      var data = statusCode === 200 ? { data: result } : { message: "not found" };
      Response.status(statusCode).json(data);

    } else {
      Response.status(400).end();
    }
  }

}
