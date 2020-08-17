import React from 'react';
import ListListener from './list-listener';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: {
        id: '',
        type: 'event',
        event_name: '',
        service_id: '',
        description: ''
      },
      service : {
        name: '',
        host: ''
      }
    };

    this.listenerArray = [];

  }


  updateState = function(event_id){
    this.setState(function () {

      var __event = EventMapManager.getData('event', event_id);
      var __service = EventMapManager.getData('service', __event.service_id);
      return { 
        event : __event,
        service : {
          name: __service.name,
          host: __service.host,
        }
      }
    });
  }

  componentDidMount() {
    let event_id = this.props.event_id;
    var self = this;
    ////////////////////////////////////////////////////////
    // triggered event updating the event data
    var __updaterListener = DataEvent.addListener('update-element-event', function () {
      self.updateState(event_id);
    });

    // triggered when updating the service data
    var __updaterListener = DataEvent.addListener('update-element-service', function (event) {
      if(event.message.id === self.state.event.service_id){
        // update local service state
        self.setState(function () {
          var __service = EventMapManager.getData('service', self.state.event.service_id);
          return {
            service : {
              name: __service.name,
              host: __service.host,
            }
          }
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
    let event_name = this.state.event.event_name;
    // todo : use some modal component
    var msg = `You are going to delete the event : + ${event_name} \n Are you sure ?`;
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
          {"#" + this.props.index + " - " + event.event_name}
        </h5>
        <div className="collapse element-content" id={"event-" + event.id}>
          <p>
            <label>ID </label>
            <span>{event.id}</span>
          </p>
          <p>
            <label>Event Name</label>
            <span> {event.event_name} </span>
          </p>
          <p>
            <label>Publisher</label>
            <span>{service.name}</span>
          </p>
          <p>
            <label>Source</label>
            <span>{service.host}</span>
          </p>
          <p>
            <label>Spec Version </label>
            <span>1.0</span>
          </p>
          <p>
            <label>Event Type </label>
            <span>String</span>
          </p>
          <p>
            <label>Content Type </label>
            <span>JSON</span>
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