import React from 'react';
import ElementEvent from './element-event';
import EventMapManager from '../service/event-map-manager';
import {DataEvent} from '../service/event';

export default class ListEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_event: []
    }
  }

  componentDidMount() {
    var self =this;
    this.setState(function () {
      let criteria = {service_id : self.props.service_id};
      return { list_event: EventMapManager.getDataList('event' , criteria) }
    });

    DataEvent.addListener('update-list-event' , function(dataEvent){
      if(dataEvent.message.service_id === self.props.service_id){
          self.setState(function () {
            let criteria = { service_id : dataEvent.message.service_id};
            return { 
              list_event: EventMapManager.getDataList('event' , criteria) }
          });
      }
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