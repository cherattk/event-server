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
      showElement: false
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

  toggleElement() {
    this.setState(function (state) {
      return { showElement: !state.showElement };
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

        <h5 className={`element-card-header ${this.state.showElement ? "active" : ""}`}
          onClick={this.toggleElement.bind(this)}>
          {service.name}
        </h5>

        {/* <div className="collapse element-content" id={"service-" + service.id}> */}
        <div className={`element-content ${this.state.showElement ? "show" : "hide"}`}
          id={"service-" + service.id}>
          <p>
            <label>Service Name</label>
            <span>{service.name}</span>
          </p>
          <p>
            <label>Auth Token</label>
            <span>{service.id}</span>
          </p>
          <p>
            <label>description </label>
            <span>{service.description}</span>
          </p>

          <div class="service-tab">
            <h5 data-toggle="collapse" data-target="#service-list-event" class="element-card-header">
              Triggered events
            </h5>
            <div id="service-list-event" class="collapse">
              <ul class="list-group">
                <li class="list-group-item">Cras justo odio</li>
                <li class="list-group-item">Dapibus ac facilisis in</li>
                <li class="list-group-item">Morbi leo risus</li>
                <li class="list-group-item">Porta ac consectetur ac</li>
                <li class="list-group-item">Vestibulum at eros</li>
              </ul>
            </div>
          </div>

          <div class="service-tab">
            <h5 data-toggle="collapse" data-target="#service-list-listener" class="element-card-header">
              Listening endpoints
            </h5>
            <div id="service-list-listener" class="collapse">
              <ul class="list-group">
                <li class="list-group-item">http://service-name.com/endpoint-1</li>
                <li class="list-group-item">http://service-name.com/endpoint-2</li>
                <li class="list-group-item">http://service-name.com/endpoint-3</li>
                <li class="list-group-item">http://service-name.com/endpoint-4</li>
                <li class="list-group-item">http://service-name.com/endpoint-5</li>
              </ul>
            </div>
          </div>
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
      </li >
    );
  }
}