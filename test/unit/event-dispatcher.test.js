const path = require('path');
const assert = require('assert');
const expect = require('chai').expect;

// mock http server request
const nock = require('nock');

// mock http {Request , Response} Object
const httpMocks = require('node-mocks-http');
// for mocking
const sinon = require('sinon');

// *********************************************************************
const Dispatcher = require('../../src/core/event-dispatcher');

const fixtureEntities = path.resolve('./test/fixture/fixture-event-map.json');

const _MockHttpClient = {
  post: () => null
}

const _MockLogging = {
  query: (data) => null,

  event: (data) => null,

  error: (data) => null,

  fetch: (data) => null,
}

// *********************************************************************

describe("Test loadListenerMap()" , function(){

  it(".loadListenerMap() returns valid Listener Map", function () {

    var listenerMap = Dispatcher.loadListenerMap(fixtureEntities);

    assert(listenerMap instanceof Map);

    /**
     * for the tested value @see fixture-event-map.json
     */
    let event_id = 'e-1'; 
    let eventObject = listenerMap.get(event_id);    
    expect(eventObject).to.have.property('id');
    expect(eventObject).to.have.property('name');
    expect(eventObject).to.have.property('service_id');
    expect(eventObject).to.have.property('description');
    expect(eventObject).to.have.property('description');
    expect(eventObject).to.have.property('listener');

    // very important test listeners attached to the event
    assert(eventObject.listener instanceof Array);
    expect(eventObject.listener[0]).to.have.property('id');
    expect(eventObject.listener[0]).to.have.property('event_id');
    expect(eventObject.listener[0]).to.have.property('endpoint');
    assert(eventObject.listener[0].event_id === event_id);

  });

});

describe("EventDispatcher", function () {

  it(" .getListener() returns valid Listener Array", function () {

    let EventDispatcher = Dispatcher.EventDispatcher;
    var dispatcher = new EventDispatcher(fixtureEntities, null, null);

    // get the first event in the fixture event map
    // @see fixture-event-map.json
    var event_id = 'e-1';
    var listener = dispatcher.getListener(event_id);

    assert.strictEqual(Array.isArray(listener), true);
    assert.strictEqual(listener.length, 2);

  });


  it(" .dispatchEvent()", function (done) {

    sinon.stub(_MockHttpClient, 'post').returns(Promise.resolve());
    sinon.spy(_MockLogging, 'query');
    sinon.spy(_MockLogging, 'event');

    let EventDispatcher = Dispatcher.EventDispatcher;
    const dispatcher = new EventDispatcher(fixtureEntities, _MockHttpClient, _MockLogging);

    const publishQuery = {
      event_id: 'e-1',
      message: { data: "test" }
    };
    
    var Request = httpMocks.createRequest({  body : publishQuery });
    var Response = httpMocks.createResponse();

    dispatcher.dispatchEvent(Request, Response);


    // log event information
    assert(_MockLogging.event.calledOnce);
    assert(_MockLogging.event.calledWith( {
        event_id: publishQuery.event_id,
        message : publishQuery.message
      }) );

    /**
     * notifiy listener(s)
     * The post() method is called for every listener attached to the event.
     * In this test there is 2 listeners attached to the event('e-1').
     * @see fixture-event-map.json
     **/
    assert(_MockHttpClient.post.calledTwice);
    
    // assert(_MockHttpClient.post.firstCall.calledWith({
    //   json : true,
    //   form : JSON.stringify(publishQuery.message),
    //   url : "www.listener-1.com/path"
    // }));

    assert(_MockHttpClient.post.secondCall.calledWith({
      json : true,
      form : JSON.stringify(publishQuery.message),
      url : "www.listener-2.com/path"
    }));


    _MockHttpClient.post.restore();
    _MockLogging.query.restore();
    _MockLogging.event.restore();
    done();
  });

  it('.validPublishQuery() returns true', function () {

    let EventDispatcher = Dispatcher.EventDispatcher;
    const dispatcher = new EventDispatcher(fixtureEntities, null, null);

    const requiredField = {
      event_id: 'e-1',
      message: "not-empty-message"
    };

    // valid publisher query
    const valid = dispatcher.validQuery(requiredField);

    assert.strictEqual(valid, true);

  });

});