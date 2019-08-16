const assert =  require('assert');
const sinon =  require('sinon');

const Logging = require('../../src/core/Logging');

const _MockDriver = {
  insert : function(){},
  find : function(){}
}

describe("Logging API", function () {

  beforeEach(function(){
    sinon.spy(_MockDriver , 'insert');
    sinon.spy(_MockDriver , 'find');
  });
  
  afterEach(function(){
    _MockDriver.insert.restore();
    _MockDriver.find.restore();
  });

  it(" .event() calls _MockDriver.insert()", function () {

    var query = { event : "data-query"};
    Logging(_MockDriver).event(query);
    
    assert(_MockDriver.insert.calledOnce);
    // assert(_MockDriver.insert.calledWith(query));

  });

  it(" .error() calls _MockDriver.insert()", function () {

    var query = { error : "data-query"};
    Logging(_MockDriver).error(query);
    
    assert(_MockDriver.insert.calledOnce);
    // assert(_MockDriver.insert.calledWith(query));

  });
  
  it(" .fetch() calls _MockDriver.find()", function () {

    var criteria = { error : "data-query"};
    Logging(_MockDriver).fetch(criteria);
    
    assert(_MockDriver.find.calledOnce);
    assert(_MockDriver.find.calledWith(criteria));

  });

});