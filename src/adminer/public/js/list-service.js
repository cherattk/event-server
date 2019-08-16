import React from 'react';
import ElementService from './element-service';
import EventMapManager from './module/event-map-manager';

export default class ListService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_service: []
    }
  }

  componentDidMount(){
    this.setState(function(){
      return { list_service : EventMapManager.getDataList('service' , null) }
    });
  }

  renderList() {
    var list = [];
    this.state.list_service.forEach(function (service, idx) {
      list.push(<ElementService key={idx + 'service-list'} data={service}/>);
    }, this);

    return list;
  }

  render() {
    const list = this.renderList();
    return (
      <div className="list-service">
        <ul>
          {list}
        </ul>        
      </div>      
    );
  }
}