import React from 'react';
import HttpClient from 'request';

import config from '../../ui.config';

export default class ListActivityError extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      list_activity_error: []
    }

  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnMount(){
  }

  fetchList() {
    var self = this;
    var endpoint = config.activity_url + '?tag=error';
    
    HttpClient.get(endpoint , {json : true} , function(error, response, body){
      if(error){
        return console.log(error);
      }
      self.setState(function(){
        return { list_activity_error: body.data }
      });
    });
  }

  emptyState() {
    return (
      <div className="empty-panel">
        <h3>there is no errors
          <span className="error-yet">yet</span>
        </h3>
      </div>
    );
  }

  toggleElement(id) {
    $('#' + id).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.list_activity_error.forEach(function (activity, idx) {
      let key = (new Date()).getTime() + '-' + idx + '-activity-error';
      list.push(
        <li key={key}>

          <div className="element-activity"
            onClick={this.toggleElement.bind(this, key)}>
            <span>{activity.error_type}</span>
            <span>{activity.time}</span>
          </div>

          <div id={key} className="element-activity-content collapse">
            <label>content : </label>
            <pre>
              {JSON.stringify(activity.content)}
            </pre>
          </div>

        </li>
      );
    }, this);

    return (
      <ul className="list-activity">
        <li className="activity-head theme-bg">
          <span>error</span>
          <span>time</span>
        </li>
        {list}
      </ul>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.state.list_activity_error.length ? this.renderList() : this.emptyState()}
      </React.Fragment>
    );
  }
}