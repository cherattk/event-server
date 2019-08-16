const assert =  require('assert');
const sinon =  require('sinon');

const Logging = require('../../src/core/Logging');

const dbName = 'event_db';
const nanoDriver = require('nano')({ 
  url : `http://localhost:5984/${dbName}`
});

describe("Logging to couchdb", function () {

  beforeEach(function(){
    sinon.spy(nanoDriver , 'insert');
    sinon.spy(nanoDriver , 'find');
  });
  
  afterEach(function(){
    nanoDriver.insert.restore();
    nanoDriver.find.restore();
  });

  it(" .event() calls nanoDriver.insert()", function (done) {

    var data = { error : "event-data"};
    Logging(nanoDriver).event(data).then(() => done() );
    
    assert(nanoDriver.insert.calledOnce);
    // assert(nanoDriver.insert.calledWith(data));

  });

  it(" .error() calls nanoDriver.insert()", function (done) {

    var data = { error : "error-data"};
    Logging(nanoDriver).error(data).then(() => done() );
    
    assert(nanoDriver.insert.calledOnce);
    // assert(nanoDriver.insert.calledWith(data));

  });
  
  it(" .fetch() calls nanoDriver.find()", function (done) {

    var criteria = { 
      selector : {
        "$tag" : "event"
      }
    };
    Logging(nanoDriver).fetch(criteria).catch(() => done());
    
    assert(nanoDriver.find.calledOnce);
    assert(nanoDriver.find.calledWith(criteria));

  });

});