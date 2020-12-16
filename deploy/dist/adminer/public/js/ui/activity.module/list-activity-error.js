import React from 'react';
import HttpClient from 'request';
import config from '../../config/adminer.config';
import Misc from '../../service/misc';
import { Spinner, EmptyState } from '../component/message';

export default class ListActivityError extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fetchingStatus: true,
      data_list: []
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  componentWillUnMount() {
  }

  fetchList() {
    this.setState(function () {
      return { fetchingStatus: true }
    });
    var self = this;
    var endpoint = config.activity_url + '?tag=error';

    HttpClient.get(endpoint, { json: true }, function (error, response, body) {
      if (error) {
        return console.log(error);
      }
      self.setState(function () {
        return {
          fetchingStatus: false,
          data_list: body.data
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
      let key = (new Date()).getTime() + '-' + idx + '-activity-error';
      list.push(
        <li key={key}>

          <div className="element-activity"
            onClick={this.toggleElement.bind(this, key)}>
            <span>{activity.error_type}</span>
            <span>
              {Misc.getDateFormat(activity.log_time)}
            </span>
          </div>

          <div id={key} className="element-activity-content collapse">
            <label>Request : </label>
            <pre>
              {JSON.stringify(activity.content, null, 2)}
            </pre>
          </div>

        </li>
      );
    }, this);

    return (
      <ul className="list-element list-activity">
        <li className="activity-head theme-bg-blue">
          <span>error</span>
          <span>time</span>
        </li>
        {list}
      </ul>
    )
  }

  render() {
    return (
      <React.Fragment>
        <button type="button"
          className="btn btn-primary btn-sm"
          onClick={this.fetchList.bind(this)}>
          Refresh
        </button>

        {this.state.fetchingStatus ? <Spinner text="Loading Error List ..." /> :
          (this.state.data_list.length ? this.renderList() :
            <EmptyState text="There is no errors yet" />)
        }
      </React.Fragment>
    );
  }
}