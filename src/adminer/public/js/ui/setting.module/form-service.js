import React from 'react';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent } from '../../service/event';

export default class FormService extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      type : 'service',
      id: '',
      name: '',
      host: '',
      description: ''
    };
    this.state = {
      service: this.initialState
    };
  }

  componentDidMount(){
    var self = this;
    //===============================================
    UIEvent.addListener('show-service-form', function (uiEvent) {
      var data = Object.assign({} , self.initialState);
      if (uiEvent.message.id) {
        data = EventMapManager.getData('service', uiEvent.message.id)
      }
      self.setState(function () {
        return { service: data };
      }, function () {
        $(self.modal).modal('show');
      });

    });
  }

  close() {
    let self = this;
    this.setState(function () {
      return { service: self.initialState };
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  submitForm(e) {
    e.preventDefault();
  }

  saveForm(){    
    let service = Object.assign({}, this.state.service);
    if (service.id) {
      // element already exists
      EventMapManager.updateData(service);
    } else {
      // add a new one
      EventMapManager.addData(service);
    }
    this.close();
  }

  formValue(event) {
    this.state.service[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  render() {
    return (
      <div className="modal fade app-modal-form" id="formService"
        tabIndex="-1" role="dialog"
        aria-labelledby="formServiceLabel"
        aria-hidden="true"
        ref={node => (this.modal = node)}>

        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="formServiceLabel">
                Service Information
            </h5>
              <button type="button" className="close" 
                      onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={this.submitForm.bind(this)}>
            <div className="modal-body">

                <div className="form-group">
                  <label htmlFor="service-name" className="col-form-label">Name:</label>
                  <input id="service-name" type="text" className="form-control"
                    name="name"
                    value={this.state.service.name}
                    onChange={this.formValue.bind(this)} />
                </div>
                <div className="form-group">
                  <label htmlFor="service-host" className="col-form-label">Host:</label>
                  <input id="service-host" type="text" className="form-control"
                    name="host"
                    value={this.state.service.host}
                    onChange={this.formValue.bind(this)} />
                </div>
                <div className="form-group">
                  <label htmlFor="service-description" className="col-form-label">Description:</label>
                  <textarea id="service-description" className="form-control"
                    name="description"
                    value={this.state.service.description}
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