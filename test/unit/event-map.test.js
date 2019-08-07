const assert = require('assert');
const expect = require('chai').expect;
const sinon = require('sinon');

const path = require('path');
const FixtureMapFile = path.resolve('./test/fixture/event-map.test.json');
const EventMap = require('../../src/core/event-map');

describe("EventMap", function () {

  beforeEach(function(){
    sinon.restore();
  });

  

  it(".generateID() : generate ID for entity", function () {
          
    // the format : [parent_id]::[element-token]
    var eventMap = new EventMap(FixtureMapFile);

    const result_1 = eventMap.generateID('service');
    assert(result_1 === "s-2");
    
    const result_2 = eventMap.generateID('event');
    assert(result_2 === "e-2");

    const result_3 = eventMap.generateID('listener');    
    assert(result_3 === "r-3");

  });
  

  it(".set()", function () {

    var eventMap = new EventMap(FixtureMapFile);
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

    var eventMap = new EventMap(FixtureMapFile);

    const listener_id = Fixture.listener_1_Data().id;
    var result = eventMap.getById("listener", listener_id);

    assert.strictEqual(result.id, listener_id);

  });

  it(".getList() returns service list", function () {

    const eventMap = new EventMap(FixtureMapFile);
    const service_list = eventMap.getList('service');

    assert.strictEqual(Array.isArray(service_list) , true);
    expect(service_list[0]).has.property('type');
    expect(service_list[0]).has.property('id');
    expect(service_list[0]).has.property('name');
    expect(service_list[0]).has.property('desc');

  });

  it(".getList() returns listener list", function () {

    const eventMap = new EventMap(FixtureMapFile);
    
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