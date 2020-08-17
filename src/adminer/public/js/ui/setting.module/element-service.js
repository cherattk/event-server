import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';


const __initialState = {
  id: "",
  type: "service",
  name: "",
  host: "",
  description: ""
};

export default class ElementService extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      service: __initialState,
      showEventList: false
    }
  }

  componentDidMount() {
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

    this.setState(function () {
      return { service: EventMapManager.getData('service', self.props.service_id) }
    });
  }

  componentWillUnmount() {
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

  deleteService() {
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
      <li key={service.id} id={service.id} className="element">

        <h5 className="element-card-header theme-bg-bluegray"
          data-toggle="collapse"
          data-target={"#service-" + service.id}>
          {"#" + this.props.index + " - " + service.name}
        </h5>

        <div className="collapse element-content" id={"service-" + service.id}>
          <p>
            <label>Service Name</label>{service.name}
          </p>
          {/* <p>
              <label>ID</label> : {service.id}
            </p> */}
          <p>
            <label>host </label>{service.host}
          </p>
          <p>
            <label>description </label>{service.description}
          </p>

          <div className="element-control">
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
      </li>
    );
  }
}