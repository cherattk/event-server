import React from 'react';
import EventMapManager from '../../lib/eventmap-manager';
import { UIEvent } from '../../lib/ui-event';

export default class FormEvent extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      id: '',
      type:'event',
      service_id: '',
      description: '',
      // cloudevent attributes
      ce_specversion : '1.0',
      ce_type: '',
      ce_source:'',
      ce_datacontenttype :''
    };

    this.state = {
      event: this.initialState
    };
  }


  componentDidMount() {
    var self = this;
    //===============================================
    UIEvent.addListener('show-event-form', function (uiEvent) {
      var data = Object.assign({}, self.initialState);
      if (uiEvent.message && typeof uiEvent.message.event_id !== 'undefined') {
        // get event data to edition
        data = EventMapManager.getData('event', uiEvent.message.event_id)
      }
      self.setState(function () {
        return { event: data };
      }, function () {
        $(self.modal).modal('show');
      });
    });
  }

  close() {
    let self = this;
    this.setState(function () {
      return self.initialState;
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  saveForm() {
    let event = this.state.event;
    if (!event.service_id) {
      return alert('You must select a service that trigger the event');
    }
    if (!event.ce_type) {
      return alert('The event must have a name');
    }
    if (event.id) {
      // element already exists
      EventMapManager.updateData(event);
    } else {
      // add a new one
      EventMapManager.addData(event);
    }
    this.close();
  }

  submitForm(e) {
    e.preventDefault();
  }

  formValue(event) {
    if(event.target.name === "service_id"){
      // set the cloudevent.source vaklues to ce_source field
      let __service_id = event.target.value;
      var _service = EventMapManager.getData('service', __service_id);
      this.state.event.ce_source = _service.host;
    }
    this.state.event[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  listService() {
    let dataList = EventMapManager.getDataList('service', null).reverse();
    var list = [];
    dataList.forEach(function (service, idx) {
      list.push(<option key={idx + '-opt-service'} value={service.id}>{service.name}</option>);
    });
    return list;
  }

  render() {
    return (
      <div className="modal fade app-modal-form" id="formEvent"
        tabIndex="-1" role="dialog"
        aria-labelledby="formEventLabel"
        aria-hidden="true"
        ref={node => (this.modal = node)}>

        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="formEventLabel">
                Event Information
            </h5>
              <button type="button" className="close" onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={this.submitForm.bind(this)}>
              <div className="modal-body">

                <div className="form-group">
                  <label htmlFor="event-service-id" className="col-form-label">Service:</label>
                  <select id="event-service-id"
                    className="custom-select"
                    name="service_id"
                    value={this.state.event.service_id}
                    onChange={this.formValue.bind(this)} >
                    <option value="">List of Services</option>
                    {this.listService()}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="event-ce_source" className="col-form-label">
                    Source :
                  </label>
                  <input id="event-ce_source" type="text" className="form-control"
                    name="ce_source" value={this.state.event.ce_source}disabled/>
                </div>

                <div className="form-group">
                  <label htmlFor="event-name" className="col-form-label">
                    Event Name :
                  </label>
                  <input id="event-name" type="text" className="form-control"
                    name="name"
                    value={this.state.event.name}
                    onChange={this.formValue.bind(this)} />
                </div>

                <div className="form-group">
                  <label htmlFor="event-ce_type" className="col-form-label">
                    Event Type :
                  </label>
                  <input id="event-ce_type" type="text" className="form-control"
                    name="ce_type"
                    value={this.state.event.ce_type}
                    onChange={this.formValue.bind(this)} />
                </div>

                <div className="form-group">
                  <label htmlFor="event-ce_datacontenttype" className="col-form-label">
                    Data Content Type :
                  </label>
                  <input id="event-ce_datacontenttype" type="text" className="form-control"
                    name="ce_datacontenttype"
                    value={this.state.event.ce_datacontenttype}
                    onChange={this.formValue.bind(this)} />
                </div>

                <div className="form-group">
                  <label htmlFor="event-description" className="col-form-label">
                    Description :
                  </label>
                  <textarea id="event-description" className="form-control"
                    name="description"
                    value={this.state.event.description}
                    onChange={this.formValue.bind(this)}></textarea>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary"
                  onClick={this.saveForm.bind(this)}>Save changes</button>
                <button type="button" className="btn btn-secondary"
                  onClick={this.close.bind(this)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}