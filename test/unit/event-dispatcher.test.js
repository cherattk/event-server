const assert = require('assert');
const expect = require('chai').expect;

// mock http server request
const nock = require('nock');

// mock http {Request , Response} Object
const httpMocks = require('node-mocks-http');
// for mocking
const sinon = require('sinon');

// *********************************************************************
const EventDispatcher = require('../../src/core/event-dispatcher');
const Fixture = require('../fixture/fixture-factory');

const _MockMapLoader = {
  loadEventList : Fixture.EventList
}

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

describe("EventDispatcher", function () {

  it(" .getListener() returns valid Listener Array", function () {

    var dispatcher = new EventDispatcher(_MockMapLoader, null, null);

    // get the first event in the fixture event map
    // @see fixture FixtureMapFile
    var event_id = 'e-1';
    var listener = dispatcher.getListener(event_id);

    assert.strictEqual(Array.isArray(listener), true);
    assert.strictEqual(listener.length, 2);

  });


  it(" .dispatchEvent()", function (done) {

    sinon.stub(_MockHttpClient, 'post').returns(Promise.resolve());
    sinon.spy(_MockLogging, 'query');
    sinon.spy(_MockLogging, 'event');

    const dispatcher = new EventDispatcher(_MockMapLoader, _MockHttpClient, _MockLogging);

    const publishQuery = {
      event_id: 'e-1',
      message: { data: "test" }
    };
    
    var Request = httpMocks.createRequest({  body : publishQuery });
    var Response = httpMocks.createResponse();

    dispatcher.dispatchEvent(Request, Response);

    // log publisher query
    assert(_MockLogging.query.calledOnce);
    assert(_MockLogging.query.calledWith( {query : publishQuery} ) );    
    
    // log event information
    assert(_MockLogging.event.calledOnce);
    assert(_MockLogging.event.calledWith( {event : publishQuery.event_id } ) );

    // notifiy listener(s)
    assert(_MockHttpClient.post.calledTwice);
    
    // assert(_MockHttpClient.post.firstCall.calledWith({
    //   json : true,
    //   form : JSON.stringify(publishQuery.message),
    //   url : Fixture.listener_1_Data().domain + Fixture.listener_1_Data().path
    // }));

    assert(_MockHttpClient.post.secondCall.calledWith({
      json : true,
      form : JSON.stringify(publishQuery.message),
      url : Fixture.listener_2_Data().domain + Fixture.listener_2_Data().path
    }));


    _MockHttpClient.post.restore();
    _MockLogging.query.restore();
    _MockLogging.event.restore();
    done();
  });

  it('.validPublishQuery() returns true', function () {

    const dispatcher = new EventDispatcher(_MockMapLoader, null, null);

    const event = Fixture.eventData();
    const requiredField = {
      event_id: event.id,
      message: "not-empty-message"
    };

    // valid publisher query
    const valid = dispatcher.validPublishQuery(requiredField);

    assert.strictEqual(valid, true);

  });


  it('.dispatchEvent() calls Logging.query()', function () {
    assert(false);
  });

  it('.dispatchEvent() calls Logging.error()', function () {

    // read error log entry
    const errorLog = {};
    expect(errorLog).to.have.property('id');
    expect(errorLog).to.have.property('time');
    expect(errorLog).to.have.property('listener');
    expect(errorLog).to.have.property('message');
    expect(errorLog).to.have.property('status_code');
  });

});