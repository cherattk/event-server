import React from 'react';

export default class ElementListener extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listener : props.data
    }
  }

  render() {
    let listener = this.state.listener;
    return (
      <li id={listener.id}>
        {listener.endpoint}
      </li>
    );
  }
}