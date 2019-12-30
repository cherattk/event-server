import React from 'react';
import ElementEvent from './element-event';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/ui-event';

export default class ListEvent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list_event: []
    };
  }

  componentDidMount() {
    var self = this;
    DataEvent.addListener('update-list-event', function () {
      self.setState(function () {
        return self.getEventList();
      });
    });
    DataEvent.addListener('update-list-service', function () {
      self.setState(function () {
        return self.getEventList();
      });
    });

    this.setState(function () {
      return self.getEventList();
    });

  }

  getEventList() {
    // var data = EventMapManager.getDataList('event', { service_id: _service_id });
    var data = EventMapManager.getDataList('event');
    return { list_event: data }
  }

  getEventForm() {
    UIEvent.dispatch('show-event-form');
  }

  renderList() {
    var list = [];
    // return event list
    this.state.list_event.forEach(function (event, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-event-list';
      list.push(<ElementEvent key={_key} event_id={event.id} index={idx + 1}/>);
    });
    return list;
  }

  renderEmptyState() {
    return (
      <li className="empty-panel">
        <h3>There is no registered Event</h3>
      </li>
    );
  }

  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-info btn-sm btn-add"
          onClick={this.getEventForm.bind(this)}>
          new event
          </button>
        <ul className="list-element">
          {this.state.list_event.length > 0 ? this.renderList() : this.renderEmptyState()}
        </ul>
      </React.Fragment>
    );
  }
}