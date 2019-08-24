import React from 'react';
import RequestPromise from 'request-promise-native';
import ElementActivityError from './element-activity-error';

export default class ListActivityError extends React.Component {

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
    let endpoint = 'http://localhost:4000/activity?tag=error';
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
    return <li className="empty-activity">no activities yet</li>;
  }

  toggleElement(id) {
    $('#' + id).collapse('toggle');
  }

  renderList() {
    let list = [];
    this.state.list_activity.forEach(function (activity, idx) {
      let key = (new Date()).getTime() + '-' + idx + '-activity-error';
      list.push(
        <li key={key}>

          <div className="element-activity"
            onClick={this.toggleElement.bind(this, key)}>
            <span>{activity.error_type}</span>
            <span>{activity.time}</span>
          </div>

          <div id={key} className="element-activity-content collapse">
            <ElementActivityError activity={activity} />
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
          <span>error</span>
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