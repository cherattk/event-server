import React from 'react';
// import RequestPromise from 'request-promise-native';

export default class ListActivityError extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_activity_error: []
    }
  }

  componentDidMount() {
    this.setState(function () {
      return { list_activity_error: this.getList() }
    });
  }

  getList() {
    return [];
    return [
      {
        id: 'l-123',
        time: '2019-08-22T16:38:37.751Z',
        type: 'error',
        error_type: 'bad-request',
        content: {
          bad_field: 'bad-field-name',
          message: 'machin',
        }
      },
      {
        id: 'l-123',
        time: '2019-08-22T16:38:37.751Z',
        type: 'error',
        error_type: 'invalid-event',
        content: {
          event_id: 'bad-event-id',
          message: 'machin',
        }
      },
      {
        id: 'l-123',
        time: '2019-08-22T16:38:37.751Z',
        type: 'error',
        error_type: 'dispatch-error',
        content: {
          event: 'object-LIVE-EVENT',
          listener: 'object-LISTENER-OBJECT',
          error: 'httpclient-catched-error',
        }
      }
    ];
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