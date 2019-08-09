import React from 'react';
import ListEvent from './list-event';
import UIEvent from './ui-event';

export default class ElementService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      service: props.data,
      showEventList: false
    }
  }

  toggleEventList() {
    this.setState(function (state) {
      return { showEventList: !state.showEventList };
    })
  }

  getServiceForm(){
    UIEvent.dispatch('show-service-form' ,  this.state.service);
  }

  render() {
    let service = this.state.service;
    return (
      <li key={service.id} id={service.id} className="el-service">

        <div className="el-content">
          <label>id</label> : {service.id}
          <br />
          <label>name</label> : {service.name}
          <br />
          <label>host</label> : {service.host}
          <br />
          <label>description</label> : {service.description}
          <br />

          <div className="el-control">
            <button className="btn btn-primary" type="button"
                    onClick={this.getServiceForm.bind(this)}>
              Edit Service
            </button>
          </div>
        </div>

        <div className="toggle-list-event"
          onClick={this.toggleEventList.bind(this)}>
          List of Events
        </div>

        <ListEvent service_id={service.id} show={this.state.showEventList} />
      </li>
    );
  }
}