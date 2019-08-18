import React from 'react';
import ListListener from './list-listener';
import DataManager from '../service/event-map-manager';
import {UIEvent , DataEvent} from '../service/event';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: props.data
    }

    const self = this;

    ////////////////////////////////////////////////////////
    DataEvent.addListener('update-element-event', function () {
      self.setState(function () {
        let event_id = self.state.event.id;
        return { event: DataManager.getData('event', event_id) }
      });
    });
  }

  getForm() {
    UIEvent.dispatch('show-event-form', { id : this.state.event.id});
  }

  deleteEvent(){
    let event_id = this.state.event.id;
    // todo : use some modal component
    alert('you are going to delete the event : ' + event_id);
    DataManager.deleteData(this.state.event);
  }

  render() {
    let event = this.state.event;
    return (
      <li key={event.id} className="el-event">
        <div>
          <h4> Event </h4>
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
              <button className="btn btn-secondary btn-sm" type="button"
                onClick={this.getForm.bind(this)}>
                Edit Event
              </button>
            </div>
            <div className="el-control">
              <button className="btn btn-secondary btn-sm" type="button"
                onClick={this.deleteEvent.bind(this)}>
                Delete Event
              </button>
            </div>
          </div>
        </div>

        <div>
          <h4>Listeners</h4>
          <div className="el-content">
            <ListListener />
          </div>
        </div>

      </li>
    );
  }
}