import React from 'react';

import ElementListener from './element-listener';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/ui-event';

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

  renderEmptyState() {
    return (
      <li className="empty-panel">
        <p>There is no registered Listener</p>
      </li>
    );
  }

  renderList() {
    var list = [];
    this.state.list_listener.forEach(function (listener, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-listener-list';
      list.push(<ElementListener key={_key} listener_id={listener.id} />);
    }, this);

    return list;
  }

  render() {
    return (
      <div className="card element list-listener">
        <h5 className="card-header element-card-header"> Listeners </h5>
        
        <ul className="list-group list-group-flush element-list">
          { this.state.list_listener.length > 0 ? this.renderList() : this.renderEmptyState()}
        </ul>
      </div>
    );
  }
}