import React from 'react';
import ListActivityEvent from './list-activity-event';
import ListActivityError from './list-activity-error';

export default class ContainerActivity extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <nav>
          <div className="nav nav-tabs" id="nav-activity" role="tablist">
            <a className="nav-item nav-link active" data-toggle="tab"
              href="#list-activity-event" role="tab" aria-selected="true">Events</a>
            <a className="nav-item nav-link" data-toggle="tab"
              href="#list-activity-error" role="tab" aria-selected="false">Errors</a>
          </div>
        </nav>
        <div className="tab-content">

          <div className="tab-pane fade show active" id="list-activity-event">
            <ListActivityEvent />
          </div>
          <div className="tab-pane fade" id="list-activity-error">
            <ListActivityError />
          </div>
        </div>
      </>
    );
  }
}