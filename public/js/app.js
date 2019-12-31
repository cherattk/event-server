import React from 'react';
import ReactDOM from 'react-dom';
import httpRequest from 'request';

import AdminerConfig from './adminer.config';
import Misc from './service/misc';
import FormService from './ui/setting.module/form-service';
import FormEvent from './ui/setting.module/form-event';
import FormListener from './ui/setting.module/form-listener.js';
import ContainerActivity from './ui/activity.module/container-activity';
import ContainerSetting from './ui/setting.module/container-setting';
import LoginForm from './ui/component/login-form';
import { UIEvent } from './service/ui-event';
import EventMap from './service/event-map';
import EventMapManager from './service/event-map-manager';

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
          <h1 className="text-white bg-primary">System Activity</h1>
          <ContainerActivity />
        </div>

        <div className="tab-pane fade" id="nav-setting"
          role="tabpanel" aria-labelledby="nav-setting-tab">
          <h1 className="text-white bg-primary">Services Communication Setting</h1>
          <ContainerSetting />
        </div>
      </div>

      <FormService />
      <FormEvent />
      <FormListener />

    </div>

  );
}

///////////////////////////////////////////////////////////////////////////
function renderLoginForm() {
  ReactDOM.render(<LoginForm />, document.getElementById('app'));
  Misc.setCookie('eser-auth' , '' , 0);
}

function renderConnectedState(auth_token) {
  document.getElementById('logout').style.visibility = 'visible';
  Misc.setCookie('eser-auth', auth_token, 1);  
  RenderApp();
}

function RenderApp() {
  // load eventmap
  httpRequest.get(AdminerConfig.eventmap_url, function (error, response, body) {
    if (response.statusCode === 200) {
      const _eventMap = new EventMap(JSON.parse(body));
      EventMapManager.setEventMap(_eventMap);
      ReactDOM.render(<Adminer />, document.getElementById('app'));
    }

  });
}

UIEvent.addListener('login-success', function (uiEvent) {
  if (uiEvent.message.success) {
    renderConnectedState(uiEvent.message.auth_token);
  }
  else {
    // display message error
  }
})

/**
 *   IF user has a valid auth token render the app() 
 */
function checkAuthToken() {
  var auth_cookie = Misc.getCookie('eser-auth');
  if (auth_cookie) {
    // check cookie validity
    httpRequest.post({
      json: true,
      url: AdminerConfig.auth_token_url,
      form: {
        auth_token: auth_cookie
      }
    },
      function (error, httpResponse, body) {
        // valid auth cookie
        if (httpResponse.statusCode === 200) {
          renderConnectedState(body.auth_token);
        }
        // bad auth cookie
        else{
          renderLoginForm();
        }
      });
  }
  else{
    renderLoginForm();
  }
}

// LOG OUT ACTION
document.getElementById('logout').onclick = function (e) {
  var auth_cookie = Misc.getCookie('eser-auth');
  httpRequest.post({
    json: true,
    url: AdminerConfig.log_out_url,
    form: {
      auth_token: auth_cookie
    }
  },
    function (error, httpResponse, body) {
      // valid auth cookie
      if (httpResponse.statusCode === 200) {
        renderLoginForm();
        e.target.style.visibility = 'hidden';
      }
      else {
        console.log(error);
      }
    });
}

//////////////////////////////////////////////////////////////////////////

checkAuthToken();




