const assert = require('assert');
const EventMap = require('../src/core/eventmap.js');
const fs = require('fs');

const eventFile = './config/event.map.json';

describe("Test EventMap Object", function () {

    beforeEach('clear MapFile', function () {
        fs.writeFileSync(eventFile, '', () => console.log('done'));
    });

    after('clear MapFile', function () {
        fs.writeFileSync(eventFile, '', () => console.log('done'));
    });

    it("Test .add()", function () {

        var ctrl = new EventMap();
        var serviceID = ctrl.add({
            type: "service",
            data: "entity-data"
        });

        ctrl.add({
            type: "event",
            parent_id: serviceID,
            data: "entity-data"
        });

        assert.strictEqual(ctrl.length("service"), 1);
        assert.strictEqual(ctrl.length("event"), 1);
    });

    it("Test .getById()", function () {

        var ctrl = new EventMap();
        var serviceID = ctrl.add({
            type: "service",
            data: "service-data"
        });

        var eventID = ctrl.add({
            type: "event",
            parent_id: serviceID,
            data: "event-data"
        });

        var service = ctrl.getById("service" , serviceID);
        assert.strictEqual(service.id, serviceID);
        assert.strictEqual(service.data, "service-data");

        var event = ctrl.getById("event" , eventID);
        assert.strictEqual(event.id, eventID);
        assert.strictEqual(event.data, "event-data");


    });

    it("Test .removeById()", function () {

        var ctrl = new EventMap();
        var serviceID = ctrl.add({
            type: "service",
            data: "service-1"
        });

        ctrl.add({
            type: "service",
            data: "service-2"
        });

        ctrl.add({
            type: "event",
            parent_id: serviceID,
            data: "event-1"
        });

        // this will remove service and attached events
        ctrl.removeById("service" , serviceID);

        assert.strictEqual(ctrl.length("service"), 1);
    });

});