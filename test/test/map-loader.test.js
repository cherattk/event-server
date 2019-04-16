const assert = require('assert');
const fs = require('fs');
const path = require('path');

const Fixture = require('../fixture/fixture-factory');
const EventMapFile = path.resolve('./test/fixture/fixture.event.map.json');

describe("Test MapLoader", function () {

  // before each test
  beforeEach('populate MapFile', function () {
    let fakeMap = Fixture.fakeEventMap();
    fs.writeFileSync(EventMapFile, JSON.stringify(fakeMap),
      () => console.log('populate MapFile'));
  });

  // after test suite completed
  after('clear MapFile', function () {
    fs.writeFileSync(EventMapFile, '', () => console.log('done'));
  });

  it("Test .loadEventMap()", function () {

    var entityMap = MapLoader.loadEventMap(EventMapFile);

    var service_id =  Fixture.fakeEventMap().service[0].id;
    var service = entityMap.service.get(service_id);
    
    assert.strictEqual(service.entity.id , service_id);
    assert.strictEqual(service.event.size , 1);
    
    var event_id =  Fixture.fakeEventMap().event[0].id;
    var event = entityMap.event.get(event_id);

    assert.strictEqual(event.entity.id , event_id);
    assert.strictEqual(event.listener.size , 2);

  });

});