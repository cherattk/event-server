const assert = require('assert');
const expect = require('chai').expect;
const sinon = require('sinon');

const FixtureMapFile = path.resolve('./test/fixture/event-map.test.json');
const EventMap = require('../../src/core/event-map');

describe("EventMap", function () {

  beforeEach(function(){
    sinon.restore();
  });

  it(".loadEventMap() Test Entities Format", function () {

    var eventMap = new EventMap();

    var _map = eventMap.loadEventMap(FixtureMapFile);

    //
    assert(_map.service instanceof Map);
    assert(_map.event instanceof Map);
    assert(_map.listener instanceof Map);

    // 1 - Service Properties
    const service_id = Fixture.serviceData().id;
    const service = eventMap.service.get(service_id);
    expect(service).to.have.property('type');
    expect(service).to.have.property('id');
    expect(service).to.have.property('name');
    expect(service).to.have.property('domain');
    expect(service).to.have.property('desc');

    // 2 - Event Properties
    const event_id = Fixture.eventData().id;
    const event = eventMap.event.get(event_id);
    expect(event).to.have.property('type');
    expect(event).to.have.property('id');
    expect(event).to.have.property('name');
    expect(event).to.have.property('desc');


    // 3- Listener Properties
    const listener_id = Fixture.listener_1_Data().id;
    const listener = eventMap.listener.get(listener_id);
    expect(listener).to.have.property('type');
    expect(listener).to.have.property('id');
    expect(listener).to.have.property('name');
    expect(listener).to.have.property('desc');
    expect(listener).to.have.property('domain');
    expect(listener).to.have.property('path');

  });

  it(".generateID() : generate ID for entity", function () {
          
    // the format : [parent_id]::[element-token]
    var eventMap = new EventMap();

    const result_1 = eventMap.generateID('service');
    assert(result_1 === "s-2");
    
    const result_2 = eventMap.generateID('event');
    assert(result_2 === "e-2");

    const result_3 = eventMap.generateID('listener');    
    assert(result_3 === "r-3");

  });
  
  

  it('.getMap() returns entity map from entity id' , function(){

  });

  it(".set()", function () {

    var eventMap = new EventMap();
    var result = eventMap.set({
          type: "service", // required
          name: "entity-data"
        });

    expect(result).has.property('type');
    expect(result).has.property('id');
    expect(result).has.property('name');

  });

  it(".removeById()", function () {

    var eventMap = new EventMap();

    // get id of the first fake service
    const service_id = Fixture.service_1_Data().id;
    var result = eventMap.removeById("service", service_id);

    assert.strictEqual(result, true);
  });

  it(".getById()", function () {

    var eventMap = new EventMap();

    const listener_id = Fixture.listener_1_Data().id;
    var result = eventMap.getById("listener", listener_id);

    assert.strictEqual(result.id, listener_id);

  });

  it(".getList() returns service list", function () {

    const eventMap = new EventMap();
    const service_list = eventMap.getList('service');

    assert.strictEqual(Array.isArray(service_list) , true);
    expect(service_list[0]).has.property('type');
    expect(service_list[0]).has.property('id');
    expect(service_list[0]).has.property('name');
    expect(service_list[0]).has.property('desc');

  });

  it(".getList() returns listener list", function () {

    const eventMap = new EventMap();
    
    const event_id = Fixture.eventData().id;
    const listener_list = eventMap.getList('listener', {
      event_id : event_id // criteria
    });

    assert.strictEqual(Array.isArray(listener_list) , true);
    assert.strictEqual(listener_list.length , 2);

    expect(listener_list[0]).has.property('type');
    expect(listener_list[0]).has.property('id');
    expect(listener_list[0]).has.property('name');
    expect(listener_list[0]).has.property('domain');
    expect(listener_list[0]).has.property('path');

  });

  

});