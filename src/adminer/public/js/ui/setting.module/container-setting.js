import React from 'react';
import ListService from './list-service';
import ListEvent from './list-event';

export default class ContainerSetting extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <nav>
          <div className="nav nav-tabs" id="nav-activity" role="tablist">
            <a className="nav-item nav-link active" data-toggle="tab"
              href="#container-list-service" role="tab" aria-selected="true">Services</a>
            <a className="nav-item nav-link" data-toggle="tab"
              href="#container-list-event" role="tab" aria-selected="false">Events</a>
          </div>
        </nav>
        <div className="tab-content">
          <div className="tab-pane fade show active" id="container-list-service"
            role="tabpanel">
              <ListService/>
          </div>
          <div className="tab-pane fade"  id="container-list-event"
            role="tabpanel">
            <ListEvent/>
          </div>
        </div>
      </div>
    );
  }
}