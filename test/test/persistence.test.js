const assert =  require('assert');
const sinon =  require('sinon');
const nano = require('nano');
const Persistence = require('../../src/lib/persistence');

const dbDriver = {
  insert : () => 0,
  get : () => 0
}

describe("Test Persistence", function () {


  beforeEach(function setupSpy(){
    sinon.spy(dbDriver , 'insert');
    sinon.spy(dbDriver , 'get');
  });
  
  afterEach(function restoreSpy(){
    dbDriver.insert.restore();
    dbDriver.get.restore();
  });

  it(" .saveEvent(event) calls dbDriver.insert(event)", function () {
    
    var __event = {data : "data-event"};
    Persistence(dbDriver).saveEvent(__event);

    assert(dbDriver.insert.calledOnce);
    assert(dbDriver.insert.calledWith(__event));

  });
  
  it(" .getEvent(criteria) calls dbDriver.get(criteria)", function () {
    
    const __criteria = {field: "field-event"};
    Persistence(dbDriver).getEvent(__criteria);

    assert(dbDriver.get.calledOnce);
    assert(dbDriver.get.calledWith(__criteria));

  });

  it(" .saveError(error) calls dbDriver.insert(error)", function () {

    var __event = {data : "data-error"};
    Persistence(dbDriver).saveEvent(__event);

    assert(dbDriver.insert.calledOnce);
    assert(dbDriver.insert.calledWith(__event));
  });

  it(" .getError(criteria) calls dbDriver.get(criteria)", function () {

    var __criteria = { field : "field-error"};
    Persistence(dbDriver).getError(__criteria);

    assert(dbDriver.get.calledOnce);
    assert(dbDriver.get.calledWith(__criteria));

  });

});