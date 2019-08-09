import React from 'react';
import ListListener from './list-listener';
import UIEvent from './ui-event';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: props.data
    }
  }

  getEventForm(e){
    UIEvent.dispatch('show-event-form' ,  this.state.event);
    console.log(e.taget);
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
              <button className="btn btn-primary" type="button"
                     onClick={this.getEventForm.bind(this)}>
                Edit Event
              </button>
            </div>
          </div>
        </div>

        <div>
          <h4>Listeners Endpoint</h4>
          <div className="el-content">
            <ListListener />
          </div>
        </div>

      </li>
    );
  }
}