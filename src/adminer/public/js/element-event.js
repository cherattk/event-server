import React from 'react';
import ListListener from './list-listener';
import UIEvent from './module/ui-event';
import DataManager from './module/event-map-manager';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: props.data
    }

    const self = this;
    ////////////////////////////////////////////////////////
    UIEvent.addListener('data-update-event', function () {
      self.setState(function(){
        let event_id = self.state.event.id;
        return { event : DataManager.getData('event' , event_id) }
      });
    });
  }

  getEventForm(){
    UIEvent.dispatch('show-event-form' ,  this.state.event);
  }

  render() {
    let event = this.state.event;
    return (
      <li key={event.id} className="el-event">
        <div>
          <h4> Event </h4>
          <div className="el-content">
            <label>id</label> : {event.id}
            <br />
            <label>name</label> : {event.name}
            <br />
            <label>description</label> : {event.description}
            <br />

            <div className="el-control">
              <button className="btn btn-secondary btn-sm" type="button"
                     onClick={this.getEventForm.bind(this)}>
                Edit Event
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