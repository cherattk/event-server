import React from 'react';
import HttpClient from 'request';

import config from '../../ui.config';

export default class ListActivity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_activity_event: []
    }

  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnMount(){
    // clearInterval(this.fetchDataInterval);
  }

  fetchList() {
    var self = this;
    var endpoint = config.activity_url + '?tag=event';
    
    HttpClient.get(endpoint , {json : true} , function(error, response, body){
      if(error){
        return console.log(error);
      }
      self.setState(function(){
        return { list_activity_event: body.data }
      });
    });
  }

  emptyState() {
    return (
      <div className="empty-panel">
        <h3>There is no logged events</h3>
      </div>
    );
  }

  toggleElement(id) {
    $('#' + id).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.list_activity_event.forEach(function (activity, idx) {
      let key = (new Date()).getTime() + '-' + idx + 'activity-event';
      list.push(
        <li key={key}>

          <div className="element-activity"
            onClick={this.toggleElement.bind(this, key)}>
            <span>{activity.event_content.service_name}</span>
            <span>{activity.event_content.event_name}</span>
            <span>{activity.time}</span>
          </div>

          <div id={key} className="element-activity-content collapse">
          <label>message : </label>
          <pre>
            {JSON.stringify(activity.event_content)}
          </pre>
          </div>

        </li>
      );
    }, this);

    return (
      <ul className="list-activity">
        <li className="activity-head theme-bg">
          <span>service</span>
          <span>event</span>
          <span>time</span>
        </li>
        {list}
      </ul>
    );
  }

  render() {
    return (
      <React.Fragment>
      { this.state.list_activity_event.length ? this.renderList() : this.emptyState() }
      </React.Fragment>
    );
  }
}