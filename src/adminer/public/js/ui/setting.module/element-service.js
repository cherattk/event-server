import React from 'react';
import ListEvent from './list-event';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/event';

export default class ElementService extends React.Component {

  constructor(props) {
    super(props);

    const self = this;
    this.initialState = {
      id: "",
      type : "service",
      name: "",
      host: "",
      description: ""
    };

    this.state = {
      service: [],
      showEventList: false
    }
  }

  componentDidMount(){
    var self = this;
    DataEvent.addListener('update-element-service', function (uiEvent) {
      /**
       * @important check the id first, 
       * otherwise all elemnts of the list will be updated
       *  */
      if (uiEvent.message.id === self.props.service_id) {
        self.setState(function () {
          return { service: EventMapManager.getData('service', self.props.service_id) }
        });
      }
    });

    this.setState(function(){
      return { service : EventMapManager.getData('service', self.props.service_id)}
    });
  }

  componentWillUnmount(){
    // todo : remove eventset.listener
  }

  toggleEventList() {
    this.setState(function (state) {
      return { showEventList: !state.showEventList };
    })
  }

  getServiceForm() {
    /**
     * @important use state.service.id here, not props.service_id
     */
    UIEvent.dispatch('show-service-form', { id: this.state.service.id });
  }

  deleteService(){
    let event_name = this.state.service.service_name;
    // todo : use some modal component
    var msg = `You are going to delete the service : + ${event_name} \n Are you sure ?`;
    let ok = confirm(msg);
    if (ok) {
      EventMapManager.deleteData(this.state.service);
    }
  }

  render() {
    var service = this.state.service;
    // let target_list_event = '#' + service.id + '-' + 'list-event';
    return (
      <li key={service.id} id={service.id} className="el-service">

        <div className="el-content">
          <p>
            <label>id</label> : {service.id}
          </p>
          <p>
            <label>name</label> : {service.name}
          </p>
          <p>
            <label>host</label> : {service.host}
          </p>
          <p>
            <label>description</label> : {service.description}
          </p>

          <div className="el-control">
            <button className="btn btn-primary btn-sm" type="button"
              onClick={this.getServiceForm.bind(this)}>
              Edit Service
            </button>
            <button className="btn btn-danger btn-sm" type="button"
              onClick={this.deleteService.bind(this)}>
              Delete Service
            </button>
          </div>
        </div>

        {/* <ListEvent service_id={service.id} service_name={service.name}/> */}
      </li>
    );
  }
}