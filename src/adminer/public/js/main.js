import React from 'react';
import ReactDOM from 'react-dom';
import httpRequest from 'request';

// ================
import EventMapManager from './service/event-map-manager';
import EventMap from './service/event-map';

// ================
import FormService from './ui/setting.module/form-service';
import FormEvent from './ui/setting.module/form-event';
import FormListener from './ui/setting.module/form-listener.js';

// ================
import ContainerActivity from './ui/activity.module/container-activity';
import ContainerSetting from './ui/setting.module/container-setting';

function EventAdmin() {
  return (
    <div className="app-content">
      <nav className="app-module-nav">
        <div className="nav nav-tabs container" id="nav-tab" role="tablist">
          <a className="nav-item nav-link active" id="nav-activity-tab"
            data-toggle="tab" href="#nav-activity" role="tab"
            aria-controls="nav-activity" aria-selected="true">Activities</a>

          <a className="nav-item nav-link" id="nav-setting-tab"
            data-toggle="tab" href="#nav-setting" role="tab"
            aria-controls="nav-setting" aria-selected="false">setting</a>
        </div>
      </nav>

      <div className="tab-content container">

        <div className="tab-pane fade show active" id="nav-activity"
          role="tabpanel" aria-labelledby="nav-activity-tab">
          <ContainerActivity />
        </div>

        <div className="tab-pane fade" id="nav-setting"
          role="tabpanel" aria-labelledby="nav-setting-tab">
          <ContainerSetting />
        </div>
      </div>

      <FormService />
      <FormEvent />
      <FormListener />
    </div >
  );
}

const dataUrl = 'http://localhost:4000/event-map';

httpRequest.get(dataUrl, function (error, response, body) {
  if (response.statusCode === 200) {
    const _eventMap = new EventMap(JSON.parse(body));
    EventMapManager.setEventMap(_eventMap);
    ReactDOM.render(<EventAdmin />, document.getElementById('app'));
  }
});

