import React from 'react';
import EventMapManager from '../../service/eventmap-manager';
import { UIEvent } from '../../service/ui-event';

export default class FormListener extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      id: '', 
      type: 'listener', 
      event_id: '', 
      endpoint: '', 
      description: ''
    };
    this.state = { listener : this.initialState};
  }

  componentDidMount(){
    var self = this;
    //===============================================
    UIEvent.addListener('show-listener-form', function (uiEvent) {

      var data = Object.assign({} , self.initialState);

      if(uiEvent.message.listener_id){
        // get listener data to edit
        data = EventMapManager.getData('listener', uiEvent.message.listener_id);
      }
      else if(uiEvent.message.event_id){
        // show form to add a new 
        // listener to event identified by [event_id]
        data.event_id = uiEvent.message.event_id;
      }
      
      self.setState(function () {
        return {listener : data}

      }, function () {
        $(self.modal).modal('show');
      });
    });
  }

  close() {
    let self = this;
    this.setState(function () {
      return {listener : self.initialState};
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  submitForm(e) {
    e.preventDefault();
  }

  saveForm(){    
    var listener = this.state.listener;
    if (listener.id) {
      // element already exists
      EventMapManager.updateData(listener);
    } else {
      // add a new one
      EventMapManager.addData(listener);
    }
    this.close();
  }

  formValue(event) {
    this.state.listener[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  render() {
    return (
      <div className="modal fade app-modal-form" id="formListener"
        tabIndex="-1" role="dialog"
        aria-labelledby="formListenerLabel"
        aria-hidden="true"
        ref={node => (this.modal = node)}>

        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="formListenerLabel">
                Listener Information
              </h5>
              <button type="button" className="close"
                onClick={this.close.bind(this)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <form onSubmit={this.submitForm.bind(this)}>
            <div className="modal-body">

                <div className="form-group">
                  <label htmlFor="listener-name" className="col-form-label">
                    Endpoint:
                  </label>
                  <input id="listener-name" type="text" className="form-control"
                    name="endpoint"
                    value={this.state.listener.endpoint}
                    onChange={this.formValue.bind(this)} />
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