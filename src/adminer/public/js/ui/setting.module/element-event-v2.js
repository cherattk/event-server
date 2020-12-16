import React from 'react';
import ListListener from './list-listener';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: {
        /**
         * EventMap Attributes
         */
        id: '',
        type: 'event',
        service_id: '', // the service that the event is belong to
        description: '',
        name : '', // convenient name 

        /** 
         * cloudevent attributes
         * */
        ce_specversion: "1.0",
        ce_type: '',
        ce_source : '',
        ce_datacontenttype : ''
      },
      service: {
        name: ''
      },
      showElement: false
    };

    this.listenerArray = [];

  }


  updateState = function (event_id) {
    this.setState(function () {

      var __event = EventMapManager.getData('event', event_id);
      var __service = EventMapManager.getData('service', __event.service_id);
      __event.ce_source = __service.host;
      return {
        event: __event,
        service: {
          name: __service.name
        }
      }
    });
  }

  componentDidMount() {
    let event_id = this.props.event_id;
    var self = this;
    ////////////////////////////////////////////////////////
    // triggered event updating the event data
    var __updaterListener = DataEvent.addListener('update-element-event', function (ev) {
      self.updateState(event_id);
    });

    // triggered when updating the service data
    var __updaterListener = DataEvent.addListener('update-element-service', function (ev) {
      if (ev.message.id === self.state.event.service_id) {
        // update local service state
        self.setState(function () {
          self.updateState(event_id);
        })
      }
    });

    // init state
    self.updateState(event_id);

    // to remove listener
    this.listenerArray.push(__updaterListener);
  }

  componentWillUnmount() {
    this.listenerArray.forEach(element_id => {
      DataEvent.removeListener(element_id);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.event_id !== prevProps.event_id) {
      let event_id = this.props.event_id;
      this.setState(function () {
        return { event: EventMapManager.getData('event', event_id) }
      });
    }
  }

  getEventForm() {
    UIEvent.dispatch('show-event-form', { event_id: this.props.event_id });
  }

  deleteEvent() {
    let ce_type = this.state.event.ce_type;
    // todo : use some modal component
    var msg = `You are going to delete the event : + ${ce_type} \n Are you sure ?`;
    let ok = confirm(msg);
    if (ok) {
      EventMapManager.deleteData(this.state.event);
    }
  }

  getListenerForm() {
    var event_id = this.state.event.id;
    UIEvent.dispatch('show-listener-form', { event_id: event_id });
  }

  render() {
    let event = this.state.event;
    return (
      <li key={event.id} className="list-group-item"
          onClick={this.getEventForm.bind(this)}>

    {this.props.index + 1} - {event.name}

      </li>
    );
  }
}