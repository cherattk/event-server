import React from 'react';
import ReactDOM from 'react-dom';
import HttpClient from 'axios';

import AdminerConfig from './config/adminer.config';
import Misc from './lib/misc';
import { UIEvent } from './lib/ui-event';
import EventMapManager from './lib/eventmap-manager';

import FormService from './ui/setting.module/form-service';
import FormEvent from './ui/setting.module/form-event';
import FormListener from './ui/setting.module/form-listener.js';
import ContainerActivity from './ui/activity.module/container-activity';
import ContainerSetting from './ui/setting.module/container-setting';
import LoginForm from './ui/component/login-form';

import QueryString from 'querystring';

function Adminer() {
  return (

    <div className="app-content">
      <nav className="app-module-nav">
        <div className="nav nav-tabs container" id="nav-tab" role="tablist">
          <a className="nav-item nav-link active" id="nav-activity-tab"
            data-toggle="tab" href="#nav-activity" role="tab"
            aria-controls="nav-activity" aria-selected="true">
            Activity
          </a>

          <a className="nav-item nav-link" id="nav-setting-tab"
            data-toggle="tab" href="#nav-setting" role="tab"
            aria-controls="nav-setting" aria-selected="false">
            Services
          </a>
        </div>
      </nav>

      <div className="tab-content container">

        <div className="tab-pane fade show active" id="nav-activity"
          role="tabpanel" aria-labelledby="nav-activity-tab">
          {/* <h1 className="text-white theme-bg-bluegray">
            System Activity
          </h1> */}
          <ContainerActivity />
        </div>

        <div className="tab-pane fade" id="nav-setting"
          role="tabpanel" aria-labelledby="nav-setting-tab">
          {/* <h1 className="text-white theme-bg-bluegray">
            Services Communication Setting
          </h1> */}
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
  Misc.setCookie('eser-auth', '', 0);
}

function renderConnectedState(auth_token) {
  document.getElementById('logout').style.visibility = 'visible';
  Misc.setCookie('eser-auth', auth_token, 1);
  RenderApp();
}

function RenderApp() {
  // load eventmap
  EventMapManager.loadEventMap(function () {
    ReactDOM.render(<Adminer />, document.getElementById('app'));
  });
}

UIEvent.addListener('login-success', function (uiEvent) {
  if (uiEvent.message.success) {
    renderConnectedState(uiEvent.message.auth_token);
  }
})

/**
 *   IF user has a valid auth token render the app() 
 */
function checkAuthToken() {
  var auth_cookie = Misc.getCookie('eser-auth');
  if (!auth_cookie) {
    renderLoginForm();
  }
  else {
    // check cookie validity
    var __authData = QueryString.stringify({
      auth_token: auth_cookie
    });
    HttpClient({
      method: "POST",
      url: AdminerConfig.auth_token_url,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: __authData

    }).then(function (response) {
      if (response.status === 200) {
        renderConnectedState(response.data.auth_token);
      }
    }).catch(function () {
      renderLoginForm();
    });

  }
}

// LOG OUT ACTION
document.getElementById('logout').onclick = function (e) {

  var auth_cookie = Misc.getCookie('eser-auth');
  if (auth_cookie) {
    var __authData = QueryString.stringify({
      auth_token: auth_cookie
    });
    HttpClient({
      method: "POST",
      url: AdminerConfig.log_out_url,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: __authData
    }).then(function (response) {
      renderLoginForm();
      e.target.style.visibility = 'hidden';
    }).catch(function (error) {
      console.log(error);
    });
  }
}

//////////////////////////////////////////////////////////////////////////

checkAuthToken();
// RenderApp();



