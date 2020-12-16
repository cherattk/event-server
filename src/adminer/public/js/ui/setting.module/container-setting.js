import React from 'react';
import ListService from './list-service';
import ListEvent from './list-event';

export default class ContainerSetting extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ListService/>
      </div>
    );
  }
}