import React from 'react';
import ListListener from './list-listener';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/event';

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

  getForm() {
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

  render() {
    let event = this.state.event;
    return (
      <li key={event.id} className="el-event">
        <div>
          <h4>
            <span>Service : {this.props.service_name}</span>
            <span>Event : {event.event_name}</span>
          </h4>
          <div className="el-content">
            <p>
              <label>id :</label>{event.id}
            </p>
            <p>
              <label>name :</label>{event.event_name}
            </p>
            <p>
              <label>description :</label>{event.description}
            </p>
            <div className="el-control">
              <button className="btn btn-primary btn-sm" type="button"
                onClick={this.getForm.bind(this)}>
                Edit Event
              </button>
              <button className="btn btn-danger btn-sm" type="button"
                onClick={this.deleteEvent.bind(this)}>
                Delete Event
              </button>
            </div>
          </div>
        </div>
        <div>
          <h4>Listeners</h4>
          <div className="el-content">
            <ListListener event_id={this.state.event.id} />
          </div>
        </div>

      </li>
    );
  }
}