const assert = require('assert');
const sinon = require('sinon');

const EventMap = require('../../src/lib/event-map');
const Fixture = require('../fixture/fixture-factory');

const MapLoader = {
    saveEventMap : () => true,
    loadEventMap : () => Fixture.EventMap()
  };

describe("Test EventMap", function () {

  beforeEach(function(){
    sinon.restore();
  });

  it("Test .generateID() : generate ID for Service entity", function () {
          
    var __eventMap = new EventMap();
    var service = {
            type: "service",
            name: "service name value"
          };
    assert.strictEqual(__eventMap.generateID(service),
          "service-name-value" , // service.name
    );

  });

  it("Test .add()", function () {

    sinon.spy(MapLoader , 'saveEventMap');
    var __eventMap = new EventMap(MapLoader);
        __eventMap.add({
          type: "service",
          name: "entity-data"
        });

    const exptected = Fixture.EventMap().service.size + 1;
    assert.strictEqual(__eventMap.length("service"), exptected);

    assert(MapLoader.saveEventMap.calledOnce);

  });

  it("Test .removeById()", function () {

    sinon.spy(MapLoader , 'saveEventMap');
    var __eventMap = new EventMap(MapLoader);

    // get id of the first fake service
    const service_id = Fixture.serviceData().id;
    __eventMap.removeById("service", service_id);

    const exptected = Fixture.EventMap().service.size - 1;
    assert.strictEqual(__eventMap.length("service"), exptected);

    assert(MapLoader.saveEventMap.calledOnce);
  });

  
  it("Test .getList()", function () {

    var __eventMap = new EventMap(MapLoader);

    const event_id = Fixture.eventData().id;
    var result = __eventMap.getList("listener", event_id);
    assert.strictEqual(Array.isArray(result) , true);
    assert.strictEqual(result.length , 2);

  });

  it("Test .getById()", function () {

    var __eventMap = new EventMap(MapLoader);

    const listener_id = Fixture.listener_1_Data().id;
    var result = __eventMap.getById("listener", listener_id);

    assert.strictEqual(result.id, listener_id);

  });

});