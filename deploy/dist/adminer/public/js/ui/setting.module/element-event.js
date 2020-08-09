import React from 'react';
import ListListener from './list-listener';
import EventMapManager from '../../service/eventmap-manager';
import { UIEvent, DataEvent } from '../../service/ui-event';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: {
        id: '',
        type: 'event',
        event_name: '',
        service_id: '',
        service_name: '',
        service_host: '',
        description: ''
      }
    };

    this.listenerArray = [];

  }

  componentDidMount() {
    let event_id = this.props.event_id;
    var self = this;
    ////////////////////////////////////////////////////////
    var _listener_for_update = DataEvent.addListener('update-element-event', function () {
      self.setState(function () {
        return { event: EventMapManager.getData('event', event_id) }
      });
    });
    this.setState(function () {
      return { event: EventMapManager.getData('event', event_id) }
    });

    this.listenerArray.push(_listener_for_update);
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
    return (
      <li key={event.id} className="element">

        <h5 className="element-card-header theme-bg-bluegray"
          data-toggle="collapse"
          data-target={"#event-" + event.id}>
          {"#" + this.props.index + " - "+ event.event_name}
        </h5>
        <div className="collapse element-content" id={"event-" + event.id}>
          <p>
            <label>Event :</label>{event.event_name}
          </p>
          <p>
            <label>ID :</label>{event.id}
          </p>
          <p>
            <label>Published By :</label>{event.service_name}
          </p>
          <p>
            <label>description :</label>{event.description}
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