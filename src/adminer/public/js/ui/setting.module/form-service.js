import React from 'react';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent } from '../../service/ui-event';

export default class FormService extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      type: 'service',
      id: '',
      name: '',
      host: '',
      description: ''
    };
    this.state = {
      service: this.initialState,
      validatedForm : false
    };
  }

  componentDidMount() {
    var self = this;
    //===========================================================
    UIEvent.addListener('show-service-form', function (uiEvent) {
      var data = Object.assign({}, self.initialState);
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
    var self = this;
    this.setState(function () {
      return { service: self.initialState, validatedForm: false };
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  submitForm(e) {
    e.preventDefault();
  }

  isValidInput(inputName){
    return !!this.state.service[inputName];
  }

  saveForm() {
    var service = Object.assign({}, this.state.service);

    if (this.isValidInput('name') && this.isValidInput('host')) {
      if (service.id) {
        // element already exists
        EventMapManager.updateData(service);
      } else {
        // add a new one
        EventMapManager.addData(service);
      }
      this.close();
    }
    else{
      // this.forceUpdate();
      this.setState(function(){
        return {validatedForm : true};
      });
    }
  }

  formValue(event) {
    this.state.service[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  render() {
    var validatedForm = this.state.validatedForm;
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
                  <input id="service-name" type="text" 
                    className={"form-control" + ( validatedForm && !this.isValidInput('name') ? ' is-invalid' : '')}
                    // className="form-control"
                    name="name"
                    value={this.state.service.name}
                    placeholder="ex: stock manager"
                    onChange={this.formValue.bind(this)}/>
                  <div className="invalid-feedback">
                  Service name can not be empty.
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="service-host" className="col-form-label">Host:</label>
                  <input id="service-host" type="text" 
                    className={"form-control" + (validatedForm && !this.isValidInput('host') ? ' is-invalid' : '')}
                    // className="form-control"
                    name="host"
                    value={this.state.service.host}
                    placeholder="ex: www.service-host.com"
                    onChange={this.formValue.bind(this)}/>
                  <div className="invalid-feedback">
                    Service Host can not be empty.
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="service-description" className="col-form-label">Description:</label>
                  <textarea id="service-description" 
                    className="form-control"
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