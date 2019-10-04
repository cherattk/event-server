import React from 'react';
import ElementService from './element-service';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/ui-event';

export default class ListService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_service: []
    }
  }

  componentDidMount() {
    var self = this;
    DataEvent.addListener('update-list-service', function () {
      // triggered when adding/removing service from the list
      self.setState(function () {
        return self.getServiceList();
      });
    });

    // initial state
    var self = this;
    this.setState(function () {
      return self.getServiceList();
    });
  }

  renderEmptyState() {
    return (
      <li className="empty-panel">
        <h3>There is no Registered Service</h3>
      </li>
    );
  }

  getServiceList() {
    let result = { list_service: EventMapManager.getDataList('service', null).reverse() };
    return result;
  }

  renderList() {
    var list = [];
    this.state.list_service.forEach(function (service, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-service-list-';
      list.push(<ElementService key={_key} service_id={service.id} />);
    }, this);

    return list;
  }

  getForm() {
    UIEvent.dispatch('show-service-form', { id: null });
  }

  render() {
    return (
      <React.Fragment>
        <button type="button" className="btn btn-info btn-sm btn-add"
          onClick={this.getForm.bind(this)}>
          New Service
      </button>
      <ul className="list-service">
        {this.state.list_service.length > 0 ? this.renderList() : this.renderEmptyState()}
      </ul>
      </React.Fragment>
    );
  }
}