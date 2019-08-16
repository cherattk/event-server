import React from 'react';
import RequestPromise from 'request-promise-native';
import ElementActivityEvent from './element-activity-event';

export default class ListActivity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_activity: []
    }
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    let endpoint = 'http://localhost:4000/activity?tag=event';
    let opts = {
      url: endpoint,
      json: true
    };
    var self = this;
    RequestPromise.get(opts).then(function (response) {
      if (response.data.length) {
        self.setState(function () {
          return { list_activity: response.data };
        });
      }
    }).catch(function (error) {
      console.error(error);

    });
  }

  emptyState() {
    return <li>no activities yet</li>;
  }

  toggleElement(id) {
    $('#' + id).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.list_activity.forEach(function (activity, idx) {
      let key = 'activity-event-' + idx;
      list.push(
        <li key={key}>

          <div className="element-activity"
            onClick={this.toggleElement.bind(this, key)}>
            <span>{activity.service_id}</span>
            <span>{activity.event_name}</span>
            <span>{activity.time}</span>
          </div>

          <div id={key} className="element-activity-content collapse">
            <ElementActivityEvent activity={activity} />
          </div>

        </li>
      );
    }, this);
    return list;
  }

  render() {
    return (
      <ul className="list-activity">
        <li className="activity-head theme-bg">
          <span>service</span>
          <span>event</span>
          <span>time</span>
        </li>
        {this.state.list_activity.length ?
          this.renderList() :
          this.emptyState()
        }
      </ul>
    );
  }
}