const assert = require('assert');
const path = require('path');
const fs = require('fs');

const httpMocks = require('node-mocks-http');

const EventManager = require('../../src/admin/event-manager');

const Fixture = require('../fixture/fixture-factory');

describe("Test EventManager", function () {
  
  it("Test .checkField()", function () {
    
    var requiredField = ['field_2' , 'field_2'];
    // ALL required fields are present in requestField
    var requestField = { field_1 : "" , field_2 : ""  , field_3 : ""};
    
    var __handler = EventManager();
    var result = __handler.checkField(requiredField , requestField);
    
    assert.strictEqual(result, true);
  });

  it(`Test .checkQueryEntity(Request, Response , Next)` , function(){

    // - query contains 'type' field
    // - 'type' field can not be empty 
    // - valid value is one of : {'service' , 'event' , 'listener'} 
    var query = { type : "service"};
    var Request = httpMocks.createRequest({
        method: 'POST',
        url: '/entity',
        body: query
    });

    var Response = httpMocks.createResponse();

    var __handler = EventManager();
        __handler.checkQueryEntity(Request , Response , function Next(){});

    assert.strictEqual(Response.statusCode , 200);
  
  });

  it("Test .registerEntity(Request, Response)", function (done) {

      var Request = httpMocks.createRequest({
          method: 'POST',
          url: '/entity',
          body: {
            type: "service", // required 
            name: "new-service-name" // required
          }
      });

      var Response = httpMocks.createResponse();
      
      var __fakeEventMap = {
        add : () => {}
      };
      var __handler = EventManager(__fakeEventMap);
          __handler.registerEntity(Request , Response);

      assert.strictEqual(Response.statusCode , 201);

      done();

  });

  it("Test .removeEntity(Request, Response)", function (done) {

      // target function      
      var Response = httpMocks.createResponse();
      var Request  = httpMocks.createRequest({
            method: 'DELETE',
            url: '/entity',
            body : {
              type : "service",
              id : "service-id"
            }
        });

      var __fakeEventMap = {
         /* must returns value that is evaluated to true */
        removeById : () => "123"
      };
      var __handler= EventManager(__fakeEventMap);
      __handler.removeEntity(Request , Response);
      assert.strictEqual(Response.statusCode , 200);
      done();

  });

  it("Test .getEntity(Request, Response) : Get One Entity", function (done) {

      // tested with valid query paramater
      var queryParam = "id=service-id" + "&" + "type=service";
      var Request  = httpMocks.createRequest({
          method: 'GET',
          url: '/entity?' + queryParam
      });

      var Response = httpMocks.createResponse();

      var __fakeEventMap = {
        getById : () => 1
      };
      var __handler = EventManager(__fakeEventMap);
          __handler.getEntity(Request , Response);
      assert.strictEqual(Response.statusCode , 200);

      done();

  });

  it("Test .getEntity(Request, Response) : Get List", function (done) {

    var queryParam =  "type=event" + "&" + "id=event-id";

      var Request  = httpMocks.createRequest({
          method: 'GET',
          url: '/entity?' + queryParam
      });

      var Response = httpMocks.createResponse();

      var __fakeEventMap = {
        getById : () => {
          return ["data-value"]
        }
      };
      var __handler = EventManager(__fakeEventMap);
          __handler.getEntity(Request , Response);

      assert.strictEqual(Response.statusCode , 200);

      var result = JSON.parse( Response._getData());
      assert.strictEqual(Array.isArray(result.data) , true , `result.data is not an array`);
      assert.strictEqual(result.data.length, 1 , `result.data.length is not equal to 1`);
      done();

  });

});