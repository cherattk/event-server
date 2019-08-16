const assert = require('assert');
const expect = require('chai').expect;

const EventMap = require('../../src/adminer/public/js/module/event-map');

const fixtureEntities = require('../fixture/fixture-event-map.json');

describe("EventMap", function () {

  it(".getById()", function () {

    var eventMap = new EventMap(fixtureEntities);

    var result = eventMap.getById("service", 's-1');

    expect(result).has.property('id');
    expect(result).has.property('name');
    expect(result).has.property('host');
    expect(result).has.property('description');


  });

  it(".setEntity()", function () {

    var eventMap = new EventMap(fixtureEntities);
    var result = eventMap.setEntity({
      type: "service", // required
      name: "service-name"
    });

    expect(result).has.property('id');
    expect(result).has.property('type');
    expect(result).has.property('name');

  });

  it(".removeById()", function () {

    let eventMap = new EventMap(fixtureEntities);

    const service_id = 's-1';
    let result = eventMap.removeById("service", service_id);
    assert.strictEqual(result, true);

    /** event with id === 'e-1' was attached to service('s-1') */
    let event = eventMap.getById('event' , 'e-1');
    /** 
     * now the event('e-1') is attached to any service 
     * but it still available in the event list
    */
     assert(event.service_id === '');
     assert(event.id === 'e-1');
     assert(event.name === 'event-1');

  });

  it(".getList() returns service list", function () {

    const eventMap = new EventMap(fixtureEntities);
    const service_list = eventMap.getList('service');

    assert.ok(service_list instanceof Map);
    assert.ok(service_list.size === 3);

    let service_1 = service_list.get('s-1');
    expect(service_1.id === 's-1');

  });

  it(".getList() returns list with criteria", function () {

    const eventMap = new EventMap(fixtureEntities);

    const event_id = 'e-1';
    const listener_list = eventMap.getList('listener', {
      event_id : event_id // criteria
    });

    assert.ok(listener_list instanceof Map);
    assert.strictEqual(listener_list.size, 2);

    let listener = listener_list.get('l-1');
    assert(listener.event_id === 'e-1');
    

  });



});