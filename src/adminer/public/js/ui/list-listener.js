import React from 'react';

import ElementListener from './element-listener';
import EventMapManager from '../service/event-map-manager';
import {UIEvent} from '../service/event';

export default class ListListener extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_listener: []
    }
  }

  componentDidMount() {
    this.setState(function () {
      return { list_listener: EventMapManager.getDataList('listener') }
    });
  }

  renderList() {
    var list = [];
    this.state.list_listener.forEach(function (listener, idx) {
      list.push(<ElementListener key={idx + 'listener-list'} data={listener} />);
    }, this);

    return list;
  }

  getForm() {
    UIEvent.dispatch('show-listener-form');
  }

  render() {
    return (
      <React.Fragment>
      <button type="button" className="btn btn-primary btn-sm btn-block add-listener"
          onClick={this.getForm.bind(this)}>
        Add Listener
      </button>
      <ul className="list-listener">
        {this.renderList()}
      </ul>
      </React.Fragment>
    );
  }
}