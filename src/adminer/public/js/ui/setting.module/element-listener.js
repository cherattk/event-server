import React from 'react';
import EventMapManager from '../../service/event-map-manager';
import { UIEvent, DataEvent } from '../../service/ui-event';

export default class ElementListener extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      id: '',
      type: 'listener',
      event_id: '',
      endpoint: '',
      description: ''
    };

    this.state = {
      listener: this.initialState
    }
  }

  componentDidMount() {
    let listener_id = this.props.listener_id;
    var self = this;
    ////////////////////////////////////////////////////////
    var _listener_for_update = DataEvent.addListener('update-element-listener', function () {
      self.setState(function () {
        return { listener: EventMapManager.getData('listener', listener_id) }
      });
    });
    this.setState(function () {
      return { listener: EventMapManager.getData('listener', listener_id) }
    });

    // this.listenerArray.push(_listener_for_update);
  }

  editElement() {
    UIEvent.dispatch('show-listener-form', { listener_id: this.props.listener_id });
  }

  deleteElement() {
    let endpoint = this.state.listener.endpoint;
    // todo : use some modal component
    var msg = `You are going to delete the listener : + ${endpoint} \n Are you sure ?`;
    let ok = confirm(msg);
    if (ok) {
      EventMapManager.deleteData(this.state.listener);
    }
  }

  render() {
    let listener = this.state.listener;
    return (
      <li id={listener.id}>
        <p>{listener.endpoint}</p>
        <div className="div-control">
          <button type="button" className="btn btn-primary"
            onClick={this.editElement.bind(this)}>
            E
          </button>
          <button type="button" className="btn btn-danger"
            onClick={this.deleteElement.bind(this)}>
            D
          </button>
        </div>
      </li>
    );
  }
}