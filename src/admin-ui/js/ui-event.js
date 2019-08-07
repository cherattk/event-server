import EventSet from 'eventset';

var UIEvent = EventSet.Topic('topic-1');

UIEvent.addEvent('show-event');

export default UIEvent;