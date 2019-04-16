const sinon =  require('sinon');
const nano = require('nano');
const Persistence = require('../../src/lib/persistence');

// =======================================================

describe("Test Persistence", function () {

  it("Test .saveEvent()", function () {

    var nanoDriver = nano('http://test.com').use('db_name');
    var __mock = sinon.mock(nanoDriver).expects('insert').once();

    var __event = {
      event_id : "event-id",
      message : "hello world!"
    };
    const __DataBase = Persistence(nanoDriver , null);
    __DataBase.saveEvent(__event);
    __mock.verify();

  });
  
  it("Test .getEvent()", function () {

    var nanoDriver = nano('http://test.com').use('db_name');
    var __mock = sinon.mock(nanoDriver).expects('get').once();

    const __DataBase = Persistence(nanoDriver);
    __DataBase.getEvent();
    __mock.verify();

  });

  // it("Test .saveError()", function () {

  //   var __error = { error_message : "error message!"};
  //   __DataBase.saveError(__error).then(function(response){
  //       assert.strictEqual(response.ok , true);
  //   });

  // });

});