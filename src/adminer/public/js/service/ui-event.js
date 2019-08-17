import EventSet from 'eventset';

var UIEvent = EventSet.Topic('ui-event');

UIEvent.addEvent('show-event');
UIEvent.addEvent('show-service-form');
UIEvent.addEvent('show-event-form');
UIEvent.addEvent('data-update-service');
UIEvent.addEvent('data-update-event');

export default UIEvent;