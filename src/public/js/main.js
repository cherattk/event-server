import React from 'react';
import ReactDOM from 'react-dom';
import httpRequest from 'request';

import ListService from './list-service.js';
import FormService from './form-service';
import FormEvent from './form-event';
import DataManager from './module/data-manager';
import EventMap from './module/event-map';

function EventAdmin() {
  return (

    <div className="container">

      <header className="header">
        <h1>Event Server Admin -1 </h1>
      </header>

      <div id="app-content">
        <ListService />
      </div>

    
      <FormService/>
      <FormEvent/>

    </div>
  );
}

const dataUrl = 'http://www.localhost:3000/event-map';

httpRequest.get(dataUrl , function(error, response, body){
  if(response.statusCode === 200){
    const _eventMap = new EventMap(JSON.parse(body));
    DataManager.setEventMap(_eventMap);
    ReactDOM.render(<EventAdmin />, document.getElementById('app'));
  }
});

