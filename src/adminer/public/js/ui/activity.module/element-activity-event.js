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
      <React.Fragment>
        <label>message : </label>
        <pre>
          {JSON.stringify(activity.message)}
        </pre>
      </React.Fragment>
    );
  }
}