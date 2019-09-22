import React from 'react';
import ElementEvent from './element-event';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/event';

export default class ListEvent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list_event: []
    };
  }

  componentDidMount() {
    var self = this;
    DataEvent.addListener('update-list-event', function (dataEvent) {
      return self.getEventList();
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
    UIEvent.dispatch('show-event-form', { service_id: this.props.service_id });
  }

  renderList() {
    var list = [];
    // return event list
    this.state.list_event.forEach(function (event, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-event-list';
      list.push(<ElementEvent key={_key} event_id={event.id} />);
    });
    return (
      <ul className="list-event-content">
        {list}
      </ul>
    );
  }

  renderEmptyState() {
    return <div className="empty-list">Empty Event List</div>
  }

  render() {
    return (
      <div className="list-event">
        <div className="list-control">
          {/* add filter control later */}
          <button type="button" className="btn btn-info btn-sm btn-add"
            onClick={this.getEventForm.bind(this)}>
            Add Event
          </button>
        </div>

        {this.state.list_event.length > 0 ? this.renderList() : this.renderEmptyState()}
      </div>
    );
  }
}