const assert =  require('assert');
const expect =  require('chai').expect;
const sinon =  require('sinon');

const Logging = require('../../src/core/Logging');

const dbName = 'event_db';
const nanoDriver = require('nano')({ 
  url : `http://localhost:5984/${dbName}`
});

describe("Logging", function () {

  beforeEach(function(){
    sinon.spy(nanoDriver , 'insert');
    sinon.spy(nanoDriver , 'get');
  });
  
  afterEach(function(){
    nanoDriver.insert.restore();
    nanoDriver.get.restore();
  });

  it(" .query() calls nanoDriver.insert()", function (done) {

    var query = { query : "data-query"};
    Logging(nanoDriver).query(query).then(() => done() );

    assert(nanoDriver.insert.calledOnce);
    assert(nanoDriver.insert.calledWith(query));
  });

  it(" .event() calls nanoDriver.insert()", function (done) {

    var query = { event : "data-query"};
    Logging(nanoDriver).event(query).then(() => done() );
    
    assert(nanoDriver.insert.calledOnce);
    assert(nanoDriver.insert.calledWith(query));

  });

  it(" .error() calls nanoDriver.insert()", function (done) {

    var query = { error : "data-query"};
    Logging(nanoDriver).error(query).then(() => done() );
    
    assert(nanoDriver.insert.calledOnce);
    assert(nanoDriver.insert.calledWith(query));

  });
  
  it(" .fetch() calls nanoDriver.get()", function (done) {

    var query = { error : "data-query"};
    Logging(nanoDriver).fetch(query).catch(() => done());
    
    assert(nanoDriver.get.calledOnce);
    assert(nanoDriver.get.calledWith(query));

  });

});