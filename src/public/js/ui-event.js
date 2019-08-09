import EventSet from 'eventset';

var UIEvent = EventSet.Topic('topic-1');

UIEvent.addEvent('show-event');
UIEvent.addEvent('show-service-form');
UIEvent.addEvent('show-event-form');

export default UIEvent;