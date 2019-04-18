const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');

const Fixture = require('../fixture/fixture-factory');
const EntityStoreFile = path.resolve('./test/fixture/entity-store.spec.json');
const EntityLoader = require('../../src/lib/entity-loader');

describe("Test EntityLoader", function () {

  // beforeEach('populate EntityStoreFile', function () {
  //   let fakeStore = Fixture.EntityStore();
  //   fs.writeFileSync(EntityStoreFile, JSON.stringify(fakeStore),
  //     () => console.log('populate EntityStoreFile'));
  // });

  // after('clear EntityStoreFile', function () {
  //   fs.writeFileSync(EntityStoreFile, '', () => console.log('done'));
  // });

  it(".loadEventStore() returns valid EventStore Object", function () {

    var eventStore = EntityLoader.loadEventStore(EntityStoreFile);

    // eventStore is an instance of Map Object
    expect(eventStore).to.be.an('Map');
    
    // 'event-1-id' is a fixture value 
    // @see fixture/entity-store.spec.json 
    const eventEntity = eventStore.get('event-1-id');

    expect(eventEntity).to.have.property('type');
    expect(eventEntity).to.have.property('id');
    expect(eventEntity).to.have.property('service_id');
    expect(eventEntity).to.have.property('name');
    expect(eventEntity).to.have.property('desc');

    const listenerList = eventEntity.listener;
    expect(listenerList).to.be.an('array');

  });

});