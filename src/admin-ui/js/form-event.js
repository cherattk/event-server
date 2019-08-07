import React from 'react';

function FormEvent() {

  return (
    <div className="modal fade" id="eventForm" tabindex="-1" role="dialog" aria-labelledby="eventFormLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="eventFormLabel">
              Event Information
            </h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">

            <form>
              <div className="form-group">
                <label for="service-name" className="col-form-label">Name:</label>
                <input id="service-name"  type="text" className="form-control"/>
              </div>
              <div className="form-group">
                <label for="service-description" className="col-form-label">Description:</label>
                <textarea id="service-description" className="form-control"></textarea>
              </div>
            </form>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormEvent;