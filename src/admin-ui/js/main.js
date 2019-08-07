import React from 'react';
import ReactDOM from 'react-dom';
import ListService from './list-service.js';

function EventAdmin() {
  return (

    <div className="container">

      <header className="header">
        <h1>Event Server Admin -1 </h1>
      </header>

      <div id="app-content">
        <ListService />
      </div>

    </div>
  );
}
ReactDOM.render(<EventAdmin />, document.getElementById('app'));