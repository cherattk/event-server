import React from 'react';
import EventMapManager from '../service/event-map-manager';
import { UIEvent } from '../service/event';

export default class FormEvent extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      event: {
        id: '',
        type : 'event',
        event_name: '',
        service_id: '',
        description: ''
      }
    };

    this.state = this.initialState;
    var self = this;
    //===============================================
    UIEvent.addListener('show-event-form', function (uiEvent) {
      self.setState(function () {
        return { event: EventMapManager.getData('event', uiEvent.message.id) };
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

  submitForm() {
    let event = Object.assign({}, this.state.event);
    if (event.id) {
      // element already exists
      EventMapManager.updateData(event);
    } else {
      // add a new one
      EventMapManager.addData(event);
    }
    this.close();
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
            <div className="modal-body">

              <form>

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