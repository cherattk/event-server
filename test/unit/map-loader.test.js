const assert = require('assert');
const expect = require('chai').expect;

// *********************************************************************
const MapLoader = require('../../src/core/map-loader');

const path = require('path');
const FixtureMapFile = path.resolve('./test/fixture/fixture-eventmap.test.json');

describe("MapLoader", function () {

  /**
   * this method is used by eventserver for dispatching
   * @see eventserver/EventDispatcher class
   */
  it('.loadEventList()', function () {

    var loader = new MapLoader(FixtureMapFile);

    var eventList = loader.loadEventList();

    expect(eventList).to.have.property('type');
    
  });
  

  /**
   * this method is used by EventMap class
   * @see core/EventMap class
   */
  it(".loadEventMap() Test Entitie properties", function () {

    var _map = EventMap.loadEventMap();

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

});