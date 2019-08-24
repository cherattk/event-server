import React from 'react';

import ElementListener from './element-listener';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/event';

export default class ListListener extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list_listener: []
    }

  }

  componentDidMount() {
    var self = this;

    this.setState(function () {
      return {
        list_listener:
          EventMapManager.getDataList('listener', { event_id: self.props.event_id })
      }
    });

    DataEvent.addListener('update-list-listener', function (dataEvent) {
      if (dataEvent.message.event_id === self.props.event_id) {
        self.setState(function () {
          return {
            list_listener:
              EventMapManager.getDataList('listener', { event_id: self.props.event_id })
          }
        });
      }
    });
  }

  getForm() {
    UIEvent.dispatch('show-listener-form', { event_id: this.props.event_id });
  }

  renderList() {
    var list = [];
    this.state.list_listener.forEach(function (listener, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-listener-list';
      list.push(<ElementListener key={_key} listener_id={listener.id} />);
    }, this);

    return list;
  }

  emptyState() {
    return <li className="empty-list">Empty Listener List</li>
  }

  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-info btn-sm btn-add"
          onClick={this.getForm.bind(this)}>
          Add Listener
      </button>
        <ul className="list-listener">
          {this.state.list_listener.length > 0 ?
            this.renderList() : this.emptyState()
          }
        </ul>
      </React.Fragment>
    );
  }
}