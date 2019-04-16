const assert = require('assert');
 
// mock http server request
const nock = require('nock');

// mock http {Request , Response}
const httpMocks = require('node-mocks-http');

const EventDispatcher = require('../../src/server/event-dispatcher');

const Fixture = require('../fixture/fixture-factory');

const MapLoader = {
  loadEventMap : () => Fixture.EventMap(),
  saveEventMap : () => 0,
}

const Persistence  = {
  saveEvent : () => 0 , 
  saveError : () => 0 
};

// *********************************************************************

describe("Test EventDispatcher", function () {

  it("Test .notifyListener() : Successfully notify listener", function (done) {

    const listenerUrl = "http://listener.com";
    nock(listenerUrl).post('/').reply(200, "listener-response");

    var messageObject = {
      message : "hello this is a notification"
    };
    var listenerObject = {
      url : listenerUrl
    };

    EventDispatcher(MapLoader)
      .notifyListener(messageObject , listenerObject)
      .then(function(result){
        assert.strictEqual( result ,  "listener-response");
        done();
      })
      .catch(done);
  
  });

  it("Test .notifyListener() : Catch 404 Error - Listener Not Found", function (done) {

    const listenerUrl = "http://listener.com";
    const notFoundPath = "/not-found";

    nock(listenerUrl).post(notFoundPath).reply(404);

    var messageObject = {
      message : "hello this is a notification"
    };
    var listenerObject = {
      url : listenerUrl + notFoundPath
    };

    EventDispatcher(MapLoader)
      .notifyListener(messageObject , listenerObject)
      .catch(function(error){
        assert.strictEqual( error.statusCode,  404);
        done();
      })
      .catch(done);
  
  });

  it("Test .getListener()", function () {

    var dispatcher = EventDispatcher(MapLoader);

    var event_id =  Fixture.eventData().id;
    var listener = dispatcher.getListener(event_id);

    assert.strictEqual(Array.isArray(listener) , true);
    assert.strictEqual(listener.length , 2);
  
  });

  it("Test .dispatchEvent() : Successfully dispatch event", function (done) {

    var dispatcher = EventDispatcher(MapLoader , Persistence);

    var event_id =  Fixture.eventData().id;

    var Request  = httpMocks.createRequest({
        body : {
          event_id : event_id,
          message : "hello world!"
        }
    });
    var Response = httpMocks.createResponse();

    dispatcher.dispatchEvent(Request , Response);

    assert.strictEqual(Response.statusCode , 200);
    done();
  });

});