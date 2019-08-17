import React from 'react';
import UIEvent from '../service/ui-event';
import EventMapManager from '../service/event-map-manager';

export default class FormEvent extends React.Component {

  constructor(props) {
    super(props);

    var initialState = { name: '', description: '' };
    this.state = initialState;

    var self = this;    
    //===============================================
    UIEvent.addListener('show-event-form', function (eventSet) {
      self.setState(function () {
        return eventSet.eventMessage;
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
        data.type = 'event';
    EventMapManager.setData(data);
    this.close();
  }

  formValue(event) {
    this.state[event.target.name] = event.target.value;
    this.setState(this.state);
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
            <div className="modal-body">

              <form>

                <div className="form-group">
                  <label htmlFor="event-name" className="col-form-label">Name:</label>
                  <input id="event-name" type="text" className="form-control"
                    name="name"
                    value={this.state.name} 
                    onChange={this.formValue.bind(this)} />
                </div>

                <div className="form-group">
                  <label htmlFor="event-description" className="col-form-label">Description:</label>
                  <textarea id="event-description" className="form-control"
                    name="description"
                    value={this.state.description}
                    onChange={this.formValue.bind(this)}></textarea>
                </div>

              </form>

            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary"
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