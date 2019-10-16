import React from 'react';
import ReactDOM from 'react-dom';
import httpRequest from 'request';
import config from './adminer.config';


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

function Adminer() {
  return (
    <div className="app-content">
      <nav className="app-module-nav">
        <div className="nav nav-tabs container" id="nav-tab" role="tablist">
          <a className="nav-item nav-link active" id="nav-activity-tab"
            data-toggle="tab" href="#nav-activity" role="tab"
            aria-controls="nav-activity" aria-selected="true">Activity</a>

          <a className="nav-item nav-link" id="nav-setting-tab"
            data-toggle="tab" href="#nav-setting" role="tab"
            aria-controls="nav-setting" aria-selected="false">setting</a>
        </div>
      </nav>

      <div className="tab-content container">

        <div className="tab-pane fade show active" id="nav-activity"
          role="tabpanel" aria-labelledby="nav-activity-tab">
          <h1>System Activity</h1>
          <ContainerActivity />
        </div>

        <div className="tab-pane fade" id="nav-setting"
          role="tabpanel" aria-labelledby="nav-setting-tab">
          <h1>Services Communication Setting</h1>
          <ContainerSetting />
        </div>
      </div>

      <FormService />
      <FormEvent />
      <FormListener />
    </div >
  );
}

httpRequest.get(config.eventmap_url, function (error, response, body) {
  if (response.statusCode === 200) {
    const _eventMap = new EventMap(JSON.parse(body));
    EventMapManager.setEventMap(_eventMap);
    ReactDOM.render(<Adminer />, document.getElementById('app'));
  }
});

