const assert = require('assert');
const path = require('path');
const request = require('request');
const nock = require('nock');

const EventServer = require('../../src/dispatcher/index');
const EventMapFile = path.resolve('./test/fixture/event-map.test.json');
const Fixture = require('../fixture/fixture-factory');

describe('EventServer' , function() {
  
  before('Start Servers' , function(done) {    
    
    // set listener response
    const listenerUrl = Fixture.listener_1_Data().endpoint;
    nock(listenerUrl).post('/').reply(200, "listener-response");

    this.server = EventServer({
      event_map_file : EventMapFile,
      hostname :"127.0.0.1" , 
      port : "3000"
    });
    done();
  
  });
  
  after('Close Servers' , function(done) {

    this.server.close(function() {
      console.log(`Close Event Server`);
      done();
    });
  });

  it('Test EventServer Execution' , function(done) {

    const dispatcherAddress = 'http://127.0.0.1:3000';

    // publish event
    const event = Fixture.eventData();
    const requestBody = {
      event_id : event.id,
      message : { data : "test" }
    };

    request.post( dispatcherAddress, { form : requestBody } ,
      function(queryError , httpResponse , responseBody){
        assert.strictEqual(httpResponse.statusCode , 200);

        //
        // assert(log , log)
        done();
      }
    );

  });

})