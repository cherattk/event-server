const Fixture = {

  service_1_Data : () => {
    return { 
      type : "service",
      id : "s-1",
      name : "service-1-name",
      domain : 'www.service-1.com',
      desc: 'Service description'
    }
  },
  service_2_Data : () => {
    return { 
      type : "service",
      id : "s-2",
      name : "service-2-name",
      domain : 'www.service-2.com',
      desc: 'Service description'
    }
  },
  service_3_Data : () => {
    return { 
      type : "service",
      id : "s-3",
      name : "service-3-name",
      domain : 'www.service-3.com',
      desc: 'Service description'
    }
  },

  eventData : () => {
    return { 
      type : "event",
      id : "e-1",
      service_id : Fixture.service_1_Data().id,
      name : "fake-event-name",
      listener : []
    }
  },

  listener_1_Data : () => {
    return { 
      type : "listener",
      id   : Fixture.eventData().id ,
      service_id : Fixture.service_2_Data().id ,
      event_id   : Fixture.eventData().id ,
      name : 'listener-1',
      domain  : Fixture.service_2_Data().domain,
      path : '/listener-1-path'
    }
  },

  listener_2_Data : () => {
    return {
      type : "listener",
      id :  'l-2',
      service_id : Fixture.service_3_Data().id,
      event_id : Fixture.eventData().id,
      name : 'listener-2',
      domain  : Fixture.service_3_Data().domain,
      path : '/listener-2-path'
    }
  },

  // used by dispatcher
  EventList : function() {

    let list = new Map();

    let eventData = Fixture.eventData();
        eventData.listener.push( Fixture.listener_1_Data() );
        eventData.listener.push( Fixture.listener_2_Data() );

    list.set(eventData.id , eventData);

    return list;
  },

  // used by manager
  EventMap : function() {

    var _map = {
      service : new Map() ,
      event : new Map(),
      listener : new Map()
    };

    // service ------------------------
    _map.service.set(
      Fixture.service_1_Data().id , 
      Fixture.service_1_Data()
    );
    _map.service.set(
      Fixture.service_2_Data().id , 
      Fixture.service_2_Data()
    );
    
    // event ------------------------
    _map.event.set(
      Fixture.eventData().id , 
      Fixture.eventData()
    );

    // listener ------------------------
    _map.listener.set(
      Fixture.listener_1_Data().id , 
      Fixture.listener_1_Data()
    );

    _map.listener.set(
      Fixture.listener_2_Data().id , 
      Fixture.listener_2_Data()
    );

    return _map;
  },

  // log Format 
  loggingFormat : {
    publishQuery : {

    },
    event : {

    },
    error : {
      
    }
  } 
}

module.exports = Fixture;