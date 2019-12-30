import React from 'react';
import HttpClient from 'request';
import config from '../../adminer.config';
import Misc from '../../service/misc';

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

  componentWillUnMount() {
    // clearInterval(this.fetchDataInterval);
  }

  fetchList() {
    var self = this;
    var endpoint = config.activity_url + '?tag=event';

    HttpClient.get(endpoint, { json: true }, function (error, response, body) {
      if (error) {
        return console.log(error);
      }
      self.setState(function () {
        return { list_activity_event: body.data }
      });
    });
  }

  emptyState() {
    return (
      <div className="empty-panel">
        <h3>There is no events yet</h3>
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
            <span>{activity.content.event.event_name}</span>
            <span>{activity.content.event.service_name}</span>
            <span> {Misc.getDateFormat(activity.log_time)}</span>
          </div>

          <div id={key} className="element-activity-content collapse">
            <label>Content : </label>
            <pre>
              <code>
                {JSON.stringify(activity.content, null, 2)}
              </code>
            </pre>
          </div>

        </li>
      );
    }, this);

    return list;
  }

  render() {
    return (
      <React.Fragment>
        <button type="button" 
                className="btn btn-primary btn-sm" 
                onClick={this.fetchList.bind(this)}>
          Refresh
        </button>
        <ul className="list-element list-activity">
          <li className="activity-head theme-bg-blue">
            <span>event</span>
            <span>service</span>
            <span>time</span>
          </li>
          {this.state.list_activity_event.length ? this.renderList() : this.emptyState()}
        </ul>
      </React.Fragment>
    );
  }
}