import React from 'react';
import EventMapManager from '../service/event-map-manager';
import {UIEvent} from '../service/event';

export default class FormService extends React.Component {

  constructor(props) {
    super(props);

    var initialState = { id : '' , name: '', host: '', description: '' };
    this.state = initialState;

    var self = this;
    
    //===============================================
    UIEvent.addListener('show-service-form', function (uiEvent) {
      self.setState(function () {
        return EventMapManager.getData('service' , uiEvent.message.id);
      }, function () {
        $(self.modal).modal('show');
      });
    });
  }

  close(){
    let self = this;
    this.setState(function () {
      return {};
    } , function(){
      $(self.modal).modal('hide');
    });
  }

  submitForm() {
    let data = Object.assign({} , this.state);
        data.type = 'service';
    EventMapManager.setData(data);
    this.close();
  }

  formValue(event) {
    this.state[event.target.name] = event.target.value;
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
              <button type="button" className="close" onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">

              <form onSubmit={this.submitForm.bind(this)}>
                <div className="form-group">
                  <label htmlFor="service-name" className="col-form-label">Name:</label>
                  <input id="service-name" type="text" className="form-control"
                    name="name"
                    value={this.state.name} 
                    onChange={this.formValue.bind(this)} />
                </div>
                <div className="form-group">
                  <label htmlFor="service-host" className="col-form-label">Host:</label>
                  <input id="service-host" type="text" className="form-control"
                    name="host"
                    value={this.state.host} 
                    onChange={this.formValue.bind(this)} />
                </div>
                <div className="form-group">
                  <label htmlFor="service-description" className="col-form-label">Description:</label>
                  <textarea id="service-description" className="form-control"
                    name="description"
                    value={this.state.description}
                    onChange={this.formValue.bind(this)}></textarea>
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary"
                        onClick={this.submitForm.bind(this)}>Save changes</button>
              <button type="button" className="btn btn-secondary" 
                      onClick={this.close.bind(this)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}