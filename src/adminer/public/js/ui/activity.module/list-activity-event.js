import React from 'react';
import HttpClient from 'axios';
import config from '../../config/adminer.config';
import Misc from '../../lib/misc';
import { Spinner, EmptyState } from '../component/message';

export default class ListActivity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data_list: []
    }

  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnMount() {
    // clearInterval(this.fetchDataInterval);
  }

  fetchList() {

    this.setState(function () {
      return { loading: true }
    });

    var self = this;
    var endpoint = config.activity_url + '?tag=event';

    HttpClient.get(endpoint, { responseType: true })
      .then(function (response) {
        self.setState(function () {
          return {
            loading: false,
            data_list : response.data
          }
        });
      })
      .catch(function (error) {
        self.setState(function () {
          return {
            loading: false
          }
        });        
      });
  }

  toggleElement(id) {
    $('#' + id).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.data_list.forEach(function (activity, idx) {
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

    return (
      <ul className="list-element list-activity">
        <li className="activity-head theme-bg-green">
          <span>event</span>
          <span>service</span>
          <span>time</span>
        </li>
        {list}
      </ul>
    );
  }

  render() {

    return (
      <React.Fragment>
        {/* todo : move refesh button it in its own component  */}
        <button type="button"
          className="btn btn-primary btn-sm"
          onClick={this.fetchList.bind(this)}>
          Refresh
        </button>

        {this.state.loading ? <Spinner text="Loading Event List ..." /> :
          (this.state.data_list.length ? this.renderList() :
            <EmptyState text="There is no Event yet" />)
        }

      </React.Fragment>
    );
  }
}