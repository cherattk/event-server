import React from 'react';

import ElementListener from './element-listener';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';

export default class ListListener extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list_listener: []
    }

  }

  componentDidMount() {
    var self = this;
    var __event_id = this.props.event_id;
    DataEvent.addListener('update-list-listener', function (dataEvent) {
      if (dataEvent.message.event_id === __event_id) {
        self.setState(function () {
          var data = EventMapManager.getDataList('listener', { event_id: __event_id });
          return { list_listener: data }
        });
      }
    });

    this.setState(function () {
      var data = EventMapManager.getDataList('listener', { event_id: __event_id });
      return { list_listener: data };
    });
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.event_id !== prevProps.event_id) {
  //     let __event_id = this.props.event_id;
  //     this.setState(function () {
  //       var data = EventMapManager.getDataList('listener', { event_id: __event_id });
  //     return { list_listener: data };
  //     });
  //   }
  // }

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
      <div className="list-listener">
        <h5> Listeners </h5>
        <ul>
          {this.state.list_listener.length > 0 ? this.renderList() : this.renderEmptyState()}
        </ul>
      </div>
    );
  }
}