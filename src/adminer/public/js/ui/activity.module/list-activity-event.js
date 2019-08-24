import React from 'react';
import RequestPromise from 'request-promise-native';
import ElementActivityEvent from './element-activity-event';

export default class ListActivity extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      list_activity_event: [
        {
          id: 'l-123',
          type: 'event',
          event_name: 'my-event',
          service_name: 'my-service',
          service_host: 'www.my-service.com',
          time: '2019-08-22T16:38:37.751Z',
          message: {
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
          message: {
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
          message: {
            item_id: '1254',
            item_qte: '1254',
            toral: '12',
          }
        }
      ]
    }
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    // let endpoint = 'http://localhost:4000/activity?tag=event';
    // let opts = {
    //   url: endpoint,
    //   json: true
    // };
    // var self = this;
    // RequestPromise.get(opts).then(function (response) {
    //   if (response.data.length) {
    //     self.setState(function () {
    //       return { list_activity: response.data };
    //     });
    //   }
    // }).catch(function (error) {
    //   console.error(error);

    // });
  }

  emptyState() {
    return <li>no activities yet</li>;
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
            <span>{activity.service_host}</span>
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
          <span>host</span>
          <span>event</span>
          <span>time</span>
        </li>
        {this.state.list_activity_event.length ?
          this.renderList() :
          this.emptyState()
        }
      </ul>
    );
  }
}