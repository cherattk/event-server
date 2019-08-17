import React from 'react';
import ElementEvent from './element-event';
import EventMapManager from '../service/event-map-manager';

export default class ListEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_event: []
    }
  }

  componentDidMount() {
    this.setState(function () {
      return { list_event: EventMapManager.getDataList('event') }
    });
  }

  renderList() {
    var list = [];
    this.state.list_event.forEach(function (event, idx) {
      list.push(<ElementEvent key={idx + 'event-list'} data={event} />);
    }, this);

    return list;
  }

  render() {
    const list_event = this.renderList();
    // let showClass = "list-event " + ( this.props.show ? 'show' : 'hide');
    // the divId is used by bootstrap to toggle
    let divId = this.props.service_id + '-' + 'list-event';
    return (
      <div id={divId} className="collapse list-event">
        <ul>
          {list_event}
        </ul>
      </div>
    );
  }
}