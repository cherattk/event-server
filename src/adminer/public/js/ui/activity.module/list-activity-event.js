import React from 'react';
// import RequestPromise from 'request-promise-native';

export default class ListActivity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_activity_event: []
    }
  }

  componentDidMount() {
    this.setState(function(){
      return {list_activity_event : this.getList()}
    });
  }

  getList() {
    return [
      {
        id: 'l-123',
        type: 'event',
        event_name: 'my-event',
        service_name: 'my-service',
        service_host: 'www.my-service.com',
        time: '2019-08-22T16:38:37.751Z',
        content: {
          item_id: '1254',
          item_qte: '1254',
          toral: '12',
        }
      },
      {
        id: 'l-123',
        type: 'event',
        event_name: 'my-event',
        service_name: 'my-service',
        service_host: 'www.my-service.com',
        time: '2019-08-22T16:38:37.751Z',
        content: {
          item_id: '1254',
          item_qte: '1254',
          toral: '12',
        }
      },
      {
        id: 'l-123',
        type: 'event',
        event_name: 'my-event',
        service_name: 'my-service',
        service_host: 'www.my-service.com',
        time: '2019-08-22T16:38:37.751Z',
        content: {
          item_id: '1254',
          item_qte: '1254',
          toral: '12',
        }
      }
    ]
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
            <span>{activity.service_name}</span>
            <span>{activity.event_name}</span>
            <span>{activity.time}</span>
          </div>

          <div id={key} className="element-activity-content collapse">
          <label>message : </label>
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