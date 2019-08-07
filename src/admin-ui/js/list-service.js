import React from 'react';
import ElementService from './element-service';
import DataManager from './data-manager';
import FormService from './form-service';

export default class ListService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_service: []
    }
  }

  componentDidMount(){
    this.setState(function(){
      return { list_service : DataManager.getServiceList() }
    });
  }

  renderList() {
    var list = this.state.list_service.map(function (service, idx) {
      return (<ElementService key={idx + 'service-list'} data={service}/>)
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
        <FormService/>
      </div>      
    );
  }
}