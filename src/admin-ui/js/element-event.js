import React from 'react';
import ListListener from './list-listener';

export default class ElementEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      event: props.data
    }
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
              <button class="btn btn-primary" type="button"
                      data-toggle="modal" data-target="#eventForm">
                Edit
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