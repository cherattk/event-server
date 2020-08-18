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
      }
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
    let service = this.state.service;
    return (
      <li key={event.id} className="element">

        <h5 className="element-card-header theme-bg-bluegray"
          data-toggle="collapse"
          data-target={"#event-" + event.id}>
          {"#" + this.props.index + " - " + event.ce_type}
        </h5>
        <div className="collapse element-content" id={"event-" + event.id}>
          <p>
            <label>Spec Version </label>
            <span>{event.ce_specversion}</span>
          </p>
          <p>
            <label>Service Name</label>
            <span>{service.name}</span>
          </p>
          <p>
            <label>Event Type</label>
            <span> {event.ce_type} </span>
          </p>
          <p>
            <label>Event Source</label>
            <span>{event.ce_source}</span>
          </p>
          <p>
            <label>Data Content Type </label>
            <span>{event.ce_datacontenttype}</span>
          </p>
          <p>
            <label>Description </label>
            <span>{event.description}</span>
          </p>

          <div className="element-control">
            <button className="btn btn-primary btn-sm" type="button"
              onClick={this.getEventForm.bind(this)}>
              Edit Event
              </button>
            <button className="btn btn-danger btn-sm" type="button"
              onClick={this.deleteEvent.bind(this)}>
              Delete Event
              </button>
            <button className="btn btn-info btn-sm" type="button"
              onClick={this.getListenerForm.bind(this)}>
              Add Listener
            </button>
          </div>

          <ListListener event_id={this.state.event.id} />

        </div>

      </li>
    );
  }
}