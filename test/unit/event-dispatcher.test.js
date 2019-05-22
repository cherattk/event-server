const assert = require('assert');
const expect = require('chai').expect;

// mock http server request
const nock = require('nock');

// mock http {Request , Response} Object
const httpMocks = require('node-mocks-http');
// for mocking
const sinon = require('sinon');

// *********************************************************************
const path = require('path');
const FixtureMapFile = path.resolve('./test/fixture/event-map.test.json');
const EventDispatcher = require('../../src/core/event-dispatcher').EventDispatcher;
const Fixture = require('../fixture/fixture-factory');

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

  it('.loadEventList() Test Entities Format', function () {

    var dispatcher = new EventDispatcher(FixtureMapFile, null, null);

    var _map = dispatcher.loadEventList();
    //
    assert(_map instanceof Map);

  });

  it(" .getListener() returns valid Listener Array", function () {

    var dispatcher = new EventDispatcher(FixtureMapFile, null, null);

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

    const dispatcher = new EventDispatcher(FixtureMapFile, _MockHttpClient, _MockLogging);

    const publishQuery = {
      // @see FixtureMapFile
      event_id: 'e-1',
      message: { data: "test" }
    };

    const notify_listener_1_request = {
      json : true,
      form : JSON.stringify(publishQuery.message),
      // listener endpoint @see FixtureMapFile
      url : 'www.listener-2.com/path-2'
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
    assert(_MockHttpClient.post.calledWith(notify_listener_1_request));

    done();
    _MockHttpClient.post.restore();
    _MockLogging.query.restore();
    _MockLogging.event.restore();
  });

  it('.validPublishQuery() returns true', function () {

    const dispatcher = new EventDispatcher(FixtureMapFile, null, null);

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