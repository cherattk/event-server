const Fixture = {

  serviceData : () => {
    return { 
      type : "service",
      id : "fake-service-id",
      name : "fake-service-name",
      domain : 'www.service.com'
    }
  },

  eventData : () => {
    return { 
      type : "event",
      id : Fixture.serviceData().id + "::" + "fake-event",
      name : "fake-event-name",
      service_id : Fixture.serviceData().id,
      listener : []
    }
  },

  listener_1_Data : () => {
    return { 
      type : "listener",
      id   : Fixture.eventData().id + "::" + "fake-listener" + '-1' ,
      url  : "fake-url-1",
      event_id : Fixture.eventData().id,
      service_id : Fixture.serviceData().id
    }
  },

  listener_2_Data : () => {
    return { 
      type : "listener",
      id : Fixture.eventData().id + "::" + "fake-listener" + '-2',
      url : "fake-url-2",
      event_id : Fixture.eventData().id,
      service_id : Fixture.serviceData().id
    }
  },

  EventStore : function() {
    const __eventStore = new Map(
      [
        [
          Fixture.eventData().id,
          Object.assign(
          Fixture.eventData() , {
            listener : [Fixture.listener_1_Data()]
          }),
        ]
      ]
    );

    return __eventStore;
  },

  EntityStore : function() {

    var fakeStore = {
      /** service Map :
       * Map<service-id , objectData >
       * objectData : { entity : serviceData , event : Map<event-id , eventData> }
       */
      service : new Map() ,
      /**
       * event Map 
       * Map<event-id , objectData >
       * objectData : { entity : eventData , listener : Map<listener-id , listenerData> }
       */
      event : new Map() ,
    };

    fakeStore.service.set(
      Fixture.serviceData().id , 
      {
        entity : Fixture.serviceData(),
        event : new Map(
          [
            [ Fixture.eventData().id, Fixture.eventData() ]
          ]
        )
      }
    );
    
    fakeStore.event.set(
      Fixture.eventData().id , 
      {
        entity : Fixture.eventData(),
        listener : new Map(
          [
            [ Fixture.listener_1_Data().id, Fixture.listener_1_Data() ],
            [ Fixture.listener_2_Data().id, Fixture.listener_2_Data() ]
          ]
        )
      }
    );

    return fakeStore;
  }
}

module.exports = Fixture;