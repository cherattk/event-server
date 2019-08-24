import React from 'react';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent } from '../../service/event';

export default class FormEvent extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      id: '',
      type: 'event',
      event_name: '',
      service_id: '',
      description: ''
    };

    this.state = {
      event: this.initialState
    };
  }


  componentDidMount(){
    var self = this;
    //===============================================
    UIEvent.addListener('show-event-form', function (uiEvent) {
      var data = Object.assign({} , self.initialState);
      if(typeof uiEvent.message.event_id !== 'undefined') {
        // get event data to edition
        data = EventMapManager.getData('event', uiEvent.message.event_id)
      }
      else if(typeof uiEvent.message.service_id !== 'undefined'){
        // show form to add a new 
        // event to service idetified by [service_id]
        data.service_id = uiEvent.message.service_id;
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

  saveForm(){  
    let event = this.state.event;
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
    this.state.event[event.target.name] = event.target.value;
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

            <form onSubmit={this.submitForm.bind(this)}>
            <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="event-name" className="col-form-label">Name:</label>
                  <input id="event-name" type="text" className="form-control"
                    name="event_name"
                    value={this.state.event.event_name}
                    onChange={this.formValue.bind(this)} />
                </div>

                <div className="form-group">
                  <label htmlFor="event-description" className="col-form-label">Description:</label>
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