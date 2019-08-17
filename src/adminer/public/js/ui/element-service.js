import React from 'react';
import ListEvent from './list-event';
import UIEvent from '../service/ui-event';
import EventMapManager from '../service/event-map-manager';

export default class ElementService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      service: props.data,
      showEventList: false
    }

    const self = this;
    UIEvent.addListener('data-update-service', function (uiEvent) {      
      /**
       * @important check the id first, otherwise all elemnts of the list will be updated
       *  */
      if(uiEvent.message.id === self.state.service.id){
        self.setState(function(){
          let data = EventMapManager.getData('service' , uiEvent.message.id);
          return { service : data }
        });
      }
    });
  }

  toggleEventList() {
    this.setState(function (state) {
      return { showEventList: !state.showEventList };
    })
  }

  getServiceForm(){
    UIEvent.dispatch('show-service-form' ,  { id : this.state.service.id});
  }

  render() {
    let service = this.state.service;
    let target_list_event = '#' + service.id + '-' + 'list-event';
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
            <button className="btn btn-primary btn-sm" type="button"
                    onClick={this.getServiceForm.bind(this)}>
              Edit Service
            </button>
          </div>
        </div>

        <h5 className="toggle-content dropdown-toggle"
            data-toggle="collapse" data-target={target_list_event}
            role="button" aria-expanded="false" aria-controls="list-event">
          {/* onClick={this.toggleEventList.bind(this)}> */}
          List of events
        </h5>

        <ListEvent service_id={service.id}/>
      </li>
    );
  }
}