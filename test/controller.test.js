const assert = require('assert');
const fs = require('fs');
const Controller = require('../src/core/controller.js');
var httpMocks = require('node-mocks-http');

var app = require('express')();
var supertest = require('supertest');

const eventFile = './config/event.map.json';

describe("Test Controller Object", function () {

  beforeEach('populate MapFile', function () {
    var fakeMap = {service : [] , event : [] , listener : []};
        fakeMap.service.push(
          {
            type : "service",
            id : "123"
          }
        )
    fs.writeFileSync(eventFile, JSON.stringify(fakeMap), 
                  () => console.log('populate MapFile'));
  });

  afterEach("clear mapFile" , function(){
    fs.writeFileSync(eventFile, '' ,  () => console.log('clear MapFile'));
  });


  it("Test .validRequestParam()", function () {

      var ctrl = new Controller();

      var validObj = { name : "ok" , type : "event" , field:"field"};
      var valid = ctrl.validRequestParam(validObj , ["name" , "type"]);
      assert.strictEqual(valid, true ,  `
      error validRequestParam() must return true
     `);

      var notValidObj = { list : "list" , type : "event"};
      var notValid = ctrl.validRequestParam(notValidObj , ["name" , "type"]);

      assert.strictEqual(notValid , false , `
      error validRequestParam() must return false
      `);
  });

  it("Test .registerEntity() : successfully register entity", function (done) {

      var request  = httpMocks.createRequest({
          method: 'POST',
          url: '/manager/entity',
          body: {
            type: "service",
            name: "service-name"
          }
      });
      var response = httpMocks.createResponse();

      var ctrl = new Controller();
      ctrl.registerEntity(request , response);
      assert.strictEqual(response.statusCode , 201);
      done();

  });

  it("Test .removeEntity() : successfully delete entity", function (done) {

      var request  = httpMocks.createRequest({
          method: 'DELETE',
          url: '/manager/entity?type=service&id=123'
      });

      var response = httpMocks.createResponse();

      var ctrl = new Controller();
      ctrl.removeEntity(request , response);

      assert.strictEqual(response.statusCode , 200);
      done();

  });

  it("Test .getEntity() : successfully fetch entity", function (done) {

      var request  = httpMocks.createRequest({
          method: 'GET',
          url: '/manager/entity?type=service&id=123'
      });

      var response = httpMocks.createResponse();

      var ctrl = new Controller();
      ctrl.getEntity(request , response);

      var data = JSON.parse( response._getData() );
      assert.strictEqual(response.statusCode , 200);
      assert.strictEqual(response.get('Content-Type') , 'application/json');
      assert.strictEqual(data.entity.type , "service");
      assert.strictEqual(data.entity.id , "123");
      done();

  });

});