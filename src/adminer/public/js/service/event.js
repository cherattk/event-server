import EventSet from 'eventset';

// ui
const UIEvent = EventSet.Topic('ui-event');
UIEvent.addEvent('show-event');
UIEvent.addEvent('show-service-form');
UIEvent.addEvent('show-event-form');
UIEvent.addEvent('show-listener-form');

// DataEvent
const DataEvent = EventSet.Topic('data-event');
['service' , 'event' , 'listener'].forEach(function(type){

  DataEvent.addEvent('update-list-' + type);
  DataEvent.addEvent('update-element-' + type);
});

export { UIEvent  , DataEvent }