import React from 'react';

export default class ElementActivityEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activity: props.activity
    }
  }

  render() {
    let activity = this.state.activity;
    return (
      <div>
        <label>event id : </label> {activity.event_id} <br/>
        <label>name : </label>{activity.name} <br/>
        <label>service id : </label> {activity.service_id} <br/>
        <label>description : </label> 
        <p>{activity.description} </p>
        <label>payload : </label>
        <pre>
          {JSON.stringify(activity.message)}
        </pre>
      </div>
    );
  }
}