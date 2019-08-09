const assert = require('assert');
const expect = require('chai').expect;
const sinon = require('sinon');

const httpMocks = require('node-mocks-http');

const EventManager = require('../../src/core/event-manager');

const _MockEventMap = {
  setEntity : () => null, 
  removeById : () => null,
  getById : () => {},
  getList : () => null,
  generateID : () => 123
};

describe('EventManager', function () {


  it('.validField()', function () {
    
    var requiredField = ['field_2' , 'field_2'];
    // ALL required fields are present in requestField
    var requestField = { field_1 : "" , field_2 : ""  , field_3 : ""};
    
    var handler = new EventManager(null);
    var result = handler.validField(requiredField , requestField);
    
    assert(result === true);

  });

  it('.registerEntity() calls eventMap.setEntity() ', function () {

    var Request = httpMocks.createRequest({
        method: 'put',
        body: {
          // required
          type: "listener", 
          name: "listener-name", 
          service_id: "s-1",
          event_id: "s-1",
          url: "listener-endpoint.com",
        }
    });
    var Response = httpMocks.createResponse();

    sinon.spy(_MockEventMap , 'setEntity');
    sinon.stub(_MockEventMap , 'getById').returns({
      service_id : 's-2' // must be diffrent from event.service_id
    });

    var handler = new EventManager(_MockEventMap);
    
    handler.registerEntity(Request , Response);

    assert(_MockEventMap.setEntity.called);
    _MockEventMap.setEntity.restore();
    _MockEventMap.getById.restore();

  });

  it('.removeEntity() calls EventMap.removeById() ', function () {

    // target function      
    var Response = httpMocks.createResponse();
    var Request  = httpMocks.createRequest({
          method: 'DELETE',
          url: '/entity',
          body : {
            type : "service",
            id : "not-valid-service-id"
          }
      });

    sinon.spy(_MockEventMap , 'removeById');

    var handler= new EventManager(_MockEventMap);
    handler.removeEntity(Request , Response);

    assert(_MockEventMap.removeById.calledOnce);

    _MockEventMap.removeById.restore();

  });

  it('.getEntity() calls EventMap.getById() ', function () {

    var Request  = httpMocks.createRequest({
        method: 'GET',
        url: '/entity',
        query: {
          type : 'service',
          id : 'some-value'
        }
    });

    var Response = httpMocks.createResponse();

    sinon.spy(_MockEventMap , 'getById');

    var handler = new EventManager(_MockEventMap);
        handler.getEntity(Request , Response);

    assert(Response.statusCode === 404);
    assert(_MockEventMap.getById.calledOnce);

    _MockEventMap.getById.restore();

  });

  it('.getEntity() calls EventMap.getList() ', function () {

    var Request  = httpMocks.createRequest({
      method: 'GET',
      url: '/entity',
      query: {
        type : 'service' ,
        id : '' // must be empty
      }
    });

    var Response = httpMocks.createResponse();

    sinon.spy(_MockEventMap , 'getList');

    var handler = new EventManager(_MockEventMap);
        handler.getEntity(Request , Response);

    assert(Response.statusCode === 404);    
    assert(_MockEventMap.getList.calledOnce);

    _MockEventMap.getList.restore();

  });

});