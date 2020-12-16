import React from 'react';
import ElementService from './element-service';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent, DataEvent } from '../../lib/ui-event';
import {Spinner , EmptyState } from '../component/message';

export default class ListService extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading : true,
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

  getServiceList() {
    this.setState(function () {
      return { loading: true }
    });
    let result = {
      list_service: EventMapManager.getDataList('service', null).reverse() 
    };
    this.setState(function () {
      return { loading: false }
    });
    return result;
  }

  renderList() {
    var list = [];
    this.state.list_service.forEach(function (service, idx) {
      let _key = (new Date()).getTime() + '-' + idx + '-service-list-';
      list.push(<ElementService key={_key} service_id={service.id} index={idx+1}/>);
    }, this);

    return (
      <ul className="list-element">
        {list}
      </ul>
    );
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
      <hr/>
          { this.state.loading ? <Spinner text="Loading Service List ..."/> :
          (this.state.list_service.length ? this.renderList() : 
          <EmptyState text="There is no registered service"/>)
          }
      </React.Fragment>
    );
  }
}