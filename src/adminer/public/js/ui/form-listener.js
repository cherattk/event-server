import React from 'react';
import EventMapManager from '../service/event-map-manager';
import {UIEvent} from '../service/event';

export default class FormListener extends React.Component {

  constructor(props) {
    super(props);

    this._emptyState = { id : '' , endpoint: '', description: '' };
    this.state = this._emptyState;

    var self = this;
    //===============================================
    UIEvent.addListener('show-listener-form', function (uiEvent) {
      self.setState(function () {
        if (typeof uiEvent.message !== 'undefined' &&
            typeof uiEvent.message.id !== 'undefined') {
          return EventMapManager.getData('listener', uiEvent.message.id);
        }
        else return self._emptyState;

      }, function () {
        $(self.modal).modal('show');
      });
    });
  }

  close() {
    let self = this;
    this.setState(function () {
      self._emptyState;
    }, function () {
      $(self.modal).modal('hide');
    });
  }

  submitForm() {
    let data = Object.assign({}, this.state);
    data.type = 'listener';
    EventMapManager.setData(data);
    this.close();
  }

  formValue(event) {
    this.state[event.target.name] = event.target.value;
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
            <div className="modal-body">

              <form>

                <div className="form-group">
                  <label htmlFor="listener-name" className="col-form-label">
                    Endpoint:
                  </label>
                  <input id="listener-name" type="text" className="form-control"
                    name="endpoint"
                    value={this.state.name}
                    onChange={this.formValue.bind(this)} />
                </div>

                <div className="form-group">
                  <label htmlFor="listener-description" className="col-form-label">Description:</label>
                  <textarea id="listener-description" className="form-control"
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